import { useState, useEffect } from "react";
import apiClient from "../../services/api/apiClient";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/vendor/orders");
      setOrders(response.data.orders);
    } catch (err) {
      setError("Failed to load orders. Please try again!");
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    if (status === "Approved") return "bg-green-100 text-green-700";
    if (status === "Rejected") return "bg-red-100 text-red-700";
    return "bg-yellow-100 text-yellow-700";
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
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">My Orders</h2>
        <p className="text-gray-500 text-sm mt-1">
          Track all your product requests
        </p>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-blue-900 text-white">
            <tr>
              <th className="px-4 py-3">Order ID</th>
              <th className="px-4 py-3">Product Name</th>
              <th className="px-4 py-3">Quantity</th>
              <th className="px-4 py-3">Supplier</th>
              <th className="px-4 py-3">Requested Date</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => (
              <tr key={order.order_id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-3 text-gray-500 text-xs">{order.order_id}</td>
                <td className="px-4 py-3 font-medium text-gray-800">{order.product_name}</td>
                <td className="px-4 py-3 text-gray-600">{order.quantity}</td>
                <td className="px-4 py-3 text-gray-600">{order.supplier_name}</td>
                <td className="px-4 py-3 text-gray-600">
                  {new Date(order.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusStyle(order.status)}`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {orders.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-4xl mb-2">🛒</p>
            <p className="text-sm">No orders yet. Browse products and send a request!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyOrders;