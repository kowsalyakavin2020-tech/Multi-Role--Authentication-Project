import { useState, useEffect } from "react";
import { Search, ShoppingCart, Package, Tag, User, Send } from "lucide-react";
import apiClient from "../../services/api/apiClient";

function RequestProduct() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [request, setRequest] = useState({ quantity: "", message: "" });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/vendor/products");
      setProducts(response.data.data);
    } catch (err) {
      setError("Failed to load products. Please try again!");
    } finally {
      setLoading(false);
    }
  };

  const categories = ["All", ...new Set(products.map((p) => p.category))];

  const filteredProducts = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.supplier_name?.toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter === "All" || p.category === categoryFilter;
    return matchSearch && matchCategory;
  });

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
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-slate-700 text-sm font-medium">Loading products...</p>
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
          <ShoppingCart size={20} className="text-blue-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Request Product</h2>
          <p className="text-slate-600 text-sm">Search and request products from suppliers</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-500 rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-400/40 rounded-xl flex items-center justify-center text-white">
            <Package size={22} />
          </div>
          <div>
            <p className="text-blue-100 text-sm font-medium">Total Products</p>
            <p className="text-3xl font-bold text-white">{products.length}</p>
          </div>
        </div>
        <div className="bg-green-500 rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-green-400/40 rounded-xl flex items-center justify-center text-white">
            <Tag size={22} />
          </div>
          <div>
            <p className="text-green-100 text-sm font-medium">Categories</p>
            <p className="text-3xl font-bold text-white">{categories.length - 1}</p>
          </div>
        </div>
        <div className="bg-purple-500 rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-400/40 rounded-xl flex items-center justify-center text-white">
            <User size={22} />
          </div>
          <div>
            <p className="text-purple-100 text-sm font-medium">Suppliers</p>
            <p className="text-3xl font-bold text-white">
              {new Set(products.map((p) => p.supplier_id)).size}
            </p>
          </div>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm mb-6 p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search products or suppliers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm text-slate-800 font-medium border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-slate-400"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                categoryFilter === cat
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <p className="text-slate-600 text-xs font-semibold shrink-0">
          {filteredProducts.length} products
        </p>
      </div>

      {/* Product Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredProducts.map((product) => (
          <div
            key={product.product_id}
            className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-4"
          >
            {/* Product Header */}
            <div className="flex items-center gap-3 mb-4">
              <img
                src={product.image || `https://api.dicebear.com/7.x/shapes/svg?seed=${product.name}&backgroundColor=dbeafe`}
                alt={product.name}
                className="w-14 h-14 rounded-xl object-cover border border-slate-200"
                onError={(e) => {
                  e.target.src = "https://api.dicebear.com/7.x/shapes/svg?seed=fallback&backgroundColor=e2e8f0";
                }}
              />
              <div>
                <p className="font-bold text-slate-900">{product.name}</p>
                <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md text-xs font-semibold">
                  {product.category}
                </span>
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-600 text-sm font-medium">Price</span>
                <span className="font-bold text-slate-900 text-sm">₹{product.price}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600 text-sm font-medium">Stock</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  product.stock === 0
                    ? "bg-red-500 text-white"
                    : product.stock < 20
                    ? "bg-yellow-500 text-white"
                    : "bg-green-500 text-white"
                }`}>
                  {product.stock} units
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600 text-sm font-medium">Supplier</span>
                <div className="flex items-center gap-1">
                  <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {product.supplier_name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-semibold text-slate-800 text-sm">{product.supplier_name}</span>
                </div>
              </div>
            </div>

            {/* Request Button */}
            <button
              onClick={() => handleRequestClick(product)}
              disabled={product.stock === 0}
              className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                product.stock === 0
                  ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
              }`}
            >
              <Send size={14} />
              {product.stock === 0 ? "Out of Stock" : "Request Product"}
            </button>
          </div>
        ))}

        {filteredProducts.length === 0 && (
          <div className="col-span-3 text-center py-12">
            <Package size={40} className="mx-auto mb-2 text-slate-300" />
            <p className="text-sm font-semibold text-slate-700">No products found</p>
            <p className="text-xs mt-1 text-slate-500">Try adjusting your search or filter</p>
          </div>
        )}
      </div>

      {/* Request Modal */}
      {showModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Request Product</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-700 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            {/* Product Preview */}
            <div className="px-6 pt-4 pb-2">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center gap-3 mb-4">
                <img
                  src={selectedProduct.image || `https://api.dicebear.com/7.x/shapes/svg?seed=${selectedProduct.name}&backgroundColor=dbeafe`}
                  alt={selectedProduct.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div>
                  <p className="font-bold text-slate-900 text-sm">{selectedProduct.name}</p>
                  <p className="text-slate-600 text-xs">₹{selectedProduct.price} • Stock: {selectedProduct.stock}</p>
                  <p className="text-slate-500 text-xs">Supplier: {selectedProduct.supplier_name}</p>
                </div>
              </div>
            </div>

            <div className="px-6 pb-4 space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-800 block mb-1">
                  Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={request.quantity}
                  onChange={(e) => setRequest({ ...request, quantity: e.target.value })}
                  placeholder="Enter quantity"
                  min="1"
                  max={selectedProduct.stock}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <p className="text-slate-500 text-xs mt-1">Max available: {selectedProduct.stock} units</p>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-800 block mb-1">
                  Message / Notes
                </label>
                <textarea
                  value={request.message}
                  onChange={(e) => setRequest({ ...request, message: e.target.value })}
                  placeholder="Any special requirements or notes..."
                  rows={3}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 px-6 py-4 border-t border-slate-100">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 border border-slate-200 text-slate-700 font-semibold py-2 rounded-lg text-sm hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitRequest}
                disabled={submitting}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Send size={14} />
                {submitting ? "Sending..." : "Send Request"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RequestProduct;