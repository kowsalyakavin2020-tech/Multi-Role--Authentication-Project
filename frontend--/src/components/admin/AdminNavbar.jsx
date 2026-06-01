import { Bell } from "lucide-react";

function AdminNavbar() {
  const user_id = localStorage.getItem("user_id");
  const role = localStorage.getItem("role");

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center shadow-sm fixed top-0 left-56 right-0 z-10">
      <div>
        <h2 className="text-slate-800 font-semibold text-sm">
          Welcome back, <span className="text-blue-600">Admin!</span>
        </h2>
      </div>
      <div className="flex items-center gap-3">
        <button className="relative p-2 rounded-lg hover:bg-slate-100 text-slate-600">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5">
          <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
            A
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-800">{user_id}</p>
            <p className="text-xs text-slate-400 capitalize">{role}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminNavbar;