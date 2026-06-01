import { useEffect, useState } from "react";
import apiClient from "../../../../backend/services/api/apiClient";
import { TrendingUp, Users, ShoppingBag, Package, Clock, BarChart2 } from "lucide-react";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiClient.get("/admin/dashboard/stats");
        setStats(response.data.data);
      } catch (err) {
        setError("Failed to load dashboard data!");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statsCards = [
    {
      id: 1,
      title: "Total Suppliers",
      value: stats?.total_suppliers ?? 0,
      icon: <Users size={22} />,
      bg: "bg-blue-50",
      iconBg: "bg-blue-500",
      border: "border-blue-100",
    },
    {
      id: 2,
      title: "Total Vendors",
      value: stats?.total_vendors ?? 0,
      icon: <ShoppingBag size={22} />,
      bg: "bg-green-50",
      iconBg: "bg-green-500",
      border: "border-green-100",
    },
    {
      id: 3,
      title: "Total Products",
      value: stats?.total_products ?? 0,
      icon: <Package size={22} />,
      bg: "bg-purple-50",
      iconBg: "bg-purple-500",
      border: "border-purple-100",
    },
    {
      id: 4,
      title: "Pending Orders",
      value: stats?.pending_orders ?? 0,
      icon: <Clock size={22} />,
      bg: "bg-yellow-50",
      iconBg: "bg-yellow-500",
      border: "border-yellow-100",
    },
    {
      id: 5,
      title: "Total Stock",
      value: stats?.total_stock ?? 0,
      icon: <BarChart2 size={22} />,
      bg: "bg-red-50",
      iconBg: "bg-red-500",
      border: "border-red-100",
    },
    {
      id: 6,
      title: "Recent Activity",
      value: stats?.recent_activity?.length ?? 0,
      icon: <TrendingUp size={22} />,
      bg: "bg-indigo-50",
      iconBg: "bg-indigo-500",
      border: "border-indigo-100",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-slate-500 text-sm">Loading dashboard...</p>
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
        <h2 className="text-2xl font-bold text-slate-800">Dashboard Overview</h2>
        <p className="text-slate-500 text-sm mt-1">
          Monitor your entire system from here.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
        {statsCards.map((stat) => (
          <div
            key={stat.id}
            className={`${stat.bg} border ${stat.border} rounded-xl p-5 flex items-center gap-4 hover:shadow-md transition-shadow duration-200`}
          >
            <div className={`w-12 h-12 ${stat.iconBg} rounded-xl flex items-center justify-center text-white shrink-0`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">{stat.title}</p>
              <p className="text-3xl font-bold text-slate-800 mt-0.5">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={18} className="text-blue-500" />
          <h3 className="font-semibold text-slate-800">Recent Activity</h3>
        </div>
        {stats?.recent_activity?.length > 0 ? (
          <div className="space-y-3">
            {stats.recent_activity.map((item, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                  <Package size={14} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-slate-700 text-sm font-medium">{item.action}</p>
                  <p className="text-slate-400 text-xs mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <TrendingUp size={32} className="text-slate-200 mx-auto mb-2" />
            <p className="text-slate-400 text-sm">No recent activity</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;