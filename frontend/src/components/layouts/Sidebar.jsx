import { NavLink } from "react-router-dom";
import { NAV_ITEMS } from "../../constants/navigation";
import { canView } from "../../constants/permissions";

export default function Sidebar({ role }) {
  const visibleItems = NAV_ITEMS.filter((item) => canView(role, item.resource));

  return (
    <aside className="flex h-screen w-56 shrink-0 flex-col border-r border-slate-800 bg-[#0b0d10] text-white">
      <div className="px-5 py-6">
        <h1 className="text-lg font-semibold tracking-tight text-white">
          TransitOps
        </h1>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {visibleItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `block rounded-md border px-3 py-2 text-sm transition-colors ${
                isActive
                  ? "border-amber-600/60 bg-amber-600/10 text-amber-300"
                  : "border-transparent text-slate-200 hover:bg-slate-800/60 hover:text-white"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}