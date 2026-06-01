import { useEffect, useState } from "react";
import apiClient from "../../../../backend/services/api/apiClient";
import { BarChart2, Search, PackageCheck, AlertTriangle, PackageX } from "lucide-react";

function StockMonitoring() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStock, setFilterStock] = useState("All");

  useEffect(() => {
    fetchProducts();
  }, []);

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

  const getStockStyle = (stock) => {
    if (stock === 0) return "bg-red-100 text-red-800";
    if (stock < 20) return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  const getStockLabel = (stock) => {
    if (stock === 0) return "Out of Stock";
    if (stock < 20) return "Low Stock";
    return "In Stock";
  };

  const getStockBarColor = (stock) => {
    if (stock === 0) return "bg-red-500";
    if (stock < 20) return "bg-yellow-500";
    return "bg-green-500";
  };

  const filtered = products.filter((p) => {
    const matchSearch =
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.supplier_name?.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase());
    const matchStock =
      filterStock === "All" ||
      (filterStock === "In Stock" && p.stock >= 20) ||
      (filterStock === "Low Stock" && p.stock > 0 && p.stock < 20) ||
      (filterStock === "Out of Stock" && p.stock === 0);
    return matchSearch && matchStock;
  });

  const inStockCount = products.filter((p) => p.stock >= 20).length;
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock < 20).length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-slate-600 text-sm font-medium">Loading stock data...</p>
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
            <BarChart2 size={24} className="text-orange-600" />
            Stock Monitoring
          </h2>
          <p className="text-slate-600 text-sm mt-1 font-medium">
            Monitor all product stock levels in real-time
          </p>
        </div>
        <div className="bg-orange-50 border border-orange-100 rounded-xl px-4 py-2 text-center">
          <p className="text-xs text-orange-600 font-medium">Total Stock</p>
          <p className="text-xl font-bold text-orange-700">{totalStock} units</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        <div className="bg-green-600 text-white rounded-xl p-4 flex items-center gap-3 shadow">
          <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
            <PackageCheck size={20} />
          </div>
          <div>
            <p className="text-green-100 text-xs font-medium">In Stock</p>
            <p className="text-2xl font-bold">{inStockCount}</p>
          </div>
        </div>
        <div className="bg-yellow-500 text-white rounded-xl p-4 flex items-center gap-3 shadow">
          <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center">
            <AlertTriangle size={20} />
          </div>
          <div>
            <p className="text-yellow-100 text-xs font-medium">Low Stock</p>
            <p className="text-2xl font-bold">{lowStockCount}</p>
          </div>
        </div>
        <div className="bg-red-600 text-white rounded-xl p-4 flex items-center gap-3 shadow">
          <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
            <PackageX size={20} />
          </div>
          <div>
            <p className="text-red-100 text-xs font-medium">Out of Stock</p>
            <p className="text-2xl font-bold">{outOfStockCount}</p>
          </div>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 mb-4 shadow-sm flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by product, supplier or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>
        <select
          value={filterStock}
          onChange={(e) => setFilterStock(e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-orange-400"
        >
          <option value="All">All Stock</option>
          <option value="In Stock">In Stock</option>
          <option value="Low Stock">Low Stock</option>
          <option value="Out of Stock">Out of Stock</option>
        </select>
        <div className="self-center text-sm text-slate-600 font-semibold">
          Showing <span className="text-slate-900">{filtered.length}</span> products
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-800 text-white">
            <tr>
              <th className="px-4 py-3 font-semibold">Product Name</th>
              <th className="px-4 py-3 font-semibold">Supplier</th>
              <th className="px-4 py-3 font-semibold">Category</th>
              <th className="px-4 py-3 font-semibold">Stock</th>
              <th className="px-4 py-3 font-semibold">Stock Level</th>
              <th className="px-4 py-3 font-semibold">Price</th>
              <th className="px-4 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((product) => (
              <tr key={product.product_id} className="hover:bg-slate-50 transition">
                <td className="px-4 py-3 font-bold text-slate-900">{product.name}</td>
                <td className="px-4 py-3 text-slate-700 font-medium">{product.supplier_name}</td>
                <td className="px-4 py-3">
                  <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded-md text-xs font-semibold">
                    {product.category}
                  </span>
                </td>
                <td className="px-4 py-3 font-bold text-slate-900">{product.stock}</td>
                <td className="px-4 py-3 w-32">
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getStockBarColor(product.stock)}`}
                      style={{ width: `${Math.min((product.stock / 200) * 100, 100)}%` }}
                    ></div>
                  </div>
                </td>
                <td className="px-4 py-3 font-bold text-slate-900">₹{product.price}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${getStockStyle(product.stock)}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                    {getStockLabel(product.stock)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <BarChart2 size={40} className="mx-auto mb-2 text-slate-200" />
            <p className="text-sm font-medium">No stock data found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default StockMonitoring;