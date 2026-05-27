import { useEffect, useState } from "react";
import apiClient from "../../../../backend/services/api/apiClient";

function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await apiClient.get("/admin/vendors");
        setVendors(response.data.data);
      } catch (err) {
        setError("Failed to load vendors!");
      } finally {
        setLoading(false);
      }
    };
    fetchVendors();
  }, []);

  const handleBlock = async (userId) => {
    try {
      await apiClient.put(`/admin/users/${userId}/block`);
      setVendors((prev) =>
        prev.map((v) =>
          v.user_id === userId
            ? { ...v, status: v.status === "Active" ? "Blocked" : "Active" }
            : v
        )
      );
    } catch (err) {
      alert("Failed to update status!");
    }
  };

  const handleApprove = async (userId) => {
    try {
      await apiClient.put(`/admin/users/${userId}/approve`);
      setVendors((prev) =>
        prev.map((v) =>
          v.user_id === userId ? { ...v, status: "Active" } : v
        )
      );
    } catch (err) {
      alert("Failed to approve vendor!");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-900 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-500 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p className="text-red-600 font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Vendors</h2>
          <p className="text-gray-500 text-sm mt-1">Manage all vendors</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-blue-900 text-white">
            <tr>
              <th className="px-4 py-3">Vendor ID</th>
              <th className="px-4 py-3">Vendor Name</th>
              <th className="px-4 py-3">Business Name</th>
              <th className="px-4 py-3">Mobile Number</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {vendors.map((vendor) => (
              <tr key={vendor.user_id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-3 text-gray-600">{vendor.user_id}</td>
                <td className="px-4 py-3 font-medium text-gray-800">{vendor.name}</td>
                <td className="px-4 py-3 text-gray-600">{vendor.business_name}</td>
                <td className="px-4 py-3 text-gray-600">{vendor.mobile}</td>
                <td className="px-4 py-3 text-gray-600">{vendor.location}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    vendor.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : vendor.status === "Blocked"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {vendor.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-xs hover:bg-blue-200 transition">
                      View
                    </button>
                    <button
                      onClick={() => handleApprove(vendor.user_id)}
                      className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-xs hover:bg-green-200 transition"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleBlock(vendor.user_id)}
                      className={`px-3 py-1 rounded-lg text-xs transition ${
                        vendor.status === "Blocked"
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-red-100 text-red-700 hover:bg-red-200"
                      }`}
                    >
                      {vendor.status === "Blocked" ? "Unblock" : "Block"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {vendors.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-4xl mb-2">🏪</p>
            <p className="text-sm">No vendors found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Vendors;