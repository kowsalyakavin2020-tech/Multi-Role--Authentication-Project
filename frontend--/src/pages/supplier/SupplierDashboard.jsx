import useDashboard from "../../hooks/useDashboard";

function SupplierDashboard() {
  const { stats, loading, error } = useDashboard();

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

  const statsData = [
    {
      id: 1,
      title: "Total Products",
      value: stats?.total_products ?? 0,
      icon: "📦",
      color: "bg-blue-500",
    },
    {
      id: 2,
      title: "Overall Stock",
      value: `${stats?.overall_stock ?? 0} units`,
      icon: "🏭",
      color: "bg-green-500",
    },
    {
      id: 3,
      title: "Pending Vendor Requests",
      value: stats?.pending_requests ?? 0,
      icon: "🕐",
      color: "bg-yellow-500",
    },
    {
      id: 4,
      title: "Recent Activity",
      value: `${stats?.recent_activity?.length ?? 0} Today`,
      icon: "📈",
      color: "bg-purple-500",
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
        <p className="text-gray-500 text-sm mt-1">Welcome back, Supplier!</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {statsData.map((stat) => (
          <div key={stat.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
            <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-xl`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-gray-500 text-sm">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h3 className="font-semibold text-gray-800 mb-4">Recent Activity</h3>
        {stats?.recent_activity?.length > 0 ? (
          <div className="space-y-3">
            {stats.recent_activity.map((item, index) => (
              <div key={index} className="flex items-center gap-3 text-sm">
                <span className="text-lg">📦</span>
                <div>
                  <p className="text-gray-700">{item.name} added</p>
                  <p className="text-gray-400 text-xs">{item.created_at}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-sm text-center py-4">
            No recent activity
          </p>
        )}
      </div>
    </div>
  );
}

export default SupplierDashboard;