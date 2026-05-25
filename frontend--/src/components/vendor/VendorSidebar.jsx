import { NavLink, useNavigate } from "react-router-dom";

const menus = [
  { name: "Dashboard", path: "/vendor/dashboard" },
  { name: "Browse Products", path: "/vendor/browse-products" },
  { name: "My Orders", path: "/vendor/my-orders" },
  { name: "Request Product", path: "/vendor/request-product" },
  { name: "Profile", path: "/vendor/profile" },
];

function VendorSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user_id");
    navigate("/");
  };

  return (
    <div className="w-52 bg-white h-screen shadow-md flex flex-col justify-between py-4">
      <div>
        <p className="text-gray-400 text-xs font-semibold uppercase px-4 mb-2">
          Menu
        </p>
        {menus.map((menu) => (
          <NavLink
            key={menu.name}
            to={menu.path}
            className={({ isActive }) =>
              `block px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                isActive
                  ? "bg-blue-900 text-white"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-900"
              }`
            }
          >
            {menu.name}
          </NavLink>
        ))}
      </div>
      <div className="px-4">
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 text-white text-sm py-2 rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default VendorSidebar;