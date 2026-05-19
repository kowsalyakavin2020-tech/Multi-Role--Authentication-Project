import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const sendOTP = async () => {
    try {
      await axios.post("http://localhost:8000/auth/send-otp", { mobile });
      setStep(2);
    } catch (err) {
      alert("Error to Sent OTP!");
    }
  };

  const verifyOTP = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/auth/verify-otp",
        { mobile, otp }
      );
      const { token, role, is_new_user, user_id } = response.data;
      if (is_new_user) {
        navigate("/register", { state: { mobile } });
        return;
      }
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("user_id", user_id);
      if (role === "admin") navigate("/admin/dashboard");
      else if (role === "supplier") navigate("/supplier/dashboard");
      else if (role === "vendor") navigate("/vendor/dashboard");
    } catch (err) {
      alert("தப்பான OTP!");
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="w-1/2 bg-blue-900 flex flex-col items-center justify-center text-white p-10">
        <div className="text-6xl mb-6">🔐</div>
        <h2 className="text-3xl font-bold mb-4">Multi Role Auth</h2>
        <p className="text-blue-300 text-center text-sm">
          Secure Login System for Admin, Supplier & Vendor
        </p>
      </div>
      <div className="w-1/2 flex items-center justify-center bg-gray-50">
        <div className="bg-white p-10 rounded-2xl shadow-lg w-96">
          <h1 className="text-2xl font-bold text-blue-900 mb-2">Welcome Back!</h1>
          <p className="text-gray-400 text-sm mb-6">Login to your account</p>
          {step === 1 && (
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Mobile Number</label>
                <input
                  type="text"
                  placeholder="Enter your mobile number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:border-blue-500"
                />
              </div>
              <button onClick={sendOTP}
                className="bg-blue-900 text-white p-3 rounded-lg w-full font-semibold hover:bg-blue-800">
                Send OTP
              </button>
              <p className="text-center text-sm text-gray-400">
                New user?{" "}
                <span onClick={() => navigate("/register")}
                  className="text-blue-600 cursor-pointer font-medium">
                  Register here
                </span>
              </p>
            </div>
          )}
          {step === 2 && (
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Enter OTP</label>
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:border-green-500"
                />
              </div>
              <button onClick={verifyOTP}
                className="bg-green-600 text-white p-3 rounded-lg w-full font-semibold hover:bg-green-700">
                Verify OTP
              </button>
              <p onClick={() => setStep(1)}
                className="text-center text-sm text-blue-600 cursor-pointer">
                Change Mobile Number
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;