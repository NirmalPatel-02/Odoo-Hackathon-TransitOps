export default function BarChart({ data, title }) {
  if (!data?.length) {
    return (
      <div className="rounded-md border border-slate-800 bg-[#101318] p-4 text-sm text-slate-500">
        No chart data available.
      </div>
    );
  }

  const maxValue = Math.max(...data.map((item) => item.value || 0));

  return (
    <div className="rounded-md border border-slate-800 bg-[#101318] p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-200">{title}</h3>
        <span className="text-xs text-slate-500">Live backend values</span>
      </div>
      <div className="flex h-56 items-end gap-3">
        {data.map((item) => (
          <div key={item.label} className="flex flex-1 flex-col items-center gap-2">
            <div className="flex h-44 w-full items-end rounded-md bg-slate-900/70 p-2">
              <div
                className="w-full rounded-md bg-gradient-to-t from-amber-600 to-sky-500"
                style={{ height: `${maxValue ? (item.value / maxValue) * 100 : 0}%` }}
              />
            </div>
            <div className="text-center">
              <div className="text-xs font-medium text-slate-300">{item.label}</div>
              <div className="text-[11px] text-slate-500">{item.value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
