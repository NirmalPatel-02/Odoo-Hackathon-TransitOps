import { useEffect, useMemo, useState } from "react";
import DataTable from "../../components/common/DataTable";
import FilterSelect from "../../components/common/FilterSelect";
import Modal from "../../components/common/Modal";
import StatusBadge from "../../components/common/StatusBadge";
import { useAuth } from "../../context/AuthContext";
import { canEdit } from "../../constants/permissions";
import { formatNumber } from "../../utils/formatters";
import { createTrip, listTrips, updateTripStatus } from "../../api/endpoints/trips";
import { listVehicles } from "../../api/endpoints/vehicles";
import { listDrivers } from "../../api/endpoints/drivers";

const TRIP_STATUSES = ["Draft", "Dispatched", "Completed", "Cancelled"];

const EMPTY_FORM = {
  source: "",
  destination: "",
  cargo_weight: "",
  planned_distance: "",
  vehicle_id: "",
  driver_id: "",
};

const fieldClasses =
  "w-full rounded-md border border-slate-800 bg-[#0b0d10] px-3 py-2 text-sm text-slate-200 focus:border-amber-600/60 focus:outline-none";

export default function TripManagementPage() {
  const { user } = useAuth();
  const editable = canEdit(user?.role_name, "trips");

  const [trips, setTrips] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [tripsRes, vehiclesRes, driversRes] = await Promise.all([
        listTrips(),
        listVehicles(),
        listDrivers(),
      ]);
      setTrips(tripsRes.data);
      setVehicles(vehiclesRes.data);
      setDrivers(driversRes.data);
    } catch (error) {
      setFormError(error.response?.data?.detail || "Unable to load trip data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredTrips = useMemo(() => {
    return trips.filter((trip) => {
      const matchesStatus = statusFilter === "All" || trip.status === statusFilter;
      const searchText = `${trip.source} ${trip.destination}`.toLowerCase();
      const matchesSearch = !search.trim() || searchText.includes(search.trim().toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [trips, statusFilter, search]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!form.source || !form.destination || !form.vehicle_id || !form.driver_id) {
      setFormError("Source, destination, vehicle, and driver are required.");
      return;
    }

    const payload = {
      source: form.source.trim(),
      destination: form.destination.trim(),
      cargo_weight: Number(form.cargo_weight),
      planned_distance: Number(form.planned_distance),
      vehicle_id: Number(form.vehicle_id),
      driver_id: Number(form.driver_id),
    };

    try {
      const { data } = await createTrip(payload);
      setTrips((prev) => [data, ...prev]);
      setModalOpen(false);
      setForm(EMPTY_FORM);
    } catch (error) {
      setFormError(error.response?.data?.detail || "Unable to create trip.");
    }
  };

  const handleStatusUpdate = async (tripId, nextStatus) => {
    try {
      const { data } = await updateTripStatus(tripId, nextStatus);
      setTrips((prev) => prev.map((trip) => (trip.id === tripId ? data : trip)));
    } catch (error) {
      setFormError(error.response?.data?.detail || "Unable to update trip status.");
    }
  };

  const columns = [
    { key: "source", label: "Source" },
    { key: "destination", label: "Destination" },
    { key: "cargo_weight", label: "Cargo", render: (row) => `${formatNumber(row.cargo_weight)} kg` },
    { key: "planned_distance", label: "Distance", render: (row) => `${formatNumber(row.planned_distance)} km` },
    { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
    {
      key: "actions",
      label: "",
      render: (row) => (
        <div className="flex flex-wrap gap-2 text-xs">
          {editable && (
            <>
              <button type="button" onClick={() => handleStatusUpdate(row.id, "Dispatched")} className="text-sky-400 hover:text-sky-300">Dispatch</button>
              <button type="button" onClick={() => handleStatusUpdate(row.id, "Completed")} className="text-emerald-400 hover:text-emerald-300">Complete</button>
              <button type="button" onClick={() => handleStatusUpdate(row.id, "Cancelled")} className="text-rose-400 hover:text-rose-300">Cancel</button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <FilterSelect value={statusFilter} onChange={setStatusFilter} prefixLabel="Status" options={[{ value: "All", label: "All" }, ...TRIP_STATUSES.map((status) => ({ value: status, label: status }))]} />
          <input type="text" placeholder="Search route..." value={search} onChange={(e) => setSearch(e.target.value)} className="rounded-md border border-slate-800 bg-[#101318] px-3 py-2 text-sm text-slate-300 placeholder:text-slate-600 focus:border-amber-600/60 focus:outline-none" />
        </div>

        {editable && (
          <button type="button" onClick={() => setModalOpen(true)} className="rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-amber-500">
            + Create Trip
          </button>
        )}
      </div>

      {loading ? <p className="text-sm text-slate-500">Loading trips…</p> : <DataTable columns={columns} rows={filteredTrips} emptyMessage="No trips found." />}

      {modalOpen && (
        <Modal title="Create Trip" onClose={() => setModalOpen(false)}>
          <form onSubmit={handleCreate} className="space-y-3">
            {formError && <p className="rounded-md border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-xs text-rose-400">{formError}</p>}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs text-slate-500">Source</label>
                <input className={fieldClasses} value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} />
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-500">Destination</label>
                <input className={fieldClasses} value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs text-slate-500">Cargo Weight (kg)</label>
                <input type="number" min="1" className={fieldClasses} value={form.cargo_weight} onChange={(e) => setForm({ ...form, cargo_weight: e.target.value })} />
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-500">Planned Distance (km)</label>
                <input type="number" min="1" className={fieldClasses} value={form.planned_distance} onChange={(e) => setForm({ ...form, planned_distance: e.target.value })} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs text-slate-500">Vehicle</label>
                <select className={fieldClasses} value={form.vehicle_id} onChange={(e) => setForm({ ...form, vehicle_id: e.target.value })}>
                  <option value="">Select vehicle</option>
                  {vehicles.map((vehicle) => <option key={vehicle.id} value={vehicle.id}>{vehicle.registration_number} — {vehicle.model}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-500">Driver</label>
                <select className={fieldClasses} value={form.driver_id} onChange={(e) => setForm({ ...form, driver_id: e.target.value })}>
                  <option value="">Select driver</option>
                  {drivers.map((driver) => <option key={driver.id} value={driver.id}>{driver.name}</option>)}
                </select>
              </div>
            </div>

            <button type="submit" className="w-full rounded-md bg-amber-600 py-2.5 text-sm font-medium text-slate-950 hover:bg-amber-500">Create trip</button>
          </form>
        </Modal>
      )}
    </>
  );
}
