import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import SupplierRoutes from "./routes/SupplierRoutes";
import VendorRoutes from "./routes/VendorRoutes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Supplier */}
        <Route path="/supplier/*" element={<SupplierRoutes />} />

        {/* Vendor */}
        <Route path="/vendor/*" element={<VendorRoutes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;