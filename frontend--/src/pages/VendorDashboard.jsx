import { useNavigate } from "react-router-dom";

function VendorDashboard() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const user_id = localStorage.getItem("user_id");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user_id");
    navigate("/");
  };

  const menus = [
    { name: "Dashboard", path: "/vendor/dashboard" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-blue-900 text-white p-4 flex justify-between items-center">
        <h2 className="text-xl font-bold">Multi Role Auth</h2>
        <div className="flex items-center gap-4">
          <span className="text-blue-300">Role: {role}</span>
          <button onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg">
            Logout
          </button>
        </div>
      </div>
      <div className="flex">
        <div className="w-64 bg-white h-screen shadow-lg p-4">
          <h3 className="font-bold text-gray-700 mb-4">Menu</h3>
          {menus.map((menu, index) => (
            <div key={index} onClick={() => navigate(menu.path)}
              className="p-3 rounded-lg cursor-pointer hover:bg-blue-50 text-gray-700 mb-2">
              {menu.name}
            </div>
          ))}
        </div>
        <div className="flex-1 p-8">
          <h1 className="text-2xl font-bold text-gray-800">
            Vendor Dashboard
          </h1>
          <div className="mt-4 bg-white p-6 rounded-xl shadow">
            <p className="text-gray-500">User ID: 
              <span className="font-bold text-blue-900 ml-2">{user_id}</span>
            </p>
            <p className="text-gray-500 mt-2">Role: 
              <span className="font-bold text-blue-900 ml-2">{role}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VendorDashboard;