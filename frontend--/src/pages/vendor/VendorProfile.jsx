import { useState, useEffect } from "react";
import apiClient from "../../services/api/apiClient";

function VendorProfile() {
  const user_id = localStorage.getItem("user_id");
  const role = localStorage.getItem("role");
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await apiClient.get("/vendor/profile");
        setProfile(response.data);
      } catch (err) {
        console.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-blue-900 border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Profile</h2>
        <p className="text-gray-500 text-sm mt-1">Your account information</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-lg">
        {/* Avatar + Name */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-blue-900 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {profile?.name?.charAt(0).toUpperCase() || "V"}
          </div>
          <div>
            <p className="font-bold text-gray-800 text-lg">{profile?.name || user_id}</p>
            <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full font-medium capitalize">
              {role}
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-3">
          <div className="flex justify-between border-b border-gray-100 pb-3">
            <span className="text-gray-500 text-sm">User ID</span>
            <span className="text-gray-800 font-medium text-sm">{user_id}</span>
          </div>
          <div className="flex justify-between border-b border-gray-100 pb-3">
            <span className="text-gray-500 text-sm">Full Name</span>
            <span className="text-gray-800 font-medium text-sm">{profile?.name || "N/A"}</span>
          </div>
          <div className="flex justify-between border-b border-gray-100 pb-3">
            <span className="text-gray-500 text-sm">Mobile</span>
            <span className="text-gray-800 font-medium text-sm">{profile?.mobile || "N/A"}</span>
          </div>
          <div className="flex justify-between border-b border-gray-100 pb-3">
            <span className="text-gray-500 text-sm">Business Name</span>
            <span className="text-gray-800 font-medium text-sm">{profile?.business_name || "N/A"}</span>
          </div>
          <div className="flex justify-between border-b border-gray-100 pb-3">
            <span className="text-gray-500 text-sm">Business Type</span>
            <span className="text-gray-800 font-medium text-sm">{profile?.business_type || "N/A"}</span>
          </div>
          <div className="flex justify-between pb-3">
            <span className="text-gray-500 text-sm">Location</span>
            <span className="text-gray-800 font-medium text-sm">{profile?.location || "N/A"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VendorProfile;