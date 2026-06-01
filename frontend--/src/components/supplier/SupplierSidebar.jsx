import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  PackagePlus,
  Handshake,
  UserCircle,
  LogOut,
} from "lucide-react";

const menus = [
  { name: "Dashboard", path: "/supplier/dashboard", icon: <LayoutDashboard size={16} /> },
  { name: "Stock List", path: "/supplier/stock-list", icon: <Package size={16} /> },
  { name: "Add Product", path: "/supplier/add-product", icon: <PackagePlus size={16} /> },
  { name: "Vendor Requests", path: "/supplier/vendor-requests", icon: <Handshake size={16} /> },
  { name: "Profile", path: "/supplier/profile", icon: <UserCircle size={16} /> },
];

function SupplierSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user_id");
    navigate("/");
  };

  return (
    <div className="w-56 bg-slate-900 fixed top-0 left-0 bottom-0 z-20 flex flex-col">
      {/* Logo */}
      <div className="px-5 py-4 border-b border-slate-700 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-xs">
            S
          </div>
          <span className="text-white font-bold text-base">SupplyHub</span>
        </div>
      </div>

      {/* Menu */}
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

      {/* Logout */}
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

export default SupplierSidebar;