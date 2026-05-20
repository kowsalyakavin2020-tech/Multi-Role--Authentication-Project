function Profile() {
  const user_id = localStorage.getItem("user_id");
  const role = localStorage.getItem("role");

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Profile</h2>

      <div className="max-w-2xl">
        {/* Profile Header Card */}
        <div className="bg-blue-900 rounded-t-xl p-8 flex items-center gap-6">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-blue-900 text-3xl font-bold shadow-lg">
            S
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">Supplier</h3>
            <p className="text-blue-300 text-sm mt-1">Member since 2026</p>
            <span className="bg-green-400 text-white text-xs px-3 py-1 rounded-full mt-2 inline-block">
              ● Active
            </span>
          </div>
        </div>

        {/* Profile Info Card */}
        <div className="bg-white rounded-b-xl shadow-md p-6">
          {/* User ID */}
          <div className="flex items-center justify-between py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center text-blue-900 font-bold text-sm">
                ID
              </div>
              <div>
                <p className="text-xs text-gray-400">User ID</p>
                <p className="text-gray-800 font-semibold">{user_id}</p>
              </div>
            </div>
          </div>

          {/* Role */}
          <div className="flex items-center justify-between py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-purple-100 rounded-lg flex items-center justify-center text-purple-700 font-bold text-sm">
                R
              </div>
              <div>
                <p className="text-xs text-gray-400">Role</p>
                <p className="text-gray-800 font-semibold capitalize">{role}</p>
              </div>
            </div>
            <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full font-semibold capitalize">
              {role}
            </span>
          </div>

          {/* Status */}
          <div className="flex items-center justify-between py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center text-green-700 font-bold text-sm">
                S
              </div>
              <div>
                <p className="text-xs text-gray-400">Account Status</p>
                <p className="text-gray-800 font-semibold">Active</p>
              </div>
            </div>
            <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-semibold">
              ● Active
            </span>
          </div>

          {/* Account Type */}
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-yellow-100 rounded-lg flex items-center justify-center text-yellow-700 font-bold text-sm">
                T
              </div>
              <div>
                <p className="text-xs text-gray-400">Account Type</p>
                <p className="text-gray-800 font-semibold">Business</p>
              </div>
            </div>
            <span className="bg-yellow-100 text-yellow-700 text-xs px-3 py-1 rounded-full font-semibold">
              Business
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;