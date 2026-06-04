import { useState, useRef, useEffect } from "react";
import { Bell, CheckCheck, X, RefreshCw } from "lucide-react";
import useNotifications from "../../hooks/useNotifications";

function AdminNavbar() {
  const user_id = localStorage.getItem("user_id");
  const role = localStorage.getItem("role");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const { notifications, unreadCount, loading, handleMarkRead, handleMarkAllRead, fetchNotifications } = useNotifications();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getTypeConfig = (type) => {
    switch (type) {
      case "order_status": return { bg: "bg-blue-100", text: "text-blue-600", icon: "🔄", label: "Order" };
      case "low_stock":    return { bg: "bg-red-100",  text: "text-red-600",  icon: "⚠️", label: "Stock" };
      case "request":      return { bg: "bg-yellow-100", text: "text-yellow-600", icon: "📋", label: "Request" };
      default:             return { bg: "bg-gray-100", text: "text-gray-600", icon: "🔔", label: "Info" };
    }
  };

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr);
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return new Date(dateStr).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
  };

  return (
    <div
      className="bg-white px-6 py-3 flex justify-between items-center fixed top-0 left-56 right-0 z-10"
      style={{ borderBottom: "1px solid #f1f5f9", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
    >
      <p className="text-gray-500 text-sm">
        Welcome back, <span className="text-blue-600 font-semibold">Admin!</span>
      </p>

      <div className="flex items-center gap-3">
        {/* Bell */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="relative w-9 h-9 bg-gray-50 border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-100 transition"
          >
            <Bell className="w-4 h-4 text-gray-500" />
            {unreadCount > 0 && (
              <span
                className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white font-bold"
                style={{ fontSize: "9px" }}
              >
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {/* Dropdown */}
          {showDropdown && (
            <div className="absolute right-0 top-11 w-84 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden"
              style={{ width: "340px", border: "1px solid #e2e8f0" }}>

              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3"
                style={{ borderBottom: "1px solid #f1f5f9" }}>
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-blue-600" />
                  <span className="font-bold text-gray-800 text-sm">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={fetchNotifications}
                    className="text-gray-400 hover:text-blue-600 transition">
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                  {unreadCount > 0 && (
                    <button onClick={handleMarkAllRead}
                      className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1">
                      <CheckCheck className="w-3 h-3" /> Mark all read
                    </button>
                  )}
                  <button onClick={() => setShowDropdown(false)}
                    className="text-gray-400 hover:text-gray-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* List */}
              <div className="max-h-80 overflow-y-auto">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  </div>
                ) : notifications.length > 0 ? (
                  notifications.map((notif) => {
                    const config = getTypeConfig(notif.type);
                    return (
                      <div
                        key={notif.id}
                        onClick={() => !notif.is_read && handleMarkRead(notif.id)}
                        className="flex items-start gap-3 px-4 py-3 cursor-pointer transition"
                        style={{
                          background: notif.is_read ? "white" : "#eff6ff",
                          borderBottom: "1px solid #f8fafc",
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = notif.is_read ? "#f8fafc" : "#dbeafe"}
                        onMouseLeave={(e) => e.currentTarget.style.background = notif.is_read ? "white" : "#eff6ff"}
                      >
                        {/* Icon */}
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm flex-shrink-0 ${config.bg} ${config.text}`}>
                          {config.icon}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <p className="text-xs font-bold text-gray-800 truncate">{notif.title}</p>
                            <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium flex-shrink-0 ${config.bg} ${config.text}`}
                              style={{ fontSize: "9px" }}>
                              {config.label}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 truncate">{notif.message}</p>
                          <p className="text-xs text-gray-400 mt-1">{timeAgo(notif.created_at)}</p>
                        </div>

                        {/* Unread dot */}
                        {!notif.is_read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5"></div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-10">
                    <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <Bell className="w-5 h-5 text-gray-300" />
                    </div>
                    <p className="text-gray-500 text-sm font-medium">No notifications</p>
                    <p className="text-gray-300 text-xs mt-1">You're all caught up!</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="px-4 py-2.5 text-center"
                  style={{ borderTop: "1px solid #f1f5f9" }}>
                  <p className="text-xs text-gray-400">
                    {unreadCount > 0
                      ? <><span className="text-blue-600 font-semibold">{unreadCount} unread</span> · {notifications.length} total</>
                      : `${notifications.length} total notifications`}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* User Chip */}
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full pl-1 pr-3 py-1">
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
            style={{ background: "#4f6ef7" }}>
            {user_id?.charAt(0).toUpperCase() || "A"}
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-700 leading-none">{user_id}</p>
            <p className="text-xs text-gray-400 capitalize leading-none mt-0.5">{role}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminNavbar;