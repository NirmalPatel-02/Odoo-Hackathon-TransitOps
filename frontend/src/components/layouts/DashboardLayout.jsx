import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function DashboardLayout({ role, userName, children }) {
  return (
    <div className="flex min-h-screen bg-[#0b0d10] text-slate-200">
      <Sidebar role={role} />
      <div className="flex flex-1 flex-col">
        <Topbar userName={userName} role={role} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}