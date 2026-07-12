const BAR_COLORS = {
  Available: "bg-emerald-500",
  "On Trip": "bg-sky-500",
  "In Shop": "bg-amber-500",
  Retired: "bg-rose-500",
};

export default function VehicleStatusPanel({ breakdown }) {
  const total = Object.values(breakdown).reduce((sum, n) => sum + n, 0) || 1;

  return (
    <div className="rounded-md border border-slate-800 bg-[#101318] p-4">
      <h2 className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
        Vehicle Status
      </h2>

      <div className="space-y-3">
        {Object.entries(breakdown).map(([status, count]) => (
          <div key={status}>
            <div className="mb-1 flex justify-between text-xs text-slate-400">
              <span>{status}</span>
              <span>{count}</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-800">
              <div
                className={`h-2 rounded-full ${BAR_COLORS[status] || "bg-slate-600"}`}
                style={{ width: `${(count / total) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}