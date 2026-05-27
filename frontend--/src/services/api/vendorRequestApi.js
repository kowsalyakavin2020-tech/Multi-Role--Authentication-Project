import apiClient from "./apiClient";

export const getVendorRequests = async () => {
  const response = await apiClient.get("/supplier/vendor-requests");
  return response.data;
};

export const approveVendorRequest = async (requestId) => {
  const response = await apiClient.put(`/supplier/vendor-requests/${requestId}/approve`);
  return response.data;
};

export const rejectVendorRequest = async (requestId) => {
  const response = await apiClient.put(`/supplier/vendor-requests/${requestId}/reject`);
  return response.data;
};