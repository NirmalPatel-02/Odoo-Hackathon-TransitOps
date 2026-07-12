export default function Topbar({ userName, role, onLogout }) {
  const initials = (userName || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="flex items-center justify-between border-b border-slate-800 bg-[#0b0d10] px-6 py-4 text-white">
      <input
        type="text"
        placeholder="Search..."
        className="w-72 rounded-md border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400 focus:border-amber-500/60 focus:outline-none"
      />

      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-100">{userName}</span>
        <span className="flex items-center gap-2 rounded-full border border-sky-500/40 bg-sky-500/10 py-1 pl-3 pr-1 text-xs font-medium text-sky-300">
          {role}
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-500/30 text-[11px] text-white">
            {initials}
          </span>
        </span>
        <button
          type="button"
          onClick={onLogout}
          className="rounded-md border border-slate-700 px-3 py-1.5 text-xs text-slate-200 transition-colors hover:border-rose-500/40 hover:text-rose-300"
        >
          Log out
        </button>
      </div>
    </header>
  );
}