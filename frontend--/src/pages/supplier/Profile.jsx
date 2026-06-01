import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User, Mail, Phone, IdCard, ShieldCheck,
  Activity, Briefcase, LogOut, Pencil, X, Save,
} from "lucide-react";

function Profile() {
  const navigate = useNavigate();

  const user_id = localStorage.getItem("user_id") || "SUP002";
  const role = localStorage.getItem("role") || "supplier";

  const [name, setName] = useState(localStorage.getItem("name") || "Supplier");
  const [email, setEmail] = useState(localStorage.getItem("email") || "");
  const [phone, setPhone] = useState(localStorage.getItem("phone") || "");

  const [showModal, setShowModal] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleOpenEdit = () => {
    setEditName(name);
    setEditEmail(email);
    setEditPhone(phone);
    setShowModal(true);
  };

  const handleSave = () => {
    if (editName.trim()) {
      localStorage.setItem("name", editName.trim());
      setName(editName.trim());
    }
    localStorage.setItem("email", editEmail.trim());
    localStorage.setItem("phone", editPhone.trim());
    setEmail(editEmail.trim());
    setPhone(editPhone.trim());
    setShowModal(false);
    alert("Profile updated successfully!");
  };

  return (
    <div>
      {/* Modal */}
      {showModal && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}
        >
          <div style={{ background: "white", borderRadius: "16px", padding: "24px", width: "100%", maxWidth: "420px", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-gray-800">Edit Profile</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="text-sm text-gray-500 mb-1 block">Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:border-blue-500 text-sm"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="text-sm text-gray-500 mb-1 block">Email Address</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:border-blue-500 text-sm"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="text-sm text-gray-500 mb-1 block">Mobile Number</label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:border-blue-500 text-sm"
                  placeholder="Enter your mobile number"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 border border-gray-300 text-gray-600 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-sm font-medium"
              >
                <Save className="w-4 h-4" /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <User className="text-gray-500 w-7 h-7" />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Supplier Profile</h2>
            <p className="text-sm text-gray-400 mt-0.5">Manage your account information</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleOpenEdit}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg"
          >
            <Pencil className="w-4 h-4" /> Edit Profile
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-lg"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </div>

      <div className="max-w-2xl">
        {/* Hero */}
        <div
          className="rounded-xl p-8 flex items-center gap-6 mb-4"
          style={{ background: "linear-gradient(135deg, #1e2d6b 0%, #2a3a8a 60%, #1a237e 100%)" }}
        >
          <div className="w-20 h-20 bg-white/20 border-2 border-white/30 rounded-full flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
            {name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">{name}</h3>
            <p className="text-blue-300 text-sm mt-1">Member since 2026</p>
            <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full mt-2 inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-white rounded-full"></span> Active
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-5 mb-4">
          <div className="flex items-center py-4 border-b border-gray-100 gap-3">
            <div className="w-9 h-9 bg-indigo-50 rounded-lg flex items-center justify-center">
              <IdCard className="w-4 h-4 text-indigo-700" />
            </div>
            <div>
              <p className="text-xs text-gray-400">User ID</p>
              <p className="text-gray-800 font-semibold">{user_id}</p>
            </div>
          </div>

          <div className="flex items-center py-4 border-b border-gray-100 gap-3">
            <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
              <User className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Full Name</p>
              <p className="text-gray-800 font-semibold">{name}</p>
            </div>
          </div>

          <div className="flex items-center py-4 border-b border-gray-100 gap-3">
            <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
              <Mail className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Email Address</p>
              <p className="text-gray-800 font-semibold">{email || "—"}</p>
            </div>
          </div>

          <div className="flex items-center py-4 border-b border-gray-100 gap-3">
            <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center">
              <Phone className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Phone Number</p>
              <p className="text-gray-800 font-semibold">{phone || "—"}</p>
            </div>
          </div>

          <div className="flex items-center justify-between py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-purple-50 rounded-lg flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-purple-700" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Role</p>
                <p className="text-gray-800 font-semibold capitalize">{role}</p>
              </div>
            </div>
            <span className="bg-indigo-50 text-indigo-700 text-xs px-3 py-1 rounded-full font-semibold capitalize">{role}</span>
          </div>

          <div className="flex items-center justify-between py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center">
                <Activity className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Account Status</p>
                <p className="text-gray-800 font-semibold">Active</p>
              </div>
            </div>
            <span className="bg-green-50 text-green-700 text-xs px-3 py-1 rounded-full font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Active
            </span>
          </div>

          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-orange-50 rounded-lg flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Account Type</p>
                <p className="text-gray-800 font-semibold">Business</p>
              </div>
            </div>
            <span className="bg-orange-50 text-orange-700 text-xs px-3 py-1 rounded-full font-semibold">Business</span>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-5">
          <p className="text-red-600 font-semibold text-sm mb-1">Danger Zone</p>
          <p className="text-red-400 text-xs mb-4">Logging out will end your current session.</p>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-lg"
          >
            <LogOut className="w-4 h-4" /> Logout from Supplier Panel
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;