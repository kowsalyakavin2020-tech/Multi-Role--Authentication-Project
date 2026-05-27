import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "../components/admin/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import Suppliers from "../pages/admin/Suppliers";
import Vendors from "../pages/admin/Vendors";
import Products from "../pages/admin/Products";
import Orders from "../pages/admin/Orders";
import StockMonitoring from "../pages/admin/StockMonitoring";
import AdminProfile from "../pages/admin/AdminProfile";

function AdminRoutes() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token || role !== "admin") {
    return <Navigate to="/" />;
  }

  return (
    <AdminLayout>
      <Routes>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="suppliers" element={<Suppliers />} />
        <Route path="vendors" element={<Vendors />} />
        <Route path="products" element={<Products />} />
        <Route path="orders" element={<Orders />} />
        <Route path="stock-monitoring" element={<StockMonitoring />} />
        <Route path="profile" element={<AdminProfile />} />
      </Routes>
    </AdminLayout>
  );
}

export default AdminRoutes;