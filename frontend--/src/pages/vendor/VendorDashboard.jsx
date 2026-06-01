import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard, ShoppingCart, Clock, TrendingUp,
  Package, Search, ClipboardList, Zap, ArrowRight,
  RefreshCw, CheckCircle, AlertCircle, Bell,
} from "lucide-react";
import apiClient from "../../services/api/apiClient";

function VendorDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const user_id = localStorage.getItem("user_id") || "VEN001";

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get("/vendor/dashboard/summary");
        setStats(response.data.data);
      } catch (err) {
        setError("Failed to load dashboard data. Please try again!");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-500 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p className="text-red-600 font-medium">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-3 flex items-center gap-2 mx-auto text-sm text-red-500 hover:text-red-700"
        >
          <RefreshCw className="w-4 h-4" /> Try Again
        </button>
      </div>
    );
  }

  const statsData = [
    {
      id: 1,
      title: "Total Available Products",
      value: stats?.total_products ?? 0,
      icon: <Package className="w-7 h-7 text-white" />,
      from: "#3b82f6",
      to: "#2563eb",
    },
    {
      id: 2,
      title: "My Orders",
      value: stats?.my_orders ?? 0,
      icon: <ShoppingCart className="w-7 h-7 text-white" />,
      from: "#22c55e",
      to: "#16a34a",
    },
    {
      id: 3,
      title: "Pending Requests",
      value: stats?.pending_requests ?? 0,
      icon: <Clock className="w-7 h-7 text-white" />,
      from: "#f59e0b",
      to: "#d97706",
    },
    {
      id: 4,
      title: "Recent Activity",
      value: `${stats?.recent_activity?.length ?? 0} Today`,
      icon: <TrendingUp className="w-7 h-7 text-white" />,
      from: "#a855f7",
      to: "#9333ea",
    },
  ];

  const quickActions = [
    {
      label: "Browse Products",
      desc: "Explore available inventory",
      icon: <Search className="w-5 h-5 text-white" />,
      from: "#3b82f6",
      to: "#2563eb",
      path: "/vendor/browse-products",
    },
    {
      label: "My Orders",
      desc: "Track your order history",
      icon: <ClipboardList className="w-5 h-5 text-white" />,
      from: "#22c55e",
      to: "#16a34a",
      path: "/vendor/my-orders",
    },
    {
      label: "Request Product",
      desc: "Submit a new product request",
      icon: <Zap className="w-5 h-5 text-white" />,
      from: "#a855f7",
      to: "#9333ea",
      path: "/vendor/request-product",
    },
  ];

  const pendingCount = stats?.pending_requests ?? 0;
  const recentActivity = stats?.recent_activity ?? [];

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <LayoutDashboard className="text-gray-400 w-7 h-7" />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
            <p className="text-gray-400 text-sm mt-0.5">
              Welcome back,{" "}
              <span className="text-blue-600 font-semibold">{user_id}!</span>
            </p>
          </div>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 border border-gray-200 hover:border-blue-300 px-3 py-2 rounded-lg transition"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {statsData.map((stat) => (
          <div
            key={stat.id}
            style={{ background: `linear-gradient(135deg, ${stat.from}, ${stat.to})` }}
            className="rounded-2xl p-5 flex items-center gap-4 shadow-md"
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(255,255,255,0.2)" }}
            >
              {stat.icon}
            </div>
            <div>
              <p className="text-white/75 text-xs font-medium leading-tight">
                {stat.title}
              </p>
              <p className="text-white text-3xl font-extrabold mt-1 leading-none">
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Pending Alert */}
      {pendingCount > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center">
              <Bell className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-amber-800 font-semibold text-sm flex items-center gap-2">
                Pending Requests
                <span className="bg-amber-400 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                  {pendingCount}
                </span>
              </p>
              <p className="text-amber-600 text-xs mt-0.5">
                {pendingCount} request{pendingCount > 1 ? "s" : ""} awaiting supplier approval.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/vendor/my-orders")}
            className="text-xs text-amber-700 font-semibold border border-amber-300 px-3 py-1.5 rounded-lg hover:bg-amber-100 transition"
          >
            View All
          </button>
        </div>
      )}

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-800">Recent Activity</h3>
            </div>
            {recentActivity.length > 0 && (
              <span className="text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full font-medium">
                {recentActivity.length} items
              </span>
            )}
          </div>

          {recentActivity.length > 0 ? (
            <div className="space-y-2">
              {recentActivity.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition"
                  style={{ borderBottom: index < recentActivity.length - 1 ? "1px solid #f3f4f6" : "none" }}
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <ShoppingCart className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-800 text-sm font-semibold truncate">
                      {item.product_name} requested
                    </p>
                    <p className="text-gray-400 text-xs mt-0.5">
                      {new Date(item.created_at).toLocaleString("en-IN", {
                        day: "2-digit", month: "short",
                        hour: "2-digit", minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    {item.status === "approved" ? (
                      <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full font-medium">
                        <CheckCircle className="w-3 h-3" /> Approved
                      </span>
                    ) : item.status === "rejected" ? (
                      <span className="flex items-center gap-1 text-xs text-red-600 bg-red-50 px-2 py-1 rounded-full font-medium">
                        <AlertCircle className="w-3 h-3" /> Rejected
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full font-medium">
                        <Clock className="w-3 h-3" /> Pending
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-gray-300" />
              </div>
              <p className="text-gray-500 text-sm font-medium">No recent activity</p>
              <p className="text-gray-300 text-xs mt-1">Your order activity will appear here</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-purple-600" />
            </div>
            <h3 className="font-bold text-gray-800">Quick Actions</h3>
          </div>
          <div className="space-y-3">
            {quickActions.map((action, i) => (
              <button
                key={i}
                onClick={() => navigate(action.path)}
                className="w-full flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:border-blue-200 hover:shadow-sm transition group bg-white"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${action.from}, ${action.to})` }}
                  >
                    {action.icon}
                  </div>
                  <div className="text-left">
                    <p className="text-gray-800 text-sm font-semibold">{action.label}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{action.desc}</p>
                  </div>
                </div>
                <div className="w-8 h-8 bg-gray-50 group-hover:bg-blue-50 rounded-lg flex items-center justify-center transition">
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VendorDashboard;