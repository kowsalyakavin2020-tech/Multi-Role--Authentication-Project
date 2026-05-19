import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

function Register() {
  const location = useLocation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    mobile: location.state?.mobile || "",
    location: "",
    business_name: "",
    business_type: "",
    role: "supplier",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/auth/register",
        formData
      );
      const { token, role, user_id } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("user_id", user_id);

      if (role === "supplier") navigate("/supplier/dashboard");
      else if (role === "vendor") navigate("/vendor/dashboard");
    } catch (err) {
      alert("Registration Failed!");
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="w-1/2 bg-blue-900 flex flex-col items-center justify-center text-white p-10">
        <div className="text-6xl mb-6">📝</div>
        <h2 className="text-3xl font-bold mb-4">Join Us!</h2>
        <p className="text-blue-300 text-center text-sm">
          Register as Supplier or Vendor
        </p>
      </div>
      <div className="w-1/2 flex items-center justify-center bg-gray-50">
        <div className="bg-white p-10 rounded-2xl shadow-lg w-96">
          <h1 className="text-2xl font-bold text-blue-900 mb-2">
            Create Account
          </h1>
          <p className="text-gray-400 text-sm mb-6">Fill in your details</p>
          <div className="flex flex-col gap-3">
            <input type="text" name="name" placeholder="Full Name"
              value={formData.name} onChange={handleChange}
              className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:border-blue-500"
            />
            <input type="text" name="mobile" placeholder="Mobile Number"
              value={formData.mobile} onChange={handleChange}
              className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:border-blue-500"
            />
            <input type="text" name="location" placeholder="Location"
              value={formData.location} onChange={handleChange}
              className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:border-blue-500"
            />
            <input type="text" name="business_name" placeholder="Business Name"
              value={formData.business_name} onChange={handleChange}
              className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:border-blue-500"
            />
            <input type="text" name="business_type" placeholder="Business Type"
              value={formData.business_type} onChange={handleChange}
              className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:border-blue-500"
            />
            <select name="role" value={formData.role} onChange={handleChange}
              className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:border-blue-500"
            >
              <option value="supplier">Supplier</option>
              <option value="vendor">Vendor</option>
            </select>
            <button onClick={handleRegister}
              className="bg-blue-900 text-white p-3 rounded-lg w-full font-semibold hover:bg-blue-800"
            >
              Register
            </button>
            <p className="text-center text-sm text-gray-400">
              Already have account?{" "}
              <span onClick={() => navigate("/")}
                className="text-blue-600 cursor-pointer font-medium"
              >
                Login here
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;