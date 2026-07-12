export default function FilterSelect({ value, onChange, options, prefixLabel }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-md border border-slate-800 bg-[#101318] px-3 py-2 text-sm text-slate-300 focus:border-amber-600/60 focus:outline-none"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {prefixLabel ? `${prefixLabel}: ${opt.label}` : opt.label}
        </option>
      ))}
    </select>
  );
}