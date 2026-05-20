import StatCard from "../../components/supplier/StatCard";
import { statsData, recentActivityData } from "../../data/supplierMockData";

function SupplierDashboard() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Supplier Dashboard
      </h2>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsData.map((stat) => (
          <StatCard
            key={stat.id}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          Recent Activity
        </h3>
        <ul className="divide-y divide-gray-100">
          {recentActivityData.map((activity) => (
            <li
              key={activity.id}
              className="flex justify-between items-center py-3"
            >
              <span className="text-gray-700 text-sm">{activity.action}</span>
              <span className="text-gray-400 text-xs">{activity.time}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default SupplierDashboard;