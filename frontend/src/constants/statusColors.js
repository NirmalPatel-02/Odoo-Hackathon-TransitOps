// Central status → color map so every page (Fleet, Drivers, Trips, Maintenance...)
// renders the same status consistently.

export const STATUS_STYLES = {
  // Vehicle statuses
  Available: "bg-emerald-500/15 text-emerald-400 border-emerald-500/40",
  "On Trip": "bg-sky-500/15 text-sky-400 border-sky-500/40",
  "In Shop": "bg-amber-500/15 text-amber-400 border-amber-500/40",
  Retired: "bg-rose-500/15 text-rose-400 border-rose-500/40",

  // Driver statuses
  "Off Duty": "bg-slate-500/15 text-slate-400 border-slate-500/40",
  Suspended: "bg-orange-500/15 text-orange-400 border-orange-500/40",

  // Trip lifecycle
  Draft: "bg-slate-500/15 text-slate-400 border-slate-500/40",
  Dispatched: "bg-sky-500/15 text-sky-400 border-sky-500/40",
  Completed: "bg-emerald-500/15 text-emerald-400 border-emerald-500/40",
  Cancelled: "bg-rose-500/15 text-rose-400 border-rose-500/40",
};

export const DEFAULT_STATUS_STYLE =
  "bg-slate-500/15 text-slate-400 border-slate-500/40";