import SupplierNavbar from "./SupplierNavbar";
import SupplierSidebar from "./SupplierSidebar";

function SupplierLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-100">
      <SupplierSidebar />
      <div className="ml-56">
        <SupplierNavbar />
        <div className="mt-14 p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

export default SupplierLayout;