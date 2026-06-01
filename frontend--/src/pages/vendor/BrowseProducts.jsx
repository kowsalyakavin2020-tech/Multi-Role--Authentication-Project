import { useState, useEffect } from "react";
import {
  Search, Package, RefreshCw, X, Send, Eye,
  ShoppingCart, Filter, ChevronDown, Tag,
  TrendingUp, CheckCircle, AlertTriangle, XCircle,
} from "lucide-react";
import apiClient from "../../services/api/apiClient";

function BrowseProducts() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [stockFilter, setStockFilter] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [request, setRequest] = useState({ quantity: "", message: "" });

  useEffect(() => { fetchProducts(); }, []);

  useEffect(() => {
    let result = [...products];
    const q = searchQuery.toLowerCase();
    if (q) result = result.filter(p =>
      p.name?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q) ||
      p.supplier_name?.toLowerCase().includes(q)
    );
    if (categoryFilter !== "All") result = result.filter(p => p.category === categoryFilter);
    if (stockFilter === "In Stock") result = result.filter(p => p.stock > 10);
    else if (stockFilter === "Low Stock") result = result.filter(p => p.stock > 0 && p.stock <= 10);
    else if (stockFilter === "Out of Stock") result = result.filter(p => p.stock === 0);
    if (sortBy === "price_asc") result.sort((a, b) => a.price - b.price);
    else if (sortBy === "price_desc") result.sort((a, b) => b.price - a.price);
    else if (sortBy === "stock_asc") result.sort((a, b) => a.stock - b.stock);
    else if (sortBy === "name_asc") result.sort((a, b) => a.name.localeCompare(b.name));
    setFiltered(result);
  }, [searchQuery, categoryFilter, stockFilter, sortBy, products]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/vendor/products");
      setProducts(response.data.data);
      setFiltered(response.data.data);
    } catch (err) {
      setError("Failed to load products. Please try again!");
    } finally {
      setLoading(false);
    }
  };

  const categories = ["All", ...new Set(products.map(p => p.category).filter(Boolean))];

  const summaryStats = {
    total: products.length,
    inStock: products.filter(p => p.stock > 10).length,
    lowStock: products.filter(p => p.stock > 0 && p.stock <= 10).length,
    outOfStock: products.filter(p => p.stock === 0).length,
  };

  const getStockBadge = (stock) => {
    if (stock === 0) return { label: "Out of Stock", cls: "bg-red-50 text-red-600", icon: <XCircle className="w-3 h-3" /> };
    if (stock <= 10) return { label: `${stock} units`, cls: "bg-yellow-50 text-yellow-700", icon: <AlertTriangle className="w-3 h-3" /> };
    return { label: `${stock} units`, cls: "bg-green-50 text-green-700", icon: <CheckCircle className="w-3 h-3" /> };
  };

  const handleRequestClick = (product) => {
    setSelectedProduct(product);
    setRequest({ quantity: "", message: "" });
    setShowModal(true);
  };

  const handleViewClick = (product) => {
    setSelectedProduct(product);
    setShowViewModal(true);
  };

  const handleSubmitRequest = async () => {
    if (!request.quantity) { alert("Please enter quantity!"); return; }
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

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-gray-500 text-sm">Loading products...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
      <p className="text-red-600 font-medium">{error}</p>
      <button onClick={fetchProducts} className="mt-3 flex items-center gap-2 mx-auto text-sm text-red-500 hover:text-red-700">
        <RefreshCw className="w-4 h-4" /> Try Again
      </button>
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <Search className="text-gray-400 w-7 h-7" />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Browse Products</h2>
            <p className="text-gray-400 text-sm mt-0.5">Find and request products from suppliers</p>
          </div>
        </div>
        <button onClick={fetchProducts}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 border border-gray-200 hover:border-blue-300 px-3 py-2 rounded-lg transition">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Products", value: summaryStats.total, icon: <Package className="w-5 h-5 text-white" />, from: "#3b82f6", to: "#2563eb" },
          { label: "In Stock", value: summaryStats.inStock, icon: <CheckCircle className="w-5 h-5 text-white" />, from: "#22c55e", to: "#16a34a" },
          { label: "Low Stock", value: summaryStats.lowStock, icon: <AlertTriangle className="w-5 h-5 text-white" />, from: "#f59e0b", to: "#d97706" },
          { label: "Out of Stock", value: summaryStats.outOfStock, icon: <XCircle className="w-5 h-5 text-white" />, from: "#ef4444", to: "#dc2626" },
        ].map((s) => (
          <div key={s.label}
            className="rounded-2xl p-4 flex items-center gap-3 shadow-sm"
            style={{ background: `linear-gradient(135deg, ${s.from}, ${s.to})` }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
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

      {/* Filters Row */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search products, category, supplier..."
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400" />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
              className="pl-9 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 appearance-none bg-white text-gray-600">
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Stock Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select value={stockFilter} onChange={(e) => setStockFilter(e.target.value)}
              className="pl-9 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 appearance-none bg-white text-gray-600">
              {["All", "In Stock", "Low Stock", "Out of Stock"].map(s => <option key={s}>{s}</option>)}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Sort */}
          <div className="relative">
            <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
              className="pl-9 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 appearance-none bg-white text-gray-600">
              <option value="default">Sort By</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="stock_asc">Stock: Low to High</option>
              <option value="name_asc">Name: A to Z</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          <span className="text-sm text-gray-400 ml-auto flex-shrink-0">
            {filtered.length} of {products.length} products
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead>
            <tr style={{ background: "linear-gradient(135deg, #1e2d6b, #2a3a8a)" }}>
              {["Image", "Product Name", "Category", "Stock", "Price", "Supplier", "Status", "Actions"].map(h => (
                <th key={h} className="px-4 py-3 text-white/80 text-xs font-semibold uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((product, index) => {
              const stockBadge = getStockBadge(product.stock);
              return (
                <tr key={product.product_id}
                  className="hover:bg-blue-50/40 transition"
                  style={{ background: index % 2 === 0 ? "white" : "#fafafa" }}>
                  <td className="px-4 py-3">
                    <img
                      src={product.image || `https://api.dicebear.com/7.x/shapes/svg?seed=${product.name}&backgroundColor=dbeafe`}
                      alt={product.name}
                      className="w-10 h-10 rounded-xl object-cover border border-gray-100"
                      onError={(e) => { e.target.src = "https://api.dicebear.com/7.x/shapes/svg?seed=fallback&backgroundColor=e2e8f0"; }}
                    />
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-800">{product.name}</td>
                  <td className="px-4 py-3">
                    <span className="bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-full font-medium">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full w-fit ${stockBadge.cls}`}>
                      {stockBadge.icon} {stockBadge.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-bold text-gray-800">₹{product.price}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{product.supplier_name}</td>
                  <td className="px-4 py-3">
                    <span className="bg-green-50 text-green-700 text-xs px-2.5 py-1 rounded-full font-semibold">
                      {product.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => handleViewClick(product)}
                        className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-medium transition">
                        <Eye className="w-3 h-3" /> View
                      </button>
                      <button
                        onClick={() => handleRequestClick(product)}
                        disabled={product.stock === 0}
                        className="flex items-center gap-1 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{ background: product.stock === 0 ? "#9ca3af" : "linear-gradient(135deg, #22c55e, #16a34a)" }}>
                        <ShoppingCart className="w-3 h-3" /> Request
                      </button>
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
              <Package className="w-6 h-6 text-gray-300" />
            </div>
            <p className="text-gray-500 text-sm font-medium">No products found</p>
            <p className="text-gray-300 text-xs mt-1">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* View Modal */}
      {showViewModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-800">Product Details</h3>
              <button onClick={() => setShowViewModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 py-5">
              <div className="flex items-center gap-4 mb-5 p-4 bg-blue-50 rounded-2xl">
                <img
                  src={selectedProduct.image || `https://api.dicebear.com/7.x/shapes/svg?seed=${selectedProduct.name}&backgroundColor=dbeafe`}
                  alt={selectedProduct.name}
                  className="w-16 h-16 rounded-2xl object-cover border border-blue-100"
                />
                <div>
                  <p className="font-bold text-gray-800 text-lg leading-tight">{selectedProduct.name}</p>
                  <span className="bg-blue-100 text-blue-700 text-xs px-2.5 py-1 rounded-full font-medium mt-1 inline-block">
                    {selectedProduct.category}
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                {[
                  { label: "Price", value: `₹${selectedProduct.price}` },
                  { label: "Available Stock", value: `${selectedProduct.stock} units` },
                  { label: "Supplier", value: selectedProduct.supplier_name },
                  { label: "Status", value: selectedProduct.status },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between py-2.5 border-b border-gray-50">
                    <span className="text-gray-400 text-sm">{item.label}</span>
                    <span className="text-gray-800 text-sm font-semibold">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
              <button onClick={() => setShowViewModal(false)}
                className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm hover:bg-gray-50 transition">
                Close
              </button>
              <button
                onClick={() => { setShowViewModal(false); handleRequestClick(selectedProduct); }}
                disabled={selectedProduct.stock === 0}
                className="flex-1 flex items-center justify-center gap-2 text-white py-2.5 rounded-xl text-sm font-semibold transition disabled:opacity-40"
                style={{ background: "linear-gradient(135deg, #3b82f6, #2563eb)" }}>
                <ShoppingCart className="w-4 h-4" /> Request Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Request Modal */}
      {showModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-800">Request Product</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                <img
                  src={selectedProduct.image || `https://api.dicebear.com/7.x/shapes/svg?seed=${selectedProduct.name}&backgroundColor=dbeafe`}
                  alt={selectedProduct.name}
                  className="w-10 h-10 rounded-lg object-cover"
                />
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{selectedProduct.name}</p>
                  <p className="text-gray-400 text-xs">₹{selectedProduct.price} · {selectedProduct.stock} units available</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Quantity <span className="text-red-400">*</span>
                </label>
                <input type="number" value={request.quantity}
                  onChange={(e) => setRequest({ ...request, quantity: e.target.value })}
                  placeholder="Enter quantity" min="1" max={selectedProduct.stock}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400" />
                {request.quantity && Number(request.quantity) > selectedProduct.stock && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Exceeds available stock ({selectedProduct.stock} units)
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Message / Notes</label>
                <textarea value={request.message}
                  onChange={(e) => setRequest({ ...request, message: e.target.value })}
                  placeholder="Any special notes or requirements..."
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400 resize-none" />
              </div>
            </div>
            <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
              <button onClick={() => setShowModal(false)}
                className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm hover:bg-gray-50 transition">
                Cancel
              </button>
              <button onClick={handleSubmitRequest} disabled={submitting}
                className="flex-1 flex items-center justify-center gap-2 text-white py-2.5 rounded-xl text-sm font-semibold transition disabled:opacity-50"
                style={{ background: "linear-gradient(135deg, #1e2d6b, #2a3a8a)" }}>
                <Send className="w-4 h-4" />
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