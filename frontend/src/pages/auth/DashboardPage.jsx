import { useEffect, useState } from "react";
import FilterBar from "../../components/dashboard/FilterBar";
import KPICard from "../../components/dashboard/KPICard";
import RecentTripsTable from "../../components/dashboard/RecentTripsTable";
import VehicleStatusPanel from "../../components/dashboard/VehicleStatusPanel";
// import { getDashboardSummary } from "../api/endpoints/dashboard";

// Mock shape matches what GET /api/v1/dashboard/summary should return.
// Swap this out for the real call once the backend endpoint is ready.
const MOCK_SUMMARY = {
  kpis: {
    activeVehicles: 53,
    availableVehicles: 42,
    vehiclesInMaintenance: 5,
    activeTrips: 18,
    pendingTrips: 9,
    driversOnDuty: 26,
    fleetUtilization: 81,
  },
  recentTrips: [
    { id: "TR001", vehicle: "VAN-05", driver: "Alex", status: "On Trip", eta: "45 min" },
    { id: "TR002", vehicle: "TRK-12", driver: "John", status: "Completed", eta: "—" },
    { id: "TR003", vehicle: "MINI-08", driver: "Priya", status: "Dispatched", eta: "1h 10m" },
    { id: "TR004", vehicle: null, driver: null, status: "Draft", eta: "Awaiting vehicle" },
  ],
  vehicleStatusBreakdown: {
    Available: 42,
    "On Trip": 22,
    "In Shop": 5,
    Retired: 3,
  },
};

export default function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [filters, setFilters] = useState({
    vehicleType: "All",
    status: "All",
    region: "All",
  });

  useEffect(() => {
    // getDashboardSummary(filters).then(setSummary);
    setSummary(MOCK_SUMMARY);
  }, [filters]);

  if (!summary) {
    return <p className="text-sm text-slate-500">Loading dashboard…</p>;
  }

  const { kpis, recentTrips, vehicleStatusBreakdown } = summary;

  return (
    <>
      <FilterBar filters={filters} onChange={setFilters} />

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
        <KPICard label="Active Vehicles" value={kpis.activeVehicles} accent="neutral" />
        <KPICard label="Available Vehicles" value={kpis.availableVehicles} accent="emerald" />
        <KPICard label="Vehicles in Maintenance" value={kpis.vehiclesInMaintenance} accent="amber" />
        <KPICard label="Active Trips" value={kpis.activeTrips} accent="sky" />
        <KPICard label="Pending Trips" value={kpis.pendingTrips} accent="neutral" />
        <KPICard label="Drivers On Duty" value={kpis.driversOnDuty} accent="sky" />
        <KPICard label="Fleet Utilization" value={`${kpis.fleetUtilization}%`} accent="emerald" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentTripsTable trips={recentTrips} />
        </div>
        <VehicleStatusPanel breakdown={vehicleStatusBreakdown} />
      </div>
    </>
  );
}