const selectClasses =
  "rounded-md border border-slate-800 bg-[#101318] px-3 py-2 text-sm text-slate-300 focus:border-amber-600/60 focus:outline-none";

export default function FilterBar({ filters, onChange }) {
  const handle = (key) => (e) => onChange({ ...filters, [key]: e.target.value });

  return (
    <div className="mb-4 flex flex-wrap items-center gap-3">
      <span className="text-xs uppercase tracking-wide text-slate-500">
        Filters
      </span>

      <select
        className={selectClasses}
        value={filters.vehicleType}
        onChange={handle("vehicleType")}
      >
        <option value="All">Vehicle Type: All</option>
        <option value="Van">Van</option>
        <option value="Truck">Truck</option>
        <option value="Mini">Mini</option>
      </select>

      <select
        className={selectClasses}
        value={filters.status}
        onChange={handle("status")}
      >
        <option value="All">Status: All</option>
        <option value="Available">Available</option>
        <option value="On Trip">On Trip</option>
        <option value="In Shop">In Shop</option>
        <option value="Retired">Retired</option>
      </select>

      <select
        className={selectClasses}
        value={filters.region}
        onChange={handle("region")}
      >
        <option value="All">Region: All</option>
        <option value="Gandhinagar">Gandhinagar</option>
        <option value="Ahmedabad">Ahmedabad</option>
      </select>
    </div>
  );
}