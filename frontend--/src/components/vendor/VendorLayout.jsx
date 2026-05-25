import VendorNavbar from "./VendorNavbar";
import VendorSidebar from "./VendorSidebar";

function VendorLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <VendorNavbar />
      <div className="flex">
        <VendorSidebar />
        <div className="flex-1 p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

export default VendorLayout;