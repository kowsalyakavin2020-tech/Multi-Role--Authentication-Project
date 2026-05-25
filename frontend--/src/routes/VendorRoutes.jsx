import { Routes, Route, Navigate } from "react-router-dom";
import VendorLayout from "../components/vendor/VendorLayout";
import VendorDashboard from "../pages/vendor/VendorDashboard";
import BrowseProducts from "../pages/vendor/BrowseProducts";
import MyOrders from "../pages/vendor/MyOrders";
import VendorProfile from "../pages/vendor/VendorProfile";
import RequestProduct from "../pages/vendor/RequestProduct";

function VendorRoutes() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token || role !== "vendor") {
    return <Navigate to="/" />;
  }

  return (
    <VendorLayout>
      <Routes>
        <Route path="dashboard" element={<VendorDashboard />} />
        <Route path="browse-products" element={<BrowseProducts />} />
        <Route path="my-orders" element={<MyOrders />} />
        <Route path="request-product" element={<RequestProduct />} />
        <Route path="profile" element={<VendorProfile />} />
      </Routes>
    </VendorLayout>
  );
}

export default VendorRoutes;