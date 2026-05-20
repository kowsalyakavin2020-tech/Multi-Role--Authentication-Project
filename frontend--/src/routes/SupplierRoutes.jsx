import { Routes, Route, Navigate } from "react-router-dom";
import SupplierLayout from "../components/supplier/SupplierLayout";
import SupplierDashboard from "../pages/supplier/SupplierDashboard";
import StockList from "../pages/supplier/StockList";
import AddProduct from "../pages/supplier/AddProduct";
import VendorRequests from "../pages/supplier/VendorRequests";
import Profile from "../pages/supplier/Profile";

function SupplierRoutes() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token || role !== "supplier") {
    return <Navigate to="/" />;
  }

  return (
    <SupplierLayout>
      <Routes>
        <Route path="dashboard" element={<SupplierDashboard />} />
        <Route path="stock-list" element={<StockList />} />
        <Route path="add-product" element={<AddProduct />} />
        <Route path="vendor-requests" element={<VendorRequests />} />
        <Route path="profile" element={<Profile />} />
      </Routes>
    </SupplierLayout>
  );
}

export default SupplierRoutes;