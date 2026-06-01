import { useEffect, useState } from "react";
import apiClient from "../../../../backend/services/api/apiClient";
import { ShoppingBag, Search, CheckCircle, Ban, Eye } from "lucide-react";

function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    fetchVendors();
  }, []);

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

  const filtered = vendors.filter((v) => {
    const matchSearch =
      v.name?.toLowerCase().includes(search.toLowerCase()) ||
      v.business_name?.toLowerCase().includes(search.toLowerCase()) ||
      v.user_id?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || v.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const activeCount = vendors.filter((v) => v.status === "Active").length;
  const blockedCount = vendors.filter((v) => v.status === "Blocked").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-slate-600 text-sm font-medium">Loading vendors...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p className="text-red-700 font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <ShoppingBag size={24} className="text-green-600" />
            Vendor Management
          </h2>
          <p className="text-slate-600 text-sm mt-1 font-medium">
            View, approve and manage all vendor accounts
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        <div className="bg-green-600 text-white rounded-xl p-4 flex items-center gap-3 shadow">
          <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
            <ShoppingBag size={20} />
          </div>
          <div>
            <p className="text-green-100 text-xs font-medium">Total Vendors</p>
            <p className="text-2xl font-bold">{vendors.length}</p>
          </div>
        </div>
        <div className="bg-blue-600 text-white rounded-xl p-4 flex items-center gap-3 shadow">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
            <CheckCircle size={20} />
          </div>
          <div>
            <p className="text-blue-100 text-xs font-medium">Active</p>
            <p className="text-2xl font-bold">{activeCount}</p>
          </div>
        </div>
        <div className="bg-red-600 text-white rounded-xl p-4 flex items-center gap-3 shadow">
          <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
            <Ban size={20} />
          </div>
          <div>
            <p className="text-red-100 text-xs font-medium">Blocked</p>
            <p className="text-2xl font-bold">{blockedCount}</p>
          </div>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 mb-4 shadow-sm flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, business or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Blocked">Blocked</option>
        </select>
        <div className="self-center text-sm text-slate-600 font-semibold">
          Showing <span className="text-slate-900">{filtered.length}</span> vendors
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-800 text-white">
            <tr>
              <th className="px-4 py-3 font-semibold">Vendor ID</th>
              <th className="px-4 py-3 font-semibold">Vendor Name</th>
              <th className="px-4 py-3 font-semibold">Business Name</th>
              <th className="px-4 py-3 font-semibold">Mobile Number</th>
              <th className="px-4 py-3 font-semibold">Location</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((vendor) => (
              <tr key={vendor.user_id} className="hover:bg-slate-50 transition">
                <td className="px-4 py-3 text-slate-600 text-xs font-mono font-semibold">
                  {vendor.user_id}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0">
                      {vendor.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-bold text-slate-900">{vendor.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-700 font-medium">{vendor.business_name}</td>
                <td className="px-4 py-3 text-slate-700 font-medium">{vendor.mobile}</td>
                <td className="px-4 py-3 text-slate-700 font-medium">{vendor.location}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                    vendor.status === "Active"
                      ? "bg-green-100 text-green-800"
                      : vendor.status === "Blocked"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                    {vendor.status || "Active"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs hover:bg-blue-700 transition font-semibold flex items-center gap-1">
                      <Eye size={12} />
                      View
                    </button>
                    <button
                      onClick={() => handleApprove(vendor.user_id)}
                      className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs hover:bg-green-700 transition font-semibold flex items-center gap-1"
                    >
                      <CheckCircle size={12} />
                      Approve
                    </button>
                    <button
                      onClick={() => handleBlock(vendor.user_id)}
                      className={`px-3 py-1.5 rounded-lg text-xs transition font-semibold flex items-center gap-1 ${
                        vendor.status === "Blocked"
                          ? "bg-green-600 text-white hover:bg-green-700"
                          : "bg-red-600 text-white hover:bg-red-700"
                      }`}
                    >
                      <Ban size={12} />
                      {vendor.status === "Blocked" ? "Unblock" : "Block"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <ShoppingBag size={40} className="mx-auto mb-2 text-slate-200" />
            <p className="text-sm font-medium">No vendors found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Vendors;