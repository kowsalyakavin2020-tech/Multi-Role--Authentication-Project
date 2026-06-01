import { useState, useEffect } from "react";
import { ClipboardList, Search, Clock, CheckCircle, XCircle, Package } from "lucide-react";
import apiClient from "../../services/api/apiClient";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/vendor/orders");
      setOrders(response.data.data);
    } catch (err) {
      setError("Failed to load orders. Please try again!");
    } finally {
      setLoading(false);
    }
  };

  const filtered = orders.filter((o) => {
    const matchSearch =
      o.product_name?.toLowerCase().includes(search.toLowerCase()) ||
      o.supplier_name?.toLowerCase().includes(search.toLowerCase()) ||
      o.order_id?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || o.status === filter;
    return matchSearch && matchFilter;
  });

  const pending = orders.filter((o) => o.status === "Pending").length;
  const approved = orders.filter((o) => o.status === "Approved").length;
  const rejected = orders.filter((o) => o.status === "Rejected").length;

  const getStatusStyle = (status) => {
    if (status === "Approved") return "bg-green-500 text-white";
    if (status === "Rejected") return "bg-red-500 text-white";
    if (status === "Completed") return "bg-blue-500 text-white";
    return "bg-yellow-500 text-white";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-slate-700 text-sm font-medium">Loading orders...</p>
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
          <ClipboardList size={20} className="text-blue-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">My Orders</h2>
          <p className="text-slate-600 text-sm">Track all your product requests</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-500 rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-400/40 rounded-xl flex items-center justify-center text-white">
            <ClipboardList size={22} />
          </div>
          <div>
            <p className="text-blue-100 text-sm font-medium">Total Orders</p>
            <p className="text-3xl font-bold text-white">{orders.length}</p>
          </div>
        </div>

        <div className="bg-yellow-500 rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-yellow-400/40 rounded-xl flex items-center justify-center text-white">
            <Clock size={22} />
          </div>
          <div>
            <p className="text-yellow-100 text-sm font-medium">Pending</p>
            <p className="text-3xl font-bold text-white">{pending}</p>
          </div>
        </div>

        <div className="bg-green-500 rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-green-400/40 rounded-xl flex items-center justify-center text-white">
            <CheckCircle size={22} />
          </div>
          <div>
            <p className="text-green-100 text-sm font-medium">Approved</p>
            <p className="text-3xl font-bold text-white">{approved}</p>
          </div>
        </div>

        <div className="bg-red-500 rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-red-400/40 rounded-xl flex items-center justify-center text-white">
            <XCircle size={22} />
          </div>
          <div>
            <p className="text-red-100 text-sm font-medium">Rejected</p>
            <p className="text-3xl font-bold text-white">{rejected}</p>
          </div>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm mb-4 p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search by product, supplier or order ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm text-slate-800 font-medium border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-slate-400"
          />
        </div>
        <div className="flex gap-2">
          {["All", "Pending", "Approved", "Rejected", "Completed"].map((f) => (
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
          Showing {filtered.length} orders
        </p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-800 text-white">
            <tr>
              <th className="px-4 py-3 font-semibold">Order ID</th>
              <th className="px-4 py-3 font-semibold">Product Name</th>
              <th className="px-4 py-3 font-semibold">Quantity</th>
              <th className="px-4 py-3 font-semibold">Supplier</th>
              <th className="px-4 py-3 font-semibold">Message</th>
              <th className="px-4 py-3 font-semibold">Requested Date</th>
              <th className="px-4 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((order) => (
              <tr key={order.order_id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3">
                  <span className="bg-slate-200 text-slate-800 px-2 py-1 rounded-md text-xs font-bold">
                    {order.order_id}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {order.product_name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-semibold text-slate-900">{order.product_name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 font-bold text-slate-900">{order.quantity}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {order.supplier_name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-semibold text-slate-800">{order.supplier_name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-600 max-w-xs">
                  <p className="truncate text-xs font-medium">
                    {order.message || "—"}
                  </p>
                </td>
                <td className="px-4 py-3 text-slate-700 font-medium">
                  {new Date(order.created_at).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusStyle(order.status)}`}>
                    ● {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <Package size={40} className="mx-auto mb-2 text-slate-300" />
            <p className="text-sm font-semibold text-slate-700">No orders found</p>
            <p className="text-xs mt-1 text-slate-500">Browse products and send a request!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyOrders;