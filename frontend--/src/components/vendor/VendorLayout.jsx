import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Search, ClipboardList,
  Zap, User, LogOut,
} from "lucide-react";

function VendorLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const user_id = localStorage.getItem("user_id") || "Vendor";

  const menus = [
    { name: "Dashboard", path: "/vendor/dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { name: "Browse Products", path: "/vendor/browse-products", icon: <Search className="w-4 h-4" /> },
    { name: "My Orders", path: "/vendor/my-orders", icon: <ClipboardList className="w-4 h-4" /> },
    { name: "Request Product", path: "/vendor/request-product", icon: <Zap className="w-4 h-4" /> },
    { name: "Profile", path: "/vendor/profile", icon: <User className="w-4 h-4" /> },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className="flex flex-col flex-shrink-0"
        style={{ width: "210px", background: "#1a1f2e", minHeight: "100vh", position: "fixed", top: 0, left: 0, bottom: 0 }}
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
            V
          </div>
          <span className="text-white font-semibold text-sm">VendorHub</span>
        </div>

        {/* Menu Items */}
        <div className="flex-1 px-3 py-4">
          <p
            className="text-xs font-semibold px-2 mb-3 uppercase tracking-widest"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            Main Menu
          </p>
          <div className="flex flex-col gap-1">
            {menus.map((menu, index) => {
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

      {/* Right Side */}
      <div className="flex flex-col flex-1" style={{ marginLeft: "210px" }}>
        {/* Topbar */}
        <div
          className="flex items-center justify-between px-6 py-3 bg-white sticky top-0 z-10"
          style={{ borderBottom: "1px solid #f1f5f9" }}
        >
          <p className="text-gray-500 text-sm">
            Welcome back, <span className="text-blue-600 font-semibold">{user_id}!</span>
          </p>
          <div className="flex items-center gap-3">
            {/* Bell */}
            <div className="relative">
              <button className="w-9 h-9 bg-gray-50 border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-100 transition">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
            </div>
            {/* User chip */}
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full pl-1 pr-3 py-1">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                style={{ background: "#4f6ef7" }}
              >
                {user_id.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-700 leading-none">{user_id}</p>
                <p className="text-xs text-gray-400 leading-none mt-0.5">Vendor</p>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

export default VendorLayout;