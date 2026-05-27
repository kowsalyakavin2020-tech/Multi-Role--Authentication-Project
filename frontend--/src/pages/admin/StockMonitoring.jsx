import { useEffect, useState } from "react";
import apiClient from "../../../../backend/services/api/apiClient";

function StockMonitoring() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiClient.get("/admin/products");
        setProducts(response.data.data);
      } catch (err) {
        setError("Failed to load stock data!");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const getStockStyle = (stock) => {
    if (stock === 0) return "bg-red-100 text-red-700";
    if (stock < 20) return "bg-yellow-100 text-yellow-700";
    return "bg-green-100 text-green-700";
  };

  const getStockLabel = (stock) => {
    if (stock === 0) return "Out of Stock";
    if (stock < 20) return "Low Stock";
    return "In Stock";
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
          <h2 className="text-2xl font-bold text-gray-800">Stock Monitoring</h2>
          <p className="text-gray-500 text-sm mt-1">Monitor all product stock levels</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-xl">
            📦
          </div>
          <div>
            <p className="text-gray-500 text-sm">In Stock</p>
            <p className="text-2xl font-bold text-gray-800">
              {products.filter((p) => p.stock >= 20).length}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center text-xl">
            ⚠️
          </div>
          <div>
            <p className="text-gray-500 text-sm">Low Stock</p>
            <p className="text-2xl font-bold text-gray-800">
              {products.filter((p) => p.stock > 0 && p.stock < 20).length}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center text-xl">
            🚫
          </div>
          <div>
            <p className="text-gray-500 text-sm">Out of Stock</p>
            <p className="text-2xl font-bold text-gray-800">
              {products.filter((p) => p.stock === 0).length}
            </p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-blue-900 text-white">
            <tr>
              <th className="px-4 py-3">Product Name</th>
              <th className="px-4 py-3">Supplier Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((product) => (
              <tr key={product.product_id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-3 font-medium text-gray-800">{product.name}</td>
                <td className="px-4 py-3 text-gray-600">{product.supplier_name}</td>
                <td className="px-4 py-3 text-gray-600">{product.category}</td>
                <td className="px-4 py-3 text-gray-600">{product.stock}</td>
                <td className="px-4 py-3 text-gray-600">₹{product.price}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStockStyle(product.stock)}`}>
                    {getStockLabel(product.stock)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {products.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-4xl mb-2">📊</p>
            <p className="text-sm">No stock data found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default StockMonitoring;