function VendorNavbar() {
  const role = localStorage.getItem("role");
  const user_id = localStorage.getItem("user_id");

  return (
    <div className="bg-blue-900 text-white p-4 flex justify-between items-center">
      <h2 className="text-xl font-bold">Multi Role Auth</h2>
      <div className="flex items-center gap-4">
        <span className="text-blue-300 text-sm">User: {user_id}</span>
        <span className="bg-blue-700 text-white text-xs px-3 py-1 rounded-full">
          Role: {role}
        </span>
      </div>
    </div>
  );
}

export default VendorNavbar;