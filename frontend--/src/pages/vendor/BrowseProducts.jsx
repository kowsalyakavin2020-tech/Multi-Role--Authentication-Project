import { useState, useEffect } from "react";
import apiClient from "../../services/api/apiClient";

function BrowseProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [request, setRequest] = useState({
    quantity: "",
    message: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/vendor/products");
      setProducts(response.data.products);
    } catch (err) {
      setError("Failed to load products. Please try again!");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestClick = (product) => {
    setSelectedProduct(product);
    setRequest({ quantity: "", message: "" });
    setShowModal(true);
  };

  const handleSubmitRequest = async () => {
    if (!request.quantity) {
      alert("Please enter quantity!");
      return;
    }
    setSubmitting(true);
    try {
      await apiClient.post("/vendor/request", {
        product_id: selectedProduct.product_id,
        supplier_id: selectedProduct.supplier_id,
        quantity: Number(request.quantity),
        message: request.message,
      });
      alert("Request sent successfully!");
      setShowModal(false);
    } catch (err) {
      alert("Failed to send request. Please try again!");
    } finally {
      setSubmitting(false);
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
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Browse Products</h2>
        <p className="text-gray-500 text-sm mt-1">
          Find and request products from suppliers
        </p>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-blue-900 text-white">
            <tr>
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3">Product Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Supplier</th>
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
                <td className="px-4 py-3 text-gray-600">{product.category}</td>
                <td className="px-4 py-3 text-gray-600">{product.stock}</td>
                <td className="px-4 py-3 text-gray-600">₹{product.price}</td>
                <td className="px-4 py-3 text-gray-600">{product.supplier_name}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                    {product.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-xs hover:bg-blue-200 transition">
                      View
                    </button>
                    <button
                      onClick={() => handleRequestClick(product)}
                      className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-xs hover:bg-green-200 transition"
                    >
                      Request
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
            <p className="text-sm">No products available.</p>
          </div>
        )}
      </div>

      {/* Request Modal */}
      {showModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-800">Request Product</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  value={selectedProduct.name}
                  disabled
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  value={request.quantity}
                  onChange={(e) => setRequest({ ...request, quantity: e.target.value })}
                  placeholder="Enter quantity"
                  min="1"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Message / Notes
                </label>
                <textarea
                  value={request.message}
                  onChange={(e) => setRequest({ ...request, message: e.target.value })}
                  placeholder="Any special notes..."
                  rows={3}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>

            <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-lg text-sm hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitRequest}
                disabled={submitting}
                className="flex-1 bg-blue-900 text-white py-2 rounded-lg text-sm hover:bg-blue-800 transition font-semibold disabled:opacity-50"
              >
                {submitting ? "Sending..." : "Send Request"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BrowseProducts;