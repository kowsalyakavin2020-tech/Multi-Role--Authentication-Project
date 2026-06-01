import useDashboard from "../../hooks/useDashboard";
import useProducts from "../../hooks/useProducts";
import { Package, Warehouse, Clock, TrendingUp, AlertTriangle, Plus, List, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

function SupplierDashboard() {
  const { stats, loading, error } = useDashboard();
  const { products } = useProducts();
  const navigate = useNavigate();

  const lowStockProducts = products?.filter((p) => p.stock > 0 && p.stock < 20) || [];
  const outOfStockProducts = products?.filter((p) => p.stock === 0) || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-slate-600 text-sm font-medium">Loading dashboard...</p>
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
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Dashboard Overview</h2>
        <p className="text-slate-500 text-sm mt-1 font-medium">
          Monitor your supply chain activity here.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-600 rounded-xl p-5 flex items-center gap-4 shadow hover:shadow-lg transition-shadow duration-200">
          <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white shrink-0">
            <Package size={22} />
          </div>
          <div>
            <p className="text-blue-100 text-sm font-medium">Total Products</p>
            <p className="text-3xl font-bold text-white mt-0.5">{stats?.total_products ?? 0}</p>
          </div>
        </div>

        <div className="bg-green-600 rounded-xl p-5 flex items-center gap-4 shadow hover:shadow-lg transition-shadow duration-200">
          <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-white shrink-0">
            <Warehouse size={22} />
          </div>
          <div>
            <p className="text-green-100 text-sm font-medium">Overall Stock</p>
            <p className="text-3xl font-bold text-white mt-0.5">{stats?.overall_stock ?? 0} <span className="text-lg">units</span></p>
          </div>
        </div>

        <div className="bg-yellow-500 rounded-xl p-5 flex items-center gap-4 shadow hover:shadow-lg transition-shadow duration-200">
          <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center text-white shrink-0">
            <Clock size={22} />
          </div>
          <div>
            <p className="text-yellow-100 text-sm font-medium">Pending Requests</p>
            <p className="text-3xl font-bold text-white mt-0.5">{stats?.pending_requests ?? 0}</p>
          </div>
        </div>

        <div className="bg-purple-600 rounded-xl p-5 flex items-center gap-4 shadow hover:shadow-lg transition-shadow duration-200">
          <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center text-white shrink-0">
            <TrendingUp size={22} />
          </div>
          <div>
            <p className="text-purple-100 text-sm font-medium">Recent Activity</p>
            <p className="text-3xl font-bold text-white mt-0.5">{stats?.recent_activity?.length ?? 0} <span className="text-lg">Today</span></p>
          </div>
        </div>
      </div>

      {/* Low Stock Alert */}
      {(lowStockProducts.length > 0 || outOfStockProducts.length > 0) && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={18} className="text-red-600" />
            <h3 className="font-bold text-red-800">Stock Alerts</h3>
            <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">
              {lowStockProducts.length + outOfStockProducts.length}
            </span>
          </div>
          <div className="space-y-2">
            {outOfStockProducts.map((p) => (
              <div key={p.product_id} className="flex items-center justify-between bg-white border border-red-100 rounded-lg px-4 py-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  <span className="text-sm font-semibold text-slate-800">{p.name}</span>
                </div>
                <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-bold">Out of Stock</span>
              </div>
            ))}
            {lowStockProducts.map((p) => (
              <div key={p.product_id} className="flex items-center justify-between bg-white border border-yellow-100 rounded-lg px-4 py-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                  <span className="text-sm font-semibold text-slate-800">{p.name}</span>
                </div>
                <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full font-bold">Low Stock — {p.stock} left</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp size={18} className="text-blue-500" />
              <h3 className="font-bold text-slate-800">Recent Activity</h3>
            </div>
          </div>
          {stats?.recent_activity?.length > 0 ? (
            <div className="space-y-3">
              {stats.recent_activity.map((item, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                    <Package size={14} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-slate-700 text-sm font-semibold">{item.name} added</p>
                    <p className="text-slate-400 text-xs mt-0.5">{item.created_at}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <TrendingUp size={32} className="text-slate-200 mx-auto mb-2" />
              <p className="text-slate-400 text-sm font-medium">No recent activity</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <Plus size={18} className="text-green-500" />
            <h3 className="font-bold text-slate-800">Quick Actions</h3>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => navigate("/supplier/add-product")}
              className="w-full flex items-center justify-between bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 hover:bg-blue-100 transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                  <Plus size={18} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-slate-800">Add New Product</p>
                  <p className="text-xs text-slate-500">Add product to your inventory</p>
                </div>
              </div>
              <ArrowRight size={16} className="text-slate-400 group-hover:text-blue-600 transition" />
            </button>

            <button
              onClick={() => navigate("/supplier/stock-list")}
              className="w-full flex items-center justify-between bg-green-50 border border-green-100 rounded-xl px-4 py-3 hover:bg-green-100 transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-green-600 rounded-lg flex items-center justify-center text-white">
                  <List size={18} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-slate-800">View Stock List</p>
                  <p className="text-xs text-slate-500">Monitor all your products</p>
                </div>
              </div>
              <ArrowRight size={16} className="text-slate-400 group-hover:text-green-600 transition" />
            </button>

            <button
              onClick={() => navigate("/supplier/vendor-requests")}
              className="w-full flex items-center justify-between bg-yellow-50 border border-yellow-100 rounded-xl px-4 py-3 hover:bg-yellow-100 transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-yellow-500 rounded-lg flex items-center justify-center text-white">
                  <Clock size={18} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-slate-800">Vendor Requests</p>
                  <p className="text-xs text-slate-500">View and manage requests</p>
                </div>
              </div>
              <ArrowRight size={16} className="text-slate-400 group-hover:text-yellow-600 transition" />
            </button>

            <button
              onClick={() => navigate("/supplier/profile")}
              className="w-full flex items-center justify-between bg-purple-50 border border-purple-100 rounded-xl px-4 py-3 hover:bg-purple-100 transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-purple-600 rounded-lg flex items-center justify-center text-white">
                  <TrendingUp size={18} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-slate-800">My Profile</p>
                  <p className="text-xs text-slate-500">View and edit your profile</p>
                </div>
              </div>
              <ArrowRight size={16} className="text-slate-400 group-hover:text-purple-600 transition" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SupplierDashboard; 