import { useEffect, useState } from "react";
import apiClient from "../../../../backend/services/api/apiClient";
import { Package, Search, CheckCircle, XCircle, Trash2, Eye } from "lucide-react";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    fetchProducts();
  }, []);

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

  const filtered = products.filter((p) => {
    const matchSearch =
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.supplier_name?.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const activeCount = products.filter((p) => p.status === "Active").length;
  const rejectedCount = products.filter((p) => p.status === "Rejected").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-slate-600 text-sm font-medium">Loading products...</p>
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
            <Package size={24} className="text-purple-600" />
            Product Monitoring
          </h2>
          <p className="text-slate-600 text-sm mt-1 font-medium">
            Monitor, approve and manage all products
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        <div className="bg-purple-600 text-white rounded-xl p-4 flex items-center gap-3 shadow">
          <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
            <Package size={20} />
          </div>
          <div>
            <p className="text-purple-100 text-xs font-medium">Total Products</p>
            <p className="text-2xl font-bold">{products.length}</p>
          </div>
        </div>
        <div className="bg-green-600 text-white rounded-xl p-4 flex items-center gap-3 shadow">
          <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
            <CheckCircle size={20} />
          </div>
          <div>
            <p className="text-green-100 text-xs font-medium">Active</p>
            <p className="text-2xl font-bold">{activeCount}</p>
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
      </div>

      {/* Search + Filter */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 mb-4 shadow-sm flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, supplier or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-purple-400"
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Rejected">Rejected</option>
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
              <th className="px-4 py-3 font-semibold">Image</th>
              <th className="px-4 py-3 font-semibold">Product Name</th>
              <th className="px-4 py-3 font-semibold">Supplier</th>
              <th className="px-4 py-3 font-semibold">Category</th>
              <th className="px-4 py-3 font-semibold">Stock</th>
              <th className="px-4 py-3 font-semibold">Price</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((product) => (
              <tr key={product.product_id} className="hover:bg-slate-50 transition">
                <td className="px-4 py-3">
                  <img
                    src={product.image || `https://api.dicebear.com/7.x/shapes/svg?seed=${product.name}&backgroundColor=dbeafe`}
                    alt={product.name}
                    className="w-10 h-10 rounded-lg object-cover border border-slate-100"
                    onError={(e) => {
                      e.target.src = "https://api.dicebear.com/7.x/shapes/svg?seed=fallback&backgroundColor=e2e8f0";
                    }}
                  />
                </td>
                <td className="px-4 py-3 font-bold text-slate-900">{product.name}</td>
                <td className="px-4 py-3 text-slate-700 font-medium">{product.supplier_name}</td>
                <td className="px-4 py-3">
                  <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded-md text-xs font-semibold">
                    {product.category}
                  </span>
                </td>
                <td className="px-4 py-3 font-bold text-slate-900">{product.stock}</td>
                <td className="px-4 py-3 font-bold text-slate-900">₹{product.price}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                    product.status === "Active"
                      ? "bg-green-100 text-green-800"
                      : product.status === "Rejected"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                    {product.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1.5 flex-wrap">
                    <button className="bg-blue-600 text-white px-2.5 py-1.5 rounded-lg text-xs hover:bg-blue-700 transition font-semibold flex items-center gap-1">
                      <Eye size={11} />
                      View
                    </button>
                    <button
                      onClick={() => handleApprove(product.product_id)}
                      className="bg-green-600 text-white px-2.5 py-1.5 rounded-lg text-xs hover:bg-green-700 transition font-semibold flex items-center gap-1"
                    >
                      <CheckCircle size={11} />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(product.product_id)}
                      className="bg-yellow-500 text-white px-2.5 py-1.5 rounded-lg text-xs hover:bg-yellow-600 transition font-semibold flex items-center gap-1"
                    >
                      <XCircle size={11} />
                      Reject
                    </button>
                    <button
                      onClick={() => handleDelete(product.product_id)}
                      className="bg-red-600 text-white px-2.5 py-1.5 rounded-lg text-xs hover:bg-red-700 transition font-semibold flex items-center gap-1"
                    >
                      <Trash2 size={11} />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <Package size={40} className="mx-auto mb-2 text-slate-200" />
            <p className="text-sm font-medium">No products found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;