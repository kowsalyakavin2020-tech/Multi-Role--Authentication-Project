import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";

function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-100">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="ml-56">
        {/* Navbar */}
        <AdminNavbar />

        {/* Page Content */}
        <div className="mt-14 p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;