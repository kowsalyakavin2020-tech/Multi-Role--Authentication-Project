import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import SupplierRoutes from "./routes/SupplierRoutes";
import VendorRoutes from "./routes/VendorRoutes";
import AdminRoutes from "./routes/AdminRoutes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin */}
        <Route path="/admin/*" element={<AdminRoutes />} />

        {/* Supplier */}
        <Route path="/supplier/*" element={<SupplierRoutes />} />

        {/* Vendor */}
        <Route path="/vendor/*" element={<VendorRoutes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;