import { useState, useEffect } from "react";
import { getVendorRequests, approveVendorRequest, rejectVendorRequest } from "../../../backend/services/api/vendorRequestApi";

const useVendorRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await getVendorRequests();
      setRequests(data.requests);
    } catch (err) {
      setError("Failed to load vendor requests. Please try again!");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId) => {
    try {
      await approveVendorRequest(requestId);
      await fetchRequests();
      return { success: true };
    } catch (err) {
      return { success: false, message: "Failed to approve request!" };
    }
  };

  const handleReject = async (requestId) => {
    try {
      await rejectVendorRequest(requestId);
      await fetchRequests();
      return { success: true };
    } catch (err) {
      return { success: false, message: "Failed to reject request!" };
    }
  };

  return {
    requests,
    loading,
    error,
    handleApprove,
    handleReject,
  };
};

export default useVendorRequests;