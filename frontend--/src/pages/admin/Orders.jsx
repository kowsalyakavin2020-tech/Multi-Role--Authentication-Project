import { useEffect, useState } from "react";
import apiClient from "../../../../backend/services/api/apiClient";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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
    fetchOrders();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Approved":
        return "bg-blue-100 text-blue-700";
      case "Rejected":
        return "bg-red-100 text-red-700";
      case "Completed":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
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
          <h2 className="text-2xl font-bold text-gray-800">Order Management</h2>
          <p className="text-gray-500 text-sm mt-1">Monitor all orders</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-blue-900 text-white">
            <tr>
              <th className="px-4 py-3">Vendor Name</th>
              <th className="px-4 py-3">Supplier Name</th>
              <th className="px-4 py-3">Product Name</th>
              <th className="px-4 py-3">Quantity</th>
              <th className="px-4 py-3">Order Status</th>
              <th className="px-4 py-3">Requested Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => (
              <tr key={order.order_id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-3 font-medium text-gray-800">
                  {order.vendor_name}
                </td>
                <td className="px-4 py-3 text-gray-600">{order.supplier_name}</td>
                <td className="px-4 py-3 text-gray-600">{order.product_name}</td>
                <td className="px-4 py-3 text-gray-600">{order.quantity}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusStyle(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600">{order.requested_date}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {orders.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-4xl mb-2">📋</p>
            <p className="text-sm">No orders found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;