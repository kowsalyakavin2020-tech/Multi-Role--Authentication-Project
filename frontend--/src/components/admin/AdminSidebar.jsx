import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Package,
  ClipboardList,
  BarChart2,
  UserCircle,
  LogOut,
  FileText,
} from "lucide-react";

const menus = [
  { name: "Dashboard", path: "/admin/dashboard", icon: <LayoutDashboard size={16} /> },
  { name: "Suppliers", path: "/admin/suppliers", icon: <Users size={16} /> },
  { name: "Vendors", path: "/admin/vendors", icon: <ShoppingBag size={16} /> },
  { name: "Products", path: "/admin/products", icon: <Package size={16} /> },
  { name: "Orders", path: "/admin/orders", icon: <ClipboardList size={16} /> },
  { name: "Stock Monitoring", path: "/admin/stock-monitoring", icon: <BarChart2 size={16} /> },
  { name: "Reports", path: "/admin/reports", icon: <FileText size={16} /> },
  { name: "Profile", path: "/admin/profile", icon: <UserCircle size={16} /> },
];

function AdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user_id");
    navigate("/");
  };

  return (
    <div className="w-56 bg-slate-900 fixed top-0 left-0 bottom-0 z-20 flex flex-col">
      <div className="px-5 py-4 border-b border-slate-700 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-xs">
            A
          </div>
          <span className="text-white font-bold text-base">AdminPanel</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
        <p className="text-slate-500 text-xs font-semibold uppercase px-3 mb-2">
          Main Menu
        </p>
        {menus.map((menu) => (
          <NavLink
            key={menu.name}
            to={menu.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`
            }
          >
            <span className="shrink-0">{menu.icon}</span>
            <span>{menu.name}</span>
          </NavLink>
        ))}
      </div>

      <div className="px-3 py-3 border-t border-slate-700 shrink-0">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-red-600/20 hover:text-red-400 transition-all"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

export default AdminSidebar;