import { useState } from "react";
import { Package, PackagePlus, Search, Edit, Trash2, Eye } from "lucide-react";
import useProducts from "../../hooks/useProducts";

function AddProduct() {
  const { products, loading, error, handleAddProduct, handleUpdateProduct, handleDeleteProduct } = useProducts();
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  const [newProduct, setNewProduct] = useState({
    name: "", category: "", stock: "", price: "", status: "Active", image: "",
  });

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  const handleEditClick = (product) => {
    setEditMode(true);
    setEditProductId(product.product_id);
    setNewProduct({
      name: product.name,
      category: product.category,
      stock: product.stock,
      price: product.price,
      status: product.status,
      image: product.image || "",
    });
    setShowModal(true);
  };

  const handleAdd = async () => {
    if (!newProduct.name || !newProduct.category || !newProduct.stock || !newProduct.price) {
      alert("Please fill all fields!");
      return;
    }
    setSubmitting(true);
    const productData = {
      ...newProduct,
      stock: Number(newProduct.stock),
      price: parseFloat(newProduct.price),
      image: newProduct.image ||
        `https://api.dicebear.com/7.x/shapes/svg?seed=${newProduct.name}&backgroundColor=dbeafe`,
    };
    let result;
    if (editMode) {
      result = await handleUpdateProduct(editProductId, productData);
    } else {
      result = await handleAddProduct(productData);
    }
    setSubmitting(false);
    if (result.success) {
      setNewProduct({ name: "", category: "", stock: "", price: "", status: "Active", image: "" });
      setShowModal(false);
      setEditMode(false);
      setEditProductId(null);
    } else {
      alert(result.message);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    const result = await handleDeleteProduct(productId);
    if (!result.success) alert(result.message);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditMode(false);
    setEditProductId(null);
    setNewProduct({ name: "", category: "", stock: "", price: "", status: "Active", image: "" });
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
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <PackagePlus size={20} className="text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Add Product</h2>
            <p className="text-slate-600 text-sm">Manage your product listings</p>
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 shadow-sm"
        >
          <PackagePlus size={16} />
          Add New Product
        </button>
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
            <Package size={22} />
          </div>
          <div>
            <p className="text-green-100 text-sm font-medium">Active</p>
            <p className="text-3xl font-bold text-white">
              {products.filter((p) => p.status === "Active").length}
            </p>
          </div>
        </div>
        <div className="bg-red-500 rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-red-400/40 rounded-xl flex items-center justify-center text-white">
            <Package size={22} />
          </div>
          <div>
            <p className="text-red-100 text-sm font-medium">Out of Stock</p>
            <p className="text-3xl font-bold text-white">
              {products.filter((p) => p.stock === 0).length}
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm mb-4 p-4 flex items-center justify-between gap-4">
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
        <p className="text-slate-600 text-xs font-semibold shrink-0">
          Showing {filtered.length} products
        </p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-800 text-white">
            <tr>
              <th className="px-4 py-3 font-semibold">Image</th>
              <th className="px-4 py-3 font-semibold">Product Name</th>
              <th className="px-4 py-3 font-semibold">Category</th>
              <th className="px-4 py-3 font-semibold">Stock</th>
              <th className="px-4 py-3 font-semibold">Price</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((product) => (
              <tr key={product.product_id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3">
                  <img
                    src={product.image || `https://api.dicebear.com/7.x/shapes/svg?seed=${product.name}&backgroundColor=dbeafe`}
                    alt={product.name}
                    className="w-10 h-10 rounded-lg object-cover border border-slate-200"
                    onError={(e) => {
                      e.target.src = "https://api.dicebear.com/7.x/shapes/svg?seed=fallback&backgroundColor=e2e8f0";
                    }}
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900">{product.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="bg-slate-200 text-slate-800 px-2 py-1 rounded-md text-xs font-semibold">
                    {product.category}
                  </span>
                </td>
                <td className="px-4 py-3 font-bold text-slate-900">{product.stock}</td>
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
                  <div className="flex gap-2">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1">
                      <Eye size={12} /> View
                    </button>
                    <button
                      onClick={() => handleEditClick(product)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1"
                    >
                      <Edit size={12} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.product_id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1"
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <Package size={40} className="mx-auto mb-2 text-slate-300" />
            <p className="text-sm font-semibold text-slate-700">No products found</p>
            <p className="text-xs mt-1 text-slate-500">Add your first product!</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">
                {editMode ? "Edit Product" : "New Product"}
              </h3>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-700 text-xl font-bold">
                ✕
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-800 block mb-1">Product Name</label>
                <input
                  type="text"
                  name="name"
                  value={newProduct.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-800 block mb-1">Category</label>
                <select
                  name="category"
                  value={newProduct.category}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">Select category</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Stationery">Stationery</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Food & Beverages">Food & Beverages</option>
                  <option value="Hardware">Hardware</option>
                  <option value="Packaging">Packaging</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-slate-800 block mb-1">Stock</label>
                  <input
                    type="number"
                    name="stock"
                    value={newProduct.stock}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-800 block mb-1">Price (₹)</label>
                  <input
                    type="text"
                    name="price"
                    value={newProduct.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-800 block mb-1">Status</label>
                <select
                  name="status"
                  value={newProduct.status}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="Active">Active</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 px-6 py-4 border-t border-slate-100">
              <button
                onClick={handleCloseModal}
                className="flex-1 border border-slate-200 text-slate-700 font-semibold py-2 rounded-lg text-sm hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                disabled={submitting}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-semibold transition disabled:opacity-50"
              >
                {submitting ? "Saving..." : editMode ? "Update Product" : "Add Product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddProduct;