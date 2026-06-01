import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserCircle, Mail, Phone, Shield, Activity, Edit2, Save, X, LogOut } from "lucide-react";

function AdminProfile() {
  const user_id = localStorage.getItem("user_id");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState({
    name: "Admin",
    email: "admin@multirole.com",
    phone: "+91 98765 43210",
    user_id: user_id || "ADMIN",
    role: role || "admin",
    status: "Active",
    access: "Full Access",
  });
  const [tempProfile, setTempProfile] = useState({ ...profile });

  const handleEdit = () => {
    setTempProfile({ ...profile });
    setEditMode(true);
  };

  const handleSave = () => {
    setProfile({ ...tempProfile });
    setEditMode(false);
  };

  const handleCancel = () => {
    setTempProfile({ ...profile });
    setEditMode(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user_id");
    navigate("/");
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <UserCircle size={24} className="text-blue-600" />
            Admin Profile
          </h2>
          <p className="text-slate-600 text-sm mt-1 font-medium">
            Manage your account information
          </p>
        </div>
        <div className="flex gap-2">
          {!editMode ? (
            <button
              onClick={handleEdit}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-blue-700 transition"
            >
              <Edit2 size={15} />
              Edit Profile
            </button>
          ) : (
            <>
              <button
                onClick={handleSave}
                className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-green-700 transition"
              >
                <Save size={15} />
                Save
              </button>
              <button
                onClick={handleCancel}
                className="bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-slate-300 transition"
              >
                <X size={15} />
                Cancel
              </button>
            </>
          )}
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-red-700 transition"
          >
            <LogOut size={15} />
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-2xl">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-slate-800 to-blue-900 rounded-t-xl p-8 flex items-center gap-6">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-blue-900 text-3xl font-bold shadow-lg shrink-0">
            {profile.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">{profile.name}</h3>
            <p className="text-blue-300 text-sm mt-1">System Administrator</p>
            <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full mt-2 inline-block font-semibold">
              ● Active
            </span>
          </div>
        </div>

        {/* Profile Info */}
        <div className="bg-white rounded-b-xl border border-slate-200 shadow-sm p-6 space-y-4">

          {/* Name */}
          <div className="flex items-center justify-between py-3 border-b border-slate-100">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                <UserCircle size={18} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-slate-400 font-medium">Full Name</p>
                {editMode ? (
                  <input
                    type="text"
                    value={tempProfile.name}
                    onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
                    className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 mt-1 w-full max-w-xs"
                  />
                ) : (
                  <p className="text-slate-800 font-semibold">{profile.name}</p>
                )}
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center justify-between py-3 border-b border-slate-100">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-9 h-9 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                <Mail size={18} className="text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-slate-400 font-medium">Email Address</p>
                {editMode ? (
                  <input
                    type="email"
                    value={tempProfile.email}
                    onChange={(e) => setTempProfile({ ...tempProfile, email: e.target.value })}
                    className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 mt-1 w-full max-w-xs"
                  />
                ) : (
                  <p className="text-slate-800 font-semibold">{profile.email}</p>
                )}
              </div>
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-center justify-between py-3 border-b border-slate-100">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                <Phone size={18} className="text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-slate-400 font-medium">Phone Number</p>
                {editMode ? (
                  <input
                    type="text"
                    value={tempProfile.phone}
                    onChange={(e) => setTempProfile({ ...tempProfile, phone: e.target.value })}
                    className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 mt-1 w-full max-w-xs"
                  />
                ) : (
                  <p className="text-slate-800 font-semibold">{profile.phone}</p>
                )}
              </div>
            </div>
          </div>

          {/* User ID */}
          <div className="flex items-center justify-between py-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
                <span className="text-slate-600 font-bold text-xs">ID</span>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">User ID</p>
                <p className="text-slate-800 font-semibold font-mono">{profile.user_id}</p>
              </div>
            </div>
          </div>

          {/* Role */}
          <div className="flex items-center justify-between py-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-indigo-100 rounded-lg flex items-center justify-center shrink-0">
                <Shield size={18} className="text-indigo-600" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Role</p>
                <p className="text-slate-800 font-semibold capitalize">{profile.role}</p>
              </div>
            </div>
            <span className="bg-indigo-100 text-indigo-700 text-xs px-3 py-1 rounded-full font-bold capitalize">
              {profile.role}
            </span>
          </div>

          {/* Status */}
          <div className="flex items-center justify-between py-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                <Activity size={18} className="text-green-600" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Account Status</p>
                <p className="text-slate-800 font-semibold">{profile.status}</p>
              </div>
            </div>
            <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
              Active
            </span>
          </div>

          {/* Access Level */}
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
                <Shield size={18} className="text-red-600" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Access Level</p>
                <p className="text-slate-800 font-semibold">{profile.access}</p>
              </div>
            </div>
            <span className="bg-red-100 text-red-800 text-xs px-3 py-1 rounded-full font-bold">
              Full Access
            </span>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-5">
          <h4 className="text-red-800 font-bold text-sm mb-1">Danger Zone</h4>
          <p className="text-red-600 text-xs mb-3 font-medium">
            Logging out will end your current session.
          </p>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-red-700 transition"
          >
            <LogOut size={15} />
            Logout from Admin Panel
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminProfile;