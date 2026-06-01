import { useState } from "react";
import { Package, Search, TrendingUp, AlertTriangle, CheckCircle, BarChart2 } from "lucide-react";
import useProducts from "../../hooks/useProducts";

function StockList() {
  const { products, loading, error } = useProducts();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filtered = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "All" ||
      (filter === "Active" && p.status === "Active") ||
      (filter === "Out of Stock" && p.stock === 0) ||
      (filter === "Low Stock" && p.stock > 0 && p.stock < 20);
    return matchSearch && matchFilter;
  });

  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  const lowStock = products.filter((p) => p.stock > 0 && p.stock < 20).length;
  const activeProducts = products.filter((p) => p.status === "Active").length;
  const outOfStock = products.filter((p) => p.stock === 0).length;
  const maxStock = Math.max(...products.map((p) => p.stock), 1);

  const getStockStyle = (stock) => {
    if (stock === 0) return "bg-red-500 text-white";
    if (stock < 20) return "bg-yellow-500 text-white";
    return "bg-green-500 text-white";
  };

  const getStockLabel = (stock) => {
    if (stock === 0) return "Out of Stock";
    if (stock < 20) return "Low Stock";
    return "In Stock";
  };

  const getProgressColor = (stock) => {
    if (stock === 0) return "bg-red-500";
    if (stock < 20) return "bg-yellow-500";
    return "bg-green-500";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-slate-700 text-sm font-medium">Loading stock data...</p>
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
          <BarChart2 size={20} className="text-blue-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Stock List</h2>
          <p className="text-slate-600 text-sm">Monitor your product stock levels</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-500 rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-400/40 rounded-xl flex items-center justify-center text-white">
            <TrendingUp size={22} />
          </div>
          <div>
            <p className="text-blue-100 text-sm font-medium">Total Stock</p>
            <p className="text-3xl font-bold text-white">{totalStock}</p>
            <p className="text-blue-200 text-xs font-medium">units</p>
          </div>
        </div>

        <div className="bg-yellow-500 rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-yellow-400/40 rounded-xl flex items-center justify-center text-white">
            <AlertTriangle size={22} />
          </div>
          <div>
            <p className="text-yellow-100 text-sm font-medium">Low Stock</p>
            <p className="text-3xl font-bold text-white">{lowStock}</p>
            <p className="text-yellow-200 text-xs font-medium">products</p>
          </div>
        </div>

        <div className="bg-green-500 rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-green-400/40 rounded-xl flex items-center justify-center text-white">
            <CheckCircle size={22} />
          </div>
          <div>
            <p className="text-green-100 text-sm font-medium">Active</p>
            <p className="text-3xl font-bold text-white">{activeProducts}</p>
            <p className="text-green-200 text-xs font-medium">products</p>
          </div>
        </div>

        <div className="bg-red-500 rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-red-400/40 rounded-xl flex items-center justify-center text-white">
            <Package size={22} />
          </div>
          <div>
            <p className="text-red-100 text-sm font-medium">Out of Stock</p>
            <p className="text-3xl font-bold text-white">{outOfStock}</p>
            <p className="text-red-200 text-xs font-medium">products</p>
          </div>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm mb-4 p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search by name or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm text-slate-800 font-medium border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-slate-400"
          />
        </div>
        <div className="flex gap-2">
          {["All", "Active", "Low Stock", "Out of Stock"].map((f) => (
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
          Showing {filtered.length} products
        </p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-800 text-white">
            <tr>
              <th className="px-4 py-3 font-semibold">Product Name</th>
              <th className="px-4 py-3 font-semibold">Category</th>
              <th className="px-4 py-3 font-semibold">Stock</th>
              <th className="px-4 py-3 font-semibold">Stock Level</th>
              <th className="px-4 py-3 font-semibold">Price</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Stock Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((product) => (
              <tr key={product.product_id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {product.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-semibold text-slate-900">{product.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="bg-slate-200 text-slate-800 px-2 py-1 rounded-md text-xs font-semibold">
                    {product.category}
                  </span>
                </td>
                <td className="px-4 py-3 font-bold text-slate-900">{product.stock}</td>
                <td className="px-4 py-3 w-32">
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${getProgressColor(product.stock)}`}
                      style={{ width: `${Math.min((product.stock / maxStock) * 100, 100)}%` }}
                    ></div>
                  </div>
                </td>
                <td className="px-4 py-3 font-bold text-slate-900">₹{product.price}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    product.status === "Active"
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                  }`}>
                    ● {product.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStockStyle(product.stock)}`}>
                    {getStockLabel(product.stock)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <Package size={40} className="mx-auto mb-2 text-slate-300" />
            <p className="text-sm font-semibold text-slate-700">No products found</p>
            <p className="text-xs mt-1 text-slate-500">Try adjusting your search or filter</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default StockList;