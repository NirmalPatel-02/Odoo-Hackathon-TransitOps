import { useCallback, useEffect, useMemo, useState } from "react";
import DataTable from "../../components/common/DataTable";
import KPICard from "../../components/dashboard/KPICard";
import { exportFleetReportCsv, getFleetSummary } from "../../api/endpoints/reports";
import { useAuth } from "../../context/AuthContext";
import { canEdit } from "../../constants/permissions";
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

function formatPercent(value) {
  const numericValue = Number(value || 0);
  return `${numericValue.toFixed(2)}%`;
}

export default function AnalyticsPage() {
  const { user } = useAuth();
  const editable = canEdit(user?.role_name, "analytics");

  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isExportingCsv, setIsExportingCsv] = useState(false);
  const [isPreparingPdf, setIsPreparingPdf] = useState(false);

  const loadSummary = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const { data } = await getFleetSummary();
      setSummary({ ...EMPTY_SUMMARY, ...data });
    } catch (requestError) {
      setError(requestError.response?.data?.detail || "Could not load fleet analytics. Please try again.");
      setSummary(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  const metrics = useMemo(() => {
    const vehicles = summary?.vehicles_data || [];
    const averageFuelEfficiency = vehicles.length
      ? vehicles.reduce((total, vehicle) => total + Number(vehicle.fuel_efficiency || 0), 0) / vehicles.length
      : 0;
    const averageRoi = vehicles.length
      ? vehicles.reduce((total, vehicle) => total + Number(vehicle.vehicle_roi || 0), 0) / vehicles.length
      : 0;

    return {
      averageFuelEfficiency,
      averageRoi,
    };
  }, [summary]);

  const handleExportCsv = async () => {
    setIsExportingCsv(true);
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
      setError(requestError.response?.data?.detail || "Could not export the fleet report. Please try again.");
    } finally {
      setIsExportingCsv(false);
    }
  };

  const handleExportPdf = () => {
    if (!summary) return;

    setIsPreparingPdf(true);
    setError("");

    const pdfWindow = window.open("", "_blank", "width=900,height=700");
    if (!pdfWindow) {
      setError("Please allow popups to generate the PDF preview.");
      setIsPreparingPdf(false);
      return;
    }

    const rows = summary.vehicles_data
      .map(
        (vehicle) => `
          <tr>
            <td>${vehicle.registration_number}</td>
            <td>${formatNumber(vehicle.fuel_efficiency)} km/L</td>
            <td>${formatPercent(vehicle.fleet_utilization)}</td>
            <td>${formatCurrency(vehicle.total_operational_cost)}</td>
            <td>${formatPercent(vehicle.vehicle_roi * 100)}</td>
          </tr>
        `
      )
      .join("");

    const markup = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>TransitOps Fleet Report</title>
          <style>
            body { font-family: Arial, sans-serif; color: #111827; padding: 24px; }
            h1 { margin-bottom: 8px; }
            .meta { color: #4b5563; margin-bottom: 20px; }
            .cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 20px; }
            .card { border: 1px solid #d1d5db; border-radius: 8px; padding: 12px; }
            table { width: 100%; border-collapse: collapse; font-size: 12px; }
            th, td { padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: left; }
            th { background: #f3f4f6; }
            .note { margin-top: 16px; font-size: 12px; color: #4b5563; }
            @media print { body { padding: 0; } }
          </style>
        </head>
        <body>
          <h1>TransitOps Fleet Operational Report</h1>
          <div class="meta">Generated from the live backend report summary.</div>
          <div class="cards">
            <div class="card"><strong>Active Vehicles</strong><br />${formatNumber(summary.total_active_vehicles)}</div>
            <div class="card"><strong>Fuel Efficiency</strong><br />${formatNumber(metrics.averageFuelEfficiency)} km/L</div>
            <div class="card"><strong>Fleet Utilization</strong><br />${formatPercent(summary.overall_fleet_utilization_pct)}</div>
            <div class="card"><strong>Vehicle ROI</strong><br />${formatPercent(metrics.averageRoi * 100)}</div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Vehicle</th>
                <th>Fuel Efficiency</th>
                <th>Utilization</th>
                <th>Operational Cost</th>
                <th>ROI</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
          <div class="note">Use the browser print option to save this report as a PDF.</div>
        </body>
      </html>
    `;

    pdfWindow.document.write(markup);
    pdfWindow.document.close();
    pdfWindow.focus();
    setTimeout(() => {
      pdfWindow.print();
      setIsPreparingPdf(false);
    }, 250);
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
      render: (vehicle) => formatPercent(vehicle.fleet_utilization),
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
      render: (vehicle) => formatPercent(Number(vehicle.vehicle_roi || 0) * 100),
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
            Live fleet performance metrics from the backend, including fuel efficiency, utilization, operational cost, and vehicle ROI.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={loadSummary}
            className="rounded-md border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:border-slate-600 hover:text-slate-100"
          >
            Refresh
          </button>
          {editable && (
            <>
              <button
                type="button"
                onClick={handleExportCsv}
                disabled={isExportingCsv}
                className="rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-slate-950 transition-colors hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isExportingCsv ? "Preparing CSV..." : "Export CSV"}
              </button>
              <button
                type="button"
                onClick={handleExportPdf}
                disabled={isPreparingPdf}
                className="rounded-md border border-sky-500/40 px-4 py-2 text-sm font-medium text-sky-300 transition-colors hover:border-sky-400 hover:text-sky-200 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isPreparingPdf ? "Preparing PDF..." : "Download PDF"}
              </button>
            </>
          )}
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
          <div className="mb-6 grid gap-3 sm:grid-cols-4">
            <KPICard label="Active Vehicles" value={formatNumber(summary.total_active_vehicles)} accent="sky" />
            <KPICard label="Fuel Efficiency" value={`${formatNumber(metrics.averageFuelEfficiency)} km/L`} accent="emerald" />
            <KPICard label="Fleet Utilization" value={formatPercent(summary.overall_fleet_utilization_pct)} accent="amber" />
            <KPICard label="Vehicle ROI" value={formatPercent(metrics.averageRoi * 100)} accent="sky" />
          </div>

          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-slate-200">Vehicle Performance</h2>
            <span className="text-xs text-slate-500">{formatNumber(summary.vehicles_data.length)} vehicle(s)</span>
          </div>

          <div className="mb-4 rounded-md border border-slate-800 bg-[#101318] p-3 text-sm text-slate-400">
            Operational Cost reflects the backend-reported maintenance and fuel totals for each vehicle, while ROI is derived from the live report formula.
          </div>

          <DataTable columns={columns} rows={summary.vehicles_data} emptyMessage="No fleet data is available for analytics yet." />
        </>
      )}
    </section>
  );
}
