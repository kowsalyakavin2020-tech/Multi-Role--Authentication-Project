function AdminNavbar() {
  const user_id = localStorage.getItem("user_id");
  const role = localStorage.getItem("role");

  return (
    <div className="bg-blue-900 text-white px-6 py-4 flex justify-between items-center shadow-md fixed top-0 left-52 right-0 z-10">
      <h2 className="text-xl font-bold">Multi Role Auth</h2>
      <div className="flex items-center gap-4">
        <span className="text-blue-300 text-sm">User: {user_id}</span>
        <span className="bg-blue-700 text-white text-sm px-3 py-1 rounded-full">
          Role: {role}
        </span>
      </div>
    </div>
  );
}

export default AdminNavbar;