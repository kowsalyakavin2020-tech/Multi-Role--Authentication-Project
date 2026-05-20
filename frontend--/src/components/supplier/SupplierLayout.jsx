import SupplierNavbar from "./SupplierNavbar";
import SupplierSidebar from "./SupplierSidebar";

function SupplierLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navbar */}
      <SupplierNavbar />

      {/* Sidebar + Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <SupplierSidebar />

        {/* Main Content */}
        <div className="flex-1 p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

export default SupplierLayout;