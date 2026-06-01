import { useEffect, useState } from "react";
import apiClient from "../../../../backend/services/api/apiClient";
import { ClipboardList, Search, Clock, CheckCircle, XCircle, PackageCheck } from "lucide-react";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    fetchOrders();
  }, []);

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

  const getStatusStyle = (status) => {
    switch (status) {
      case "Pending": return "bg-yellow-100 text-yellow-800";
      case "Approved": return "bg-blue-100 text-blue-800";
      case "Rejected": return "bg-red-100 text-red-800";
      case "Completed": return "bg-green-100 text-green-800";
      default: return "bg-slate-100 text-slate-700";
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

  const pendingCount = orders.filter((o) => o.status === "Pending").length;
  const approvedCount = orders.filter((o) => o.status === "Approved").length;
  const rejectedCount = orders.filter((o) => o.status === "Rejected").length;
  const completedCount = orders.filter((o) => o.status === "Completed").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-slate-600 text-sm font-medium">Loading orders...</p>
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
            <ClipboardList size={24} className="text-indigo-600" />
            Order Management
          </h2>
          <p className="text-slate-600 text-sm mt-1 font-medium">
            Monitor and track all orders
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        <div className="bg-yellow-500 text-white rounded-xl p-4 flex items-center gap-3 shadow">
          <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center">
            <Clock size={20} />
          </div>
          <div>
            <p className="text-yellow-100 text-xs font-medium">Pending</p>
            <p className="text-2xl font-bold">{pendingCount}</p>
          </div>
        </div>
        <div className="bg-blue-600 text-white rounded-xl p-4 flex items-center gap-3 shadow">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
            <CheckCircle size={20} />
          </div>
          <div>
            <p className="text-blue-100 text-xs font-medium">Approved</p>
            <p className="text-2xl font-bold">{approvedCount}</p>
          </div>
        </div>
        <div className="bg-red-600 text-white rounded-xl p-4 flex items-center gap-3 shadow">
          <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
            <XCircle size={20} />
          </div>
          <div>
            <p className="text-red-100 text-xs font-medium">Rejected</p>
            <p className="text-2xl font-bold">{rejectedCount}</p>
          </div>
        </div>
        <div className="bg-green-600 text-white rounded-xl p-4 flex items-center gap-3 shadow">
          <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
            <PackageCheck size={20} />
          </div>
          <div>
            <p className="text-green-100 text-xs font-medium">Completed</p>
            <p className="text-2xl font-bold">{completedCount}</p>
          </div>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 mb-4 shadow-sm flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by vendor, supplier or product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
          <option value="Completed">Completed</option>
        </select>
        <div className="self-center text-sm text-slate-600 font-semibold">
          Showing <span className="text-slate-900">{filtered.length}</span> orders
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-800 text-white">
            <tr>
              <th className="px-4 py-3 font-semibold">Order ID</th>
              <th className="px-4 py-3 font-semibold">Vendor Name</th>
              <th className="px-4 py-3 font-semibold">Supplier Name</th>
              <th className="px-4 py-3 font-semibold">Product Name</th>
              <th className="px-4 py-3 font-semibold">Quantity</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Requested Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((order) => (
              <tr key={order.order_id} className="hover:bg-slate-50 transition">
                <td className="px-4 py-3 text-slate-600 text-xs font-mono font-semibold">
                  {order.order_id}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0">
                      {order.vendor_name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-bold text-slate-900">{order.vendor_name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-700 font-medium">{order.supplier_name}</td>
                <td className="px-4 py-3 text-slate-700 font-medium">{order.product_name}</td>
                <td className="px-4 py-3 font-bold text-slate-900">{order.quantity}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${getStatusStyle(order.status)}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-700 font-medium">
                  {order.created_at
                    ? new Date(order.created_at).toLocaleDateString()
                    : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <ClipboardList size={40} className="mx-auto mb-2 text-slate-200" />
            <p className="text-sm font-medium">No orders found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;