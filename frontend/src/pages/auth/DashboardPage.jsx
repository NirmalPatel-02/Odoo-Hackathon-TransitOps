import { useEffect, useMemo, useState } from "react";
import FilterBar from "../../components/dashboard/FilterBar";
import KPICard from "../../components/dashboard/KPICard";
import RecentTripsTable from "../../components/dashboard/RecentTripsTable";
import VehicleStatusPanel from "../../components/dashboard/VehicleStatusPanel";
import { listVehicles } from "../../api/endpoints/vehicles";
import { listDrivers } from "../../api/endpoints/drivers";
import { listTrips } from "../../api/endpoints/trips";
import { listMaintenanceLogs } from "../../api/endpoints/maintenance";
import { formatCurrency, formatNumber } from "../../utils/formatters";

export default function DashboardPage() {
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [trips, setTrips] = useState([]);
  const [maintenanceLogs, setMaintenanceLogs] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    vehicleType: "All",
    status: "All",
    region: "All",
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError("");
      try {
        const [vehiclesRes, driversRes, tripsRes, maintenanceRes] = await Promise.all([
          listVehicles(),
          listDrivers(),
          listTrips(),
          listMaintenanceLogs(),
        ]);

        setVehicles(vehiclesRes.data);
        setDrivers(driversRes.data);
        setTrips(tripsRes.data);
        setMaintenanceLogs(maintenanceRes.data);
      } catch (requestError) {
        setError(requestError.response?.data?.detail || "Unable to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const summary = useMemo(() => {
    const activeVehicles = vehicles.filter((vehicle) => vehicle.status === "On Trip").length;
    const availableVehicles = vehicles.filter((vehicle) => vehicle.status === "Available").length;
    const vehiclesInMaintenance = vehicles.filter((vehicle) => vehicle.status === "In Shop").length;
    const activeTrips = trips.filter((trip) => trip.status === "Dispatched").length;
    const pendingTrips = trips.filter((trip) => trip.status === "Draft").length;
    const driversOnDuty = drivers.filter((driver) => driver.status === "Available" || driver.status === "On Trip").length;
    const fleetUtilization = vehicles.length ? Math.round((activeVehicles / vehicles.length) * 100) : 0;

    const filteredTrips = trips.filter((trip) => {
      const matchesStatus = filters.status === "All" || trip.status === filters.status;
      const matchesVehicleType = filters.vehicleType === "All" || vehicles.find((vehicle) => vehicle.id === trip.vehicle_id)?.type === filters.vehicleType;
      return matchesStatus && matchesVehicleType;
    });

    const vehicleStatusBreakdown = vehicles.reduce((acc, vehicle) => {
      acc[vehicle.status] = (acc[vehicle.status] || 0) + 1;
      return acc;
    }, {});

    return {
      kpis: {
        activeVehicles,
        availableVehicles,
        vehiclesInMaintenance,
        activeTrips,
        pendingTrips,
        driversOnDuty,
        fleetUtilization,
      },
      recentTrips: filteredTrips.slice(0, 6).map((trip) => ({
        id: `TR-${trip.id}`,
        vehicle: vehicles.find((vehicle) => vehicle.id === trip.vehicle_id)?.registration_number || "—",
        driver: drivers.find((driver) => driver.id === trip.driver_id)?.name || "—",
        status: trip.status,
        eta: trip.status === "Completed" ? "Completed" : trip.status === "Dispatched" ? "En route" : "Queued",
      })),
      vehicleStatusBreakdown,
      maintenanceLogs,
    };
  }, [vehicles, drivers, trips, maintenanceLogs, filters]);

  if (loading) {
    return <p className="text-sm text-slate-500">Loading dashboard…</p>;
  }

  const { kpis, recentTrips, vehicleStatusBreakdown, maintenanceLogs: maintenanceItems } = summary;

  return (
    <>
      {error && (
        <div className="mb-4 rounded-md border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">{error}</div>
      )}

      <FilterBar filters={filters} onChange={setFilters} />

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
        <KPICard label="Active Vehicles" value={formatNumber(kpis.activeVehicles)} accent="neutral" />
        <KPICard label="Available Vehicles" value={formatNumber(kpis.availableVehicles)} accent="emerald" />
        <KPICard label="Vehicles in Maintenance" value={formatNumber(kpis.vehiclesInMaintenance)} accent="amber" />
        <KPICard label="Active Trips" value={formatNumber(kpis.activeTrips)} accent="sky" />
        <KPICard label="Pending Trips" value={formatNumber(kpis.pendingTrips)} accent="neutral" />
        <KPICard label="Drivers On Duty" value={formatNumber(kpis.driversOnDuty)} accent="sky" />
        <KPICard label="Fleet Utilization" value={`${kpis.fleetUtilization}%`} accent="emerald" />
      </div>

      <div className="mb-4 grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentTripsTable trips={recentTrips} />
        </div>
        <VehicleStatusPanel breakdown={vehicleStatusBreakdown} />
      </div>

      <div className="rounded-md border border-slate-800 bg-[#101318] p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-200">Open Maintenance Requests</h2>
          <span className="text-xs text-slate-500">{maintenanceItems.filter((item) => item.status === "Open").length} active</span>
        </div>
        <div className="space-y-2 text-sm text-slate-400">
          {maintenanceItems.length === 0 ? (
            <p className="text-slate-500">No maintenance records found.</p>
          ) : (
            maintenanceItems.slice(0, 4).map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-md border border-slate-800 px-3 py-2">
                <span>{item.issue_description}</span>
                <span className="text-slate-500">{formatCurrency(item.cost || 0)}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}