import { useCallback, useEffect, useState } from "react";
import DataTable from "../../components/common/DataTable";
import KPICard from "../../components/dashboard/KPICard";
import {
  exportFleetReportCsv,
  getFleetSummary,
} from "../../api/endpoints/reports";
import { formatCurrency, formatNumber } from "../../utils/formatters";

const EMPTY_SUMMARY = {
  total_active_vehicles: 0,
  overall_fleet_utilization_pct: 0,
  total_operational_expenses: 0,
  vehicles_data: [],
};

function downloadFilename(contentDisposition) {
  const match = contentDisposition?.match(/filename="?([^";]+)"?/i);
  return match?.[1] || "fleet_operational_report.csv";
}

export default function AnalyticsPage() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const loadSummary = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const { data } = await getFleetSummary();
      setSummary({ ...EMPTY_SUMMARY, ...data });
    } catch (requestError) {
      setError(
        requestError.response?.data?.detail ||
          "Could not load fleet analytics. Please try again."
      );
      setSummary(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  const handleExport = async () => {
    setIsExporting(true);
    setError("");

    try {
      const response = await exportFleetReportCsv();
      const url = URL.createObjectURL(new Blob([response.data], { type: "text/csv" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = downloadFilename(response.headers["content-disposition"]);
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (requestError) {
      setError(
        requestError.response?.data?.detail ||
          "Could not export the fleet report. Please try again."
      );
    } finally {
      setIsExporting(false);
    }
  };

  const columns = [
    { key: "registration_number", label: "Registration No." },
    {
      key: "fuel_efficiency",
      label: "Fuel Efficiency",
      render: (vehicle) => `${formatNumber(vehicle.fuel_efficiency)} km/L`,
    },
    {
      key: "fleet_utilization",
      label: "Utilization",
      render: (vehicle) => `${formatNumber(vehicle.fleet_utilization)}%`,
    },
    {
      key: "total_fuel_cost",
      label: "Fuel Cost",
      render: (vehicle) => formatCurrency(vehicle.total_fuel_cost),
    },
    {
      key: "total_maintenance_cost",
      label: "Maintenance Cost",
      render: (vehicle) => formatCurrency(vehicle.total_maintenance_cost),
    },
    {
      key: "total_operational_cost",
      label: "Operational Cost",
      render: (vehicle) => formatCurrency(vehicle.total_operational_cost),
    },
    {
      key: "vehicle_roi",
      label: "Vehicle ROI",
      render: (vehicle) => `${(Number(vehicle.vehicle_roi || 0) * 100).toFixed(2)}%`,
    },
  ];

  if (isLoading) {
    return <p className="text-sm text-slate-500">Loading analytics...</p>;
  }

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-100">Reports &amp; Analytics</h1>
          <p className="mt-1 text-sm text-slate-500">
            Operational cost, utilization, fuel efficiency, and vehicle ROI.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={loadSummary}
            className="rounded-md border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:border-slate-600 hover:text-slate-100"
          >
            Refresh
          </button>
          <button
            type="button"
            onClick={handleExport}
            disabled={isExporting}
            className="rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-slate-950 transition-colors hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isExporting ? "Preparing CSV..." : "Export CSV"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-5 flex items-center justify-between gap-4 rounded-md border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
          <span>{error}</span>
          <button type="button" onClick={loadSummary} className="font-medium underline">
            Retry
          </button>
        </div>
      )}

      {summary && (
        <>
          <div className="mb-6 grid gap-3 sm:grid-cols-3">
            <KPICard
              label="Active Vehicles"
              value={formatNumber(summary.total_active_vehicles)}
              accent="sky"
            />
            <KPICard
              label="Fleet Utilization"
              value={`${formatNumber(summary.overall_fleet_utilization_pct)}%`}
              accent="emerald"
            />
            <KPICard
              label="Operational Expenses"
              value={formatCurrency(summary.total_operational_expenses)}
              accent="amber"
            />
          </div>

          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-slate-200">Vehicle Performance</h2>
            <span className="text-xs text-slate-500">
              {formatNumber(summary.vehicles_data.length)} vehicle(s)
            </span>
          </div>
          <DataTable
            columns={columns}
            rows={summary.vehicles_data}
            emptyMessage="No fleet data is available for analytics yet."
          />
        </>
      )}
    </section>
  );
}
