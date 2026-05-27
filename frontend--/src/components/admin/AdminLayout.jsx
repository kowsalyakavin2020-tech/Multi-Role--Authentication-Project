import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";

function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navbar */}
      <AdminNavbar />

      {/* Sidebar + Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main Content */}
        <div className="flex-1 ml-52 mt-16 p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;