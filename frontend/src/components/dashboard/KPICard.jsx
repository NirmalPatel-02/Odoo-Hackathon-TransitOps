const ACCENTS = {
  neutral: "border-l-slate-600",
  emerald: "border-l-emerald-500",
  amber: "border-l-amber-500",
  sky: "border-l-sky-500",
};

export default function KPICard({ label, value, accent = "neutral" }) {
  return (
    <div
      className={`rounded-md border border-slate-800 border-l-4 bg-[#101318] px-4 py-3 ${ACCENTS[accent]}`}
    >
      <p className="text-[11px] uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-2xl font-semibold text-slate-100">{value}</p>
    </div>
  );
}