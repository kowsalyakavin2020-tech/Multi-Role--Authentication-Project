import { useState, useEffect } from "react";
import { UserCircle, Phone, Building2, MapPin, Briefcase, Shield, LogOut, Edit, Save, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../services/api/apiClient";

function VendorProfile() {
  const user_id = localStorage.getItem("user_id");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await apiClient.get("/vendor/profile");
        setProfile(response.data.data);
        setEditData(response.data.data);
      } catch (err) {
        console.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user_id");
    navigate("/");
  };

  const handleSave = () => {
    setProfile(editData);
    setEditMode(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-slate-700 text-sm font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  const Field = ({ icon, iconBg, iconColor, label, field, disabled = false }) => (
    <div className="flex items-center justify-between py-4 border-b border-slate-100">
      <div className="flex items-center gap-3 flex-1">
        <div className={`w-9 h-9 ${iconBg} rounded-lg flex items-center justify-center`}>
          {typeof icon === "string" ? (
            <span className={`${iconColor} font-bold text-sm`}>{icon}</span>
          ) : (
            <span className={iconColor}>{icon}</span>
          )}
        </div>
        <div className="flex-1">
          <p className="text-xs text-slate-500 font-medium">{label}</p>
          {editMode && !disabled ? (
            <input
              type="text"
              value={editData[field] || ""}
              onChange={(e) => setEditData({ ...editData, [field]: e.target.value })}
              className="border border-slate-200 rounded-lg px-2 py-1 text-sm text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-blue-400 mt-1 w-full max-w-xs"
            />
          ) : (
            <p className="text-slate-900 font-bold">{profile?.[field] || (field === "user_id" ? user_id : "N/A")}</p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <UserCircle size={20} className="text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Profile</h2>
            <p className="text-slate-600 text-sm">Your account information</p>
          </div>
        </div>
        <div className="flex gap-2">
          {editMode ? (
            <>
              <button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition"
              >
                <Save size={15} /> Save
              </button>
              <button
                onClick={() => { setEditMode(false); setEditData(profile); }}
                className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition"
              >
                <X size={15} /> Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition"
            >
              <Edit size={15} /> Edit Profile
            </button>
          )}
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition"
          >
            <LogOut size={15} /> Logout
          </button>
        </div>
      </div>

      <div className="max-w-2xl">
        {/* Profile Header Card */}
        <div className="bg-blue-600 rounded-t-xl p-8 flex items-center gap-6">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-blue-600 text-3xl font-bold shadow-lg">
            {profile?.name?.charAt(0).toUpperCase() || "V"}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">
              {profile?.name || user_id}
            </h3>
            <p className="text-blue-200 text-sm mt-1">{profile?.business_name || "Business"}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-semibold capitalize">
                {role}
              </span>
              <span className="bg-green-400 text-white text-xs px-3 py-1 rounded-full font-semibold">
                ● Active
              </span>
            </div>
          </div>
        </div>

        {/* Profile Info Card */}
        <div className="bg-white rounded-b-xl shadow-md p-6">

          {/* User ID - disabled edit */}
          <div className="flex items-center justify-between py-4 border-b border-slate-100">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center text-blue-700 font-bold text-sm">
                ID
              </div>
              <div className="flex-1">
                <p className="text-xs text-slate-500 font-medium">User ID</p>
                {editMode ? (
                  <input
                    type="text"
                    value={editData.user_id || user_id}
                    onChange={(e) => setEditData({ ...editData, user_id: e.target.value })}
                    className="border border-slate-200 rounded-lg px-2 py-1 text-sm text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-blue-400 mt-1 w-full max-w-xs"
                  />
                ) : (
                  <p className="text-slate-900 font-bold">{user_id}</p>
                )}
              </div>
            </div>
          </div>

          {/* Mobile */}
          <div className="flex items-center justify-between py-4 border-b border-slate-100">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center">
                <Phone size={16} className="text-green-700" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-slate-500 font-medium">Mobile</p>
                {editMode ? (
                  <input
                    type="text"
                    value={editData.mobile || ""}
                    onChange={(e) => setEditData({ ...editData, mobile: e.target.value })}
                    className="border border-slate-200 rounded-lg px-2 py-1 text-sm text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-blue-400 mt-1 w-full max-w-xs"
                  />
                ) : (
                  <p className="text-slate-900 font-bold">{profile?.mobile || "N/A"}</p>
                )}
              </div>
            </div>
          </div>

          {/* Business Name */}
          <div className="flex items-center justify-between py-4 border-b border-slate-100">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-9 h-9 bg-purple-100 rounded-lg flex items-center justify-center">
                <Building2 size={16} className="text-purple-700" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-slate-500 font-medium">Business Name</p>
                {editMode ? (
                  <input
                    type="text"
                    value={editData.business_name || ""}
                    onChange={(e) => setEditData({ ...editData, business_name: e.target.value })}
                    className="border border-slate-200 rounded-lg px-2 py-1 text-sm text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-blue-400 mt-1 w-full max-w-xs"
                  />
                ) : (
                  <p className="text-slate-900 font-bold">{profile?.business_name || "N/A"}</p>
                )}
              </div>
            </div>
          </div>

          {/* Business Type */}
          <div className="flex items-center justify-between py-4 border-b border-slate-100">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-9 h-9 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Briefcase size={16} className="text-yellow-700" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-slate-500 font-medium">Business Type</p>
                {editMode ? (
                  <input
                    type="text"
                    value={editData.business_type || ""}
                    onChange={(e) => setEditData({ ...editData, business_type: e.target.value })}
                    className="border border-slate-200 rounded-lg px-2 py-1 text-sm text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-blue-400 mt-1 w-full max-w-xs"
                  />
                ) : (
                  <p className="text-slate-900 font-bold">{profile?.business_type || "N/A"}</p>
                )}
              </div>
            </div>
            {!editMode && (
              <span className="bg-yellow-500 text-white text-xs px-3 py-1 rounded-full font-bold">
                {profile?.business_type || "N/A"}
              </span>
            )}
          </div>

          {/* Location */}
          <div className="flex items-center justify-between py-4 border-b border-slate-100">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-9 h-9 bg-red-100 rounded-lg flex items-center justify-center">
                <MapPin size={16} className="text-red-700" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-slate-500 font-medium">Location</p>
                {editMode ? (
                  <input
                    type="text"
                    value={editData.location || ""}
                    onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                    className="border border-slate-200 rounded-lg px-2 py-1 text-sm text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-blue-400 mt-1 w-full max-w-xs"
                  />
                ) : (
                  <p className="text-slate-900 font-bold">{profile?.location || "N/A"}</p>
                )}
              </div>
            </div>
          </div>

          {/* Role */}
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Shield size={16} className="text-indigo-700" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Role</p>
                <p className="text-slate-900 font-bold capitalize">{role}</p>
              </div>
            </div>
            <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-bold capitalize">
              {role}
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}

export default VendorProfile;