import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useAuth } from "../../context/AuthContext";

export default function DashboardLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-screen bg-[#0b0d10] text-slate-200">
      <Sidebar role={user?.role_name} />

      <div className="flex flex-1 flex-col">
        <Topbar
          userName={user?.name}
          role={user?.role_name}
          onLogout={logout}
        />

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}