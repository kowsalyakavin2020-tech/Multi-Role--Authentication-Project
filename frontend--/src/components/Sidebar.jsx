import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Package, PlusCircle, ClipboardList,
  User, LogOut, ShieldCheck, List, Search, Zap,
} from "lucide-react";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem("role");
  const user_id = localStorage.getItem("user_id") || "";

  const adminMenus = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { name: "Suppliers", path: "/admin/suppliers", icon: <ShieldCheck className="w-4 h-4" /> },
    { name: "Vendors", path: "/admin/vendors", icon: <List className="w-4 h-4" /> },
    { name: "Products", path: "/admin/products", icon: <Package className="w-4 h-4" /> },
    { name: "Orders", path: "/admin/orders", icon: <ClipboardList className="w-4 h-4" /> },
    { name: "Stock Monitoring", path: "/admin/stock", icon: <Zap className="w-4 h-4" /> },
    { name: "Profile", path: "/admin/profile", icon: <User className="w-4 h-4" /> },
  ];

  const supplierMenus = [
    { name: "Dashboard", path: "/supplier/dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { name: "Stock List", path: "/supplier/stock", icon: <List className="w-4 h-4" /> },
    { name: "Add Product", path: "/supplier/add-product", icon: <PlusCircle className="w-4 h-4" /> },
    { name: "Vendor Requests", path: "/supplier/vendor-requests", icon: <ClipboardList className="w-4 h-4" /> },
    { name: "Profile", path: "/supplier/profile", icon: <User className="w-4 h-4" /> },
  ];

  const vendorMenus = [
    { name: "Dashboard", path: "/vendor/dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { name: "Browse Products", path: "/vendor/browse-products", icon: <Search className="w-4 h-4" /> },
    { name: "My Orders", path: "/vendor/my-orders", icon: <ClipboardList className="w-4 h-4" /> },
    { name: "Request Product", path: "/vendor/request-product", icon: <Zap className="w-4 h-4" /> },
    { name: "Profile", path: "/vendor/profile", icon: <User className="w-4 h-4" /> },
  ];

  const getMenus = () => {
    if (role === "admin") return adminMenus;
    if (role === "supplier") return supplierMenus;
    if (role === "vendor") return vendorMenus;
    return [];
  };

  const getAppName = () => {
    if (role === "admin") return "AdminPanel";
    if (role === "supplier") return "SupplyHub";
    return "VendorHub";
  };

  const getInitial = () => (role ? role.charAt(0).toUpperCase() : "U");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: "#1a1f2e", width: "210px", minHeight: "100vh" }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-4 py-4"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
          style={{ background: "#4f6ef7" }}
        >
          {getInitial()}
        </div>
        <span className="text-white font-semibold text-sm">{getAppName()}</span>
      </div>

      {/* Menu */}
      <div className="flex-1 px-3 py-4">
        <p
          className="text-xs font-semibold px-2 mb-3 uppercase tracking-widest"
          style={{ color: "rgba(255,255,255,0.3)" }}
        >
          Main Menu
        </p>
        <div className="flex flex-col gap-1">
          {getMenus().map((menu, index) => {
            const isActive = location.pathname === menu.path;
            return (
              <button
                key={index}
                onClick={() => navigate(menu.path)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium w-full text-left transition"
                style={{
                  background: isActive ? "#4f6ef7" : "transparent",
                  color: isActive ? "white" : "rgba(255,255,255,0.55)",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                    e.currentTarget.style.color = "rgba(255,255,255,0.9)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "rgba(255,255,255,0.55)";
                  }
                }}
              >
                {menu.icon}
                {menu.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Logout */}
      <div
        className="px-3 py-4"
        style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
      >
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium w-full text-left transition"
          style={{ color: "rgba(255,255,255,0.55)" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.07)";
            e.currentTarget.style.color = "rgba(255,255,255,0.9)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "rgba(255,255,255,0.55)";
          }}
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;