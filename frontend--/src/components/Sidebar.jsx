import { useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const adminMenus = [
    { name: "Dashboard", path: "/admin/dashboard" },
  ];

  const supplierMenus = [
    { name: "Dashboard", path: "/supplier/dashboard" },
  ];

  const vendorMenus = [
    { name: "Dashboard", path: "/vendor/dashboard" },
  ];

  const getMenus = () => {
    if (role === "admin") return adminMenus;
    if (role === "supplier") return supplierMenus;
    if (role === "vendor") return vendorMenus;
    return [];
  };

  return (
    <div>
      <h3>Menu</h3>
      {getMenus().map((menu, index) => (
        <div key={index} onClick={() => navigate(menu.path)}>
          {menu.name}
        </div>
      ))}
    </div>
  );
}

export default Sidebar;