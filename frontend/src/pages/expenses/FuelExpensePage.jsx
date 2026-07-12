import { useEffect, useMemo, useState } from "react";
import DataTable from "../../components/common/DataTable";
import { listExpenses } from "../../api/endpoints/fuelExpenses";

const number = (value) => {
  const n = Number(value);

  if (Number.isNaN(n)) return "-";

  return n.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const currency = (value) => `₹ ${number(value)}`;

export default function FuelExpensePage() {
  const [summary, setSummary] = useState({
    total_active_vehicles: 0,
    overall_fleet_utilization_pct: "0",
    total_operational_expenses: "0",
  });

  const [vehicles, setVehicles] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchExpenses = async () => {
    try {
      setLoading(true);

      const { data } = await listExpenses();

      console.log(data);

      setSummary({
        total_active_vehicles: data.total_active_vehicles,
        overall_fleet_utilization_pct:
          data.overall_fleet_utilization_pct,
        total_operational_expenses:
          data.total_operational_expenses,
      });

      setVehicles(data.vehicles_data || []);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Unable to load fleet expense data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const filteredVehicles = useMemo(() => {
    if (!search.trim()) return vehicles;

    return vehicles.filter((vehicle) =>
      vehicle.registration_number
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [vehicles, search]);

  const columns = [
    {
      key: "registration_number",
      label: "Registration No.",
    },
    {
      key: "fuel_efficiency",
      label: "Fuel Efficiency",
      render: (row) => `${number(row.fuel_efficiency)} km/l`,
    },
    {
      key: "fleet_utilization",
      label: "Utilization",
      render: (row) => `${number(row.fleet_utilization)} %`,
    },
    {
      key: "total_fuel_cost",
      label: "Fuel Cost",
      render: (row) => currency(row.total_fuel_cost),
    },
    {
      key: "total_maintenance_cost",
      label: "Maintenance",
      render: (row) => currency(row.total_maintenance_cost),
    },
    {
      key: "total_operational_cost",
      label: "Operational Cost",
      render: (row) => currency(row.total_operational_cost),
    },
    {
      key: "vehicle_roi",
      label: "ROI",
      render: (row) => `${number(row.vehicle_roi)} %`,
    },
  ];

  return (
    <div className="space-y-6">

      <div className="grid gap-4 md:grid-cols-3">

        <div className="rounded-xl border border-slate-800 bg-[#11151b] p-5">
          <p className="text-sm text-slate-400">
            Active Vehicles
          </p>

          <h2 className="mt-2 text-3xl font-bold text-white">
            {summary.total_active_vehicles}
          </h2>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#11151b] p-5">
          <p className="text-sm text-slate-400">
            Fleet Utilization
          </p>

          <h2 className="mt-2 text-3xl font-bold text-amber-400">
            {number(summary.overall_fleet_utilization_pct)}%
          </h2>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#11151b] p-5">
          <p className="text-sm text-slate-400">
            Operational Expenses
          </p>

          <h2 className="mt-2 text-3xl font-bold text-emerald-400">
            {currency(summary.total_operational_expenses)}
          </h2>
        </div>

      </div>

      <div className="flex justify-end">

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search registration number..."
          className="w-full max-w-sm rounded-md border border-slate-700 bg-[#11151b] px-4 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:border-amber-500 focus:outline-none"
        />

      </div>

      {error && (
        <div className="rounded-md border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-slate-400">
          Loading fleet expenses...
        </div>
      ) : (
        <DataTable
          columns={columns}
          rows={filteredVehicles}
          emptyMessage="No vehicle expense records found."
        />
      )}
    </div>
  );
}