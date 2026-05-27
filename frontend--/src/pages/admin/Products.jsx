import { useEffect, useState } from "react";
import apiClient from "../../../../backend/services/api/apiClient";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiClient.get("/admin/products");
        setProducts(response.data.data);
      } catch (err) {
        setError("Failed to load products!");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleApprove = async (productId) => {
    try {
      await apiClient.put(`/admin/products/${productId}/approve`);
      setProducts((prev) =>
        prev.map((p) =>
          p.product_id === productId ? { ...p, status: "Active" } : p
        )
      );
    } catch (err) {
      alert("Failed to approve product!");
    }
  };

  const handleReject = async (productId) => {
    try {
      await apiClient.put(`/admin/products/${productId}/reject`);
      setProducts((prev) =>
        prev.map((p) =>
          p.product_id === productId ? { ...p, status: "Rejected" } : p
        )
      );
    } catch (err) {
      alert("Failed to reject product!");
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await apiClient.delete(`/admin/products/${productId}`);
      setProducts((prev) => prev.filter((p) => p.product_id !== productId));
    } catch (err) {
      alert("Failed to delete product!");
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
          <h2 className="text-2xl font-bold text-gray-800">Product Monitoring</h2>
          <p className="text-gray-500 text-sm mt-1">Monitor and manage all products</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-blue-900 text-white">
            <tr>
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3">Product Name</th>
              <th className="px-4 py-3">Supplier Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((product) => (
              <tr key={product.product_id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-3">
                  <img
                    src={product.image || `https://api.dicebear.com/7.x/shapes/svg?seed=${product.name}&backgroundColor=dbeafe`}
                    alt={product.name}
                    className="w-10 h-10 rounded-lg object-cover"
                    onError={(e) => {
                      e.target.src = "https://api.dicebear.com/7.x/shapes/svg?seed=fallback&backgroundColor=e2e8f0";
                    }}
                  />
                </td>
                <td className="px-4 py-3 font-medium text-gray-800">{product.name}</td>
                <td className="px-4 py-3 text-gray-600">{product.supplier_name}</td>
                <td className="px-4 py-3 text-gray-600">{product.category}</td>
                <td className="px-4 py-3 text-gray-600">{product.stock}</td>
                <td className="px-4 py-3 text-gray-600">₹{product.price}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    product.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : product.status === "Rejected"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {product.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-xs hover:bg-blue-200 transition">
                      View
                    </button>
                    <button
                      onClick={() => handleApprove(product.product_id)}
                      className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-xs hover:bg-green-200 transition"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(product.product_id)}
                      className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-lg text-xs hover:bg-yellow-200 transition"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleDelete(product.product_id)}
                      className="bg-red-100 text-red-700 px-3 py-1 rounded-lg text-xs hover:bg-red-200 transition"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {products.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-4xl mb-2">📦</p>
            <p className="text-sm">No products found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;