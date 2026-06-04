import { useEffect, useState } from "react";
import apiClient from "../../../../backend/services/api/apiClient";
import {
  ClipboardList, Search, Clock, CheckCircle, XCircle,
  PackageCheck, RefreshCw, Ban, Eye, X, ChevronDown,
} from "lucide-react";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [updatingId, setUpdatingId] = useState(null);
  const [viewOrder, setViewOrder] = useState(null);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try {
      const response = await apiClient.get("/admin/orders");
      setOrders(response.data.data);
    } catch (err) {
      setError("Failed to load orders!");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await apiClient.put(`/orders/${orderId}/status`, { status: newStatus });
      setOrders((prev) =>
        prev.map((o) => o.order_id === orderId ? { ...o, status: newStatus } : o)
      );
      if (viewOrder?.order_id === orderId) {
        setViewOrder((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      alert("Failed to update order status!");
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Pending": return { bg: "bg-yellow-500", text: "text-white", light: "bg-yellow-50 text-yellow-700" };
      case "Approved": return { bg: "bg-blue-600", text: "text-white", light: "bg-blue-50 text-blue-700" };
      case "Rejected": return { bg: "bg-red-600", text: "text-white", light: "bg-red-50 text-red-700" };
      case "Processing": return { bg: "bg-purple-600", text: "text-white", light: "bg-purple-50 text-purple-700" };
      case "Completed": return { bg: "bg-green-600", text: "text-white", light: "bg-green-50 text-green-700" };
      default: return { bg: "bg-slate-100", text: "text-slate-700", light: "bg-slate-50 text-slate-700" };
    }
  };

  const filtered = orders.filter((o) => {
    const matchSearch =
      o.vendor_name?.toLowerCase().includes(search.toLowerCase()) ||
      o.supplier_name?.toLowerCase().includes(search.toLowerCase()) ||
      o.product_name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const counts = {
    pending: orders.filter((o) => o.status === "Pending").length,
    approved: orders.filter((o) => o.status === "Approved").length,
    rejected: orders.filter((o) => o.status === "Rejected").length,
    processing: orders.filter((o) => o.status === "Processing").length,
    completed: orders.filter((o) => o.status === "Completed").length,
  };

  const statCards = [
    { label: "Pending", value: counts.pending, icon: <Clock className="w-5 h-5" />, from: "#f59e0b", to: "#d97706" },
    { label: "Approved", value: counts.approved, icon: <CheckCircle className="w-5 h-5" />, from: "#3b82f6", to: "#2563eb" },
    { label: "Processing", value: counts.processing, icon: <RefreshCw className="w-5 h-5" />, from: "#a855f7", to: "#9333ea" },
    { label: "Rejected", value: counts.rejected, icon: <XCircle className="w-5 h-5" />, from: "#ef4444", to: "#dc2626" },
    { label: "Completed", value: counts.completed, icon: <PackageCheck className="w-5 h-5" />, from: "#22c55e", to: "#16a34a" },
  ];

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-gray-500 text-sm">Loading orders...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
      <p className="text-red-700 font-semibold">{error}</p>
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <ClipboardList className="text-gray-400 w-7 h-7" />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Order Management</h2>
            <p className="text-gray-400 text-sm mt-0.5">Monitor, update and track all orders</p>
          </div>
        </div>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 border border-gray-200 hover:border-blue-300 px-3 py-2 rounded-lg transition"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
        {statCards.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl p-4 flex items-center gap-3 shadow-sm cursor-pointer"
            style={{ background: `linear-gradient(135deg, ${s.from}, ${s.to})` }}
            onClick={() => setFilterStatus(s.label === filterStatus ? "All" : s.label)}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white"
              style={{ background: "rgba(255,255,255,0.2)" }}>
              {s.icon}
            </div>
            <div>
              <p className="text-white/75 text-xs font-medium">{s.label}</p>
              <p className="text-white text-2xl font-extrabold leading-none mt-0.5">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by vendor, supplier or product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400"
          />
        </div>
        <div className="relative">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="pl-3 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 appearance-none bg-white text-gray-600"
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Processing">Processing</option>
            <option value="Rejected">Rejected</option>
            <option value="Completed">Completed</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
        <span className="text-sm text-gray-400 ml-auto">
          Showing <span className="font-semibold text-gray-700">{filtered.length}</span> orders
        </span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead>
            <tr style={{ background: "linear-gradient(135deg, #1e2d6b, #2a3a8a)" }}>
              {["Order ID", "Vendor Name", "Supplier Name", "Product Name", "Quantity", "Status", "Date", "Actions"].map((h) => (
                <th key={h} className="px-4 py-3 text-white/80 text-xs font-semibold uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((order, index) => {
              const st = getStatusStyle(order.status);
              return (
                <tr key={order.order_id}
                  className="hover:bg-blue-50/40 transition"
                  style={{ background: index % 2 === 0 ? "white" : "#fafafa" }}>
                  <td className="px-4 py-3 font-mono text-xs font-bold text-gray-500">{order.order_id}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0">
                        {order.vendor_name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-semibold text-gray-800">{order.vendor_name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 font-medium">{order.supplier_name}</td>
                  <td className="px-4 py-3 text-gray-600 font-medium">{order.product_name}</td>
                  <td className="px-4 py-3 font-bold text-gray-800">{order.quantity}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${st.bg} ${st.text}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-white/70"></span>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {order.created_at ? new Date(order.created_at).toLocaleDateString("en-IN", {
                      day: "2-digit", month: "short", year: "numeric"
                    }) : "N/A"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5 flex-wrap">
                      <button
                        onClick={() => setViewOrder(order)}
                        className="flex items-center gap-1 bg-gray-700 hover:bg-gray-800 text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold transition"
                      >
                        <Eye className="w-3 h-3" /> View
                      </button>
                      {order.status === "Pending" && (
                        <>
                          <button onClick={() => handleUpdateStatus(order.order_id, "Approved")}
                            disabled={updatingId === order.order_id}
                            className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold transition disabled:opacity-50">
                            <CheckCircle className="w-3 h-3" /> Approve
                          </button>
                          <button onClick={() => handleUpdateStatus(order.order_id, "Rejected")}
                            disabled={updatingId === order.order_id}
                            className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold transition disabled:opacity-50">
                            <XCircle className="w-3 h-3" /> Reject
                          </button>
                          <button onClick={() => handleUpdateStatus(order.order_id, "Rejected")}
                            disabled={updatingId === order.order_id}
                            className="flex items-center gap-1 bg-gray-400 hover:bg-gray-500 text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold transition disabled:opacity-50">
                            <Ban className="w-3 h-3" /> Cancel
                          </button>
                        </>
                      )}
                      {order.status === "Approved" && (
                        <>
                          <button onClick={() => handleUpdateStatus(order.order_id, "Processing")}
                            disabled={updatingId === order.order_id}
                            className="flex items-center gap-1 bg-purple-600 hover:bg-purple-700 text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold transition disabled:opacity-50">
                            <RefreshCw className="w-3 h-3" /> Processing
                          </button>
                          <button onClick={() => handleUpdateStatus(order.order_id, "Rejected")}
                            disabled={updatingId === order.order_id}
                            className="flex items-center gap-1 bg-gray-400 hover:bg-gray-500 text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold transition disabled:opacity-50">
                            <Ban className="w-3 h-3" /> Cancel
                          </button>
                        </>
                      )}
                      {order.status === "Processing" && (
                        <>
                          <button onClick={() => handleUpdateStatus(order.order_id, "Completed")}
                            disabled={updatingId === order.order_id}
                            className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold transition disabled:opacity-50">
                            <PackageCheck className="w-3 h-3" /> Complete
                          </button>
                          <button onClick={() => handleUpdateStatus(order.order_id, "Rejected")}
                            disabled={updatingId === order.order_id}
                            className="flex items-center gap-1 bg-gray-400 hover:bg-gray-500 text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold transition disabled:opacity-50">
                            <Ban className="w-3 h-3" /> Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <ClipboardList className="w-6 h-6 text-gray-300" />
            </div>
            <p className="text-gray-500 text-sm font-medium">No orders found</p>
            <p className="text-gray-300 text-xs mt-1">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* View Modal */}
      {viewOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Eye className="w-5 h-5 text-indigo-600" /> Order Details
              </h3>
              <button onClick={() => setViewOrder(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-400 font-medium mb-1">Order ID</p>
                <p className="font-bold text-gray-900 font-mono">{viewOrder.order_id}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-indigo-50 rounded-xl p-4">
                  <p className="text-xs text-indigo-500 font-medium mb-2">Vendor</p>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {viewOrder.vendor_name?.charAt(0).toUpperCase()}
                    </div>
                    <p className="font-bold text-gray-900">{viewOrder.vendor_name}</p>
                  </div>
                </div>
                <div className="bg-green-50 rounded-xl p-4">
                  <p className="text-xs text-green-500 font-medium mb-2">Supplier</p>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {viewOrder.supplier_name?.charAt(0).toUpperCase()}
                    </div>
                    <p className="font-bold text-gray-900">{viewOrder.supplier_name}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-xl p-4">
                  <p className="text-xs text-blue-500 font-medium mb-1">Product</p>
                  <p className="font-bold text-gray-900">{viewOrder.product_name}</p>
                </div>
                <div className="bg-yellow-50 rounded-xl p-4">
                  <p className="text-xs text-yellow-600 font-medium mb-1">Quantity</p>
                  <p className="font-bold text-gray-900 text-xl">{viewOrder.quantity}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-400 font-medium mb-2">Status</p>
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle(viewOrder.status).bg} ${getStatusStyle(viewOrder.status).text}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-white/70"></span>
                    {viewOrder.status}
                  </span>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-400 font-medium mb-1">Requested Date</p>
                  <p className="font-bold text-gray-900">
                    {viewOrder.created_at ? new Date(viewOrder.created_at).toLocaleDateString("en-IN", {
                      day: "2-digit", month: "short", year: "numeric"
                    }) : "N/A"}
                  </p>
                </div>
              </div>

              {viewOrder.message && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-400 font-medium mb-1">Message</p>
                  <p className="text-gray-800 font-medium text-sm">{viewOrder.message}</p>
                </div>
              )}

              {/* Quick Status Update inside Modal */}
              {["Pending", "Approved", "Processing"].includes(viewOrder.status) && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-400 font-medium mb-3">Update Status</p>
                  <div className="flex gap-2 flex-wrap">
                    {viewOrder.status === "Pending" && (
                      <>
                        <button onClick={() => handleUpdateStatus(viewOrder.order_id, "Approved")}
                          className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition">
                          <CheckCircle className="w-3 h-3" /> Approve
                        </button>
                        <button onClick={() => handleUpdateStatus(viewOrder.order_id, "Rejected")}
                          className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition">
                          <XCircle className="w-3 h-3" /> Reject
                        </button>
                      </>
                    )}
                    {viewOrder.status === "Approved" && (
                      <button onClick={() => handleUpdateStatus(viewOrder.order_id, "Processing")}
                        className="flex items-center gap-1 bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition">
                        <RefreshCw className="w-3 h-3" /> Mark Processing
                      </button>
                    )}
                    {viewOrder.status === "Processing" && (
                      <button onClick={() => handleUpdateStatus(viewOrder.order_id, "Completed")}
                        className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition">
                        <PackageCheck className="w-3 h-3" /> Mark Complete
                      </button>
                    )}
                    <button onClick={() => handleUpdateStatus(viewOrder.order_id, "Rejected")}
                      className="flex items-center gap-1 bg-gray-400 hover:bg-gray-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition">
                      <Ban className="w-3 h-3" /> Cancel Order
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-gray-100">
              <button onClick={() => setViewOrder(null)}
                className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition"
                style={{ background: "linear-gradient(135deg, #1e2d6b, #2a3a8a)" }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Orders;