import { useState } from "react";
import { Handshake, Search, Clock, CheckCircle, XCircle, Check, X } from "lucide-react";
import useVendorRequests from "../../hooks/useVendorRequests";

function VendorRequests() {
  const { requests, loading, error, handleApprove, handleReject } = useVendorRequests();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filtered = requests.filter((r) => {
    const matchSearch =
      r.vendor_name?.toLowerCase().includes(search.toLowerCase()) ||
      r.product_name?.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "All" || r.status === filter;
    return matchSearch && matchFilter;
  });

  const pending = requests.filter((r) => r.status === "Pending").length;
  const approved = requests.filter((r) => r.status === "Approved").length;
  const rejected = requests.filter((r) => r.status === "Rejected").length;

  const getStatusStyle = (status) => {
    if (status === "Approved") return "bg-green-500 text-white";
    if (status === "Rejected") return "bg-red-500 text-white";
    return "bg-yellow-500 text-white";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-slate-700 text-sm font-medium">Loading requests...</p>
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
      <div className="mb-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
          <Handshake size={20} className="text-blue-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Vendor Requests</h2>
          <p className="text-slate-600 text-sm">Manage incoming vendor product requests</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-yellow-500 rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-yellow-400/40 rounded-xl flex items-center justify-center text-white">
            <Clock size={22} />
          </div>
          <div>
            <p className="text-yellow-100 text-sm font-medium">Pending</p>
            <p className="text-3xl font-bold text-white">{pending}</p>
            <p className="text-yellow-200 text-xs font-medium">requests</p>
          </div>
        </div>

        <div className="bg-green-500 rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-green-400/40 rounded-xl flex items-center justify-center text-white">
            <CheckCircle size={22} />
          </div>
          <div>
            <p className="text-green-100 text-sm font-medium">Approved</p>
            <p className="text-3xl font-bold text-white">{approved}</p>
            <p className="text-green-200 text-xs font-medium">requests</p>
          </div>
        </div>

        <div className="bg-red-500 rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-red-400/40 rounded-xl flex items-center justify-center text-white">
            <XCircle size={22} />
          </div>
          <div>
            <p className="text-red-100 text-sm font-medium">Rejected</p>
            <p className="text-3xl font-bold text-white">{rejected}</p>
            <p className="text-red-200 text-xs font-medium">requests</p>
          </div>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm mb-4 p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search by vendor or product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm text-slate-800 font-medium border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-slate-400"
          />
        </div>
        <div className="flex gap-2">
          {["All", "Pending", "Approved", "Rejected"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === f
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <p className="text-slate-600 text-xs font-semibold shrink-0">
          Showing {filtered.length} requests
        </p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-800 text-white">
            <tr>
              <th className="px-4 py-3 font-semibold">Vendor Name</th>
              <th className="px-4 py-3 font-semibold">Product</th>
              <th className="px-4 py-3 font-semibold">Quantity</th>
              <th className="px-4 py-3 font-semibold">Date</th>
              <th className="px-4 py-3 font-semibold">Message</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((request) => (
              <tr key={request.order_id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {request.vendor_name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-semibold text-slate-900">{request.vendor_name}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="bg-slate-200 text-slate-800 px-2 py-1 rounded-md text-xs font-semibold">
                    {request.product_name}
                  </span>
                </td>
                <td className="px-4 py-3 font-bold text-slate-900">{request.quantity}</td>
                <td className="px-4 py-3 text-slate-700 font-medium">
                  {new Date(request.created_at).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="px-4 py-3 text-slate-600 max-w-xs">
                  <p className="truncate text-xs">
                    {request.message || "—"}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusStyle(request.status)}`}>
                    ● {request.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    {request.status === "Pending" ? (
                      <>
                        <button
                          onClick={() => handleApprove(request.order_id)}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1"
                        >
                          <Check size={12} /> Approve
                        </button>
                        <button
                          onClick={() => handleReject(request.order_id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1"
                        >
                          <X size={12} /> Reject
                        </button>
                      </>
                    ) : (
                      <span className="text-slate-400 text-xs font-medium italic">
                        {request.status === "Approved" ? "✓ Approved" : "✗ Rejected"}
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <Handshake size={40} className="mx-auto mb-2 text-slate-300" />
            <p className="text-sm font-semibold text-slate-700">No requests found</p>
            <p className="text-xs mt-1 text-slate-500">Try adjusting your search or filter</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default VendorRequests;