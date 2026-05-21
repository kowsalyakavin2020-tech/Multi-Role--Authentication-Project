import { Outlet } from "react-router-dom";
import SupplierNavbar from "./SupplierNavbar";
import SupplierSidebar from "./SupplierSidebar";

function SupplierLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <SupplierNavbar />
      <div className="flex">
        <SupplierSidebar />
        <div className="flex-1 p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

export default SupplierLayout;