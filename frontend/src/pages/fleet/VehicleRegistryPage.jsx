import { useEffect, useMemo, useState } from "react";
import DataTable from "../../components/common/DataTable";
import FilterSelect from "../../components/common/FilterSelect";
import Modal from "../../components/common/Modal";
import StatusBadge from "../../components/common/StatusBadge";
import { useAuth } from "../../context/AuthContext";
import { canEdit } from "../../constants/permissions";
import { formatCurrency, formatNumber } from "../../utils/formatters";
import { createVehicle, listVehicles, updateVehicle } from "../../api/endpoints/vehicles";

const VEHICLE_TYPES = ["Van", "Truck", "Mini"];
const VEHICLE_STATUSES = ["Available", "On Trip", "In Shop", "Retired"];

const EMPTY_FORM = {
  registration_number: "",
  model: "",
  type: "Van",
  max_load_capacity: "",
  odometer: "",
  acquisition_cost: "",
  status: "Available",
};

const fieldClasses =
  "w-full rounded-md border border-slate-800 bg-[#0b0d10] px-3 py-2 text-sm text-slate-200 focus:border-amber-600/60 focus:outline-none";

export default function VehicleRegistryPage() {
  const { user } = useAuth();
  const editable = canEdit(user?.role_name, "vehicles");

  const [vehicles, setVehicles] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const { data } = await listVehicles();
      setVehicles(data);
    } catch (error) {
      setFormError(error.response?.data?.detail || "Unable to load vehicles.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((vehicle) => {
      const matchesType = typeFilter === "All" || vehicle.type === typeFilter;
      const matchesStatus = statusFilter === "All" || vehicle.status === statusFilter;
      const matchesSearch =
        !search.trim() ||
        vehicle.registration_number.toLowerCase().includes(search.trim().toLowerCase());
      return matchesType && matchesStatus && matchesSearch;
    });
  }, [vehicles, typeFilter, statusFilter, search]);

  const openAddModal = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setModalOpen(true);
  };

  const openEditModal = (vehicle) => {
    setEditingId(vehicle.id);
    setForm({
      registration_number: vehicle.registration_number,
      model: vehicle.model,
      type: vehicle.type,
      max_load_capacity: vehicle.max_load_capacity,
      odometer: vehicle.odometer,
      acquisition_cost: vehicle.acquisition_cost,
      status: vehicle.status,
    });
    setFormError("");
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!form.registration_number.trim() || !form.model.trim()) {
      setFormError("Registration number and model are required.");
      return;
    }

    const payload = {
      registration_number: form.registration_number.trim().toUpperCase(),
      model: form.model.trim(),
      type: form.type,
      max_load_capacity: Number(form.max_load_capacity),
      odometer: Number(form.odometer) || 0,
      acquisition_cost: Number(form.acquisition_cost),
      status: form.status,
    };

    try {
      if (editingId) {
        const { data } = await updateVehicle(editingId, payload);
        setVehicles((prev) => prev.map((vehicle) => (vehicle.id === editingId ? data : vehicle)));
      } else {
        const { data } = await createVehicle(payload);
        setVehicles((prev) => [data, ...prev]);
      }
      setModalOpen(false);
    } catch (error) {
      setFormError(error.response?.data?.detail || "Unable to save vehicle.");
    }
  };

  const columns = [
    { key: "registration_number", label: "Reg. No. (Unique)" },
    { key: "model", label: "Name/Model" },
    { key: "type", label: "Type" },
    { key: "max_load_capacity", label: "Capacity", render: (row) => `${formatNumber(row.max_load_capacity)} kg` },
    { key: "odometer", label: "Odometer", render: (row) => formatNumber(row.odometer) },
    { key: "acquisition_cost", label: "Acq. Cost", render: (row) => formatCurrency(row.acquisition_cost) },
    { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
    ...(editable
      ? [
          {
            key: "actions",
            label: "",
            render: (row) => (
              <div className="flex gap-3 text-xs">
                <button type="button" onClick={() => openEditModal(row)} className="text-sky-400 hover:text-sky-300">
                  Edit
                </button>
              </div>
            ),
          },
        ]
      : []),
  ];

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <FilterSelect
            value={typeFilter}
            onChange={setTypeFilter}
            prefixLabel="Type"
            options={[
              { value: "All", label: "All" },
              ...VEHICLE_TYPES.map((type) => ({ value: type, label: type })),
            ]}
          />
          <FilterSelect
            value={statusFilter}
            onChange={setStatusFilter}
            prefixLabel="Status"
            options={[
              { value: "All", label: "All" },
              ...VEHICLE_STATUSES.map((status) => ({ value: status, label: status })),
            ]}
          />
          <input
            type="text"
            placeholder="Search reg. no..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-md border border-slate-800 bg-[#101318] px-3 py-2 text-sm text-slate-300 placeholder:text-slate-600 focus:border-amber-600/60 focus:outline-none"
          />
        </div>

        {editable && (
          <button type="button" onClick={openAddModal} className="rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-amber-500">
            + Add Vehicle
          </button>
        )}
      </div>

      {loading ? <p className="text-sm text-slate-500">Loading vehicles…</p> : <DataTable columns={columns} rows={filteredVehicles} emptyMessage="No vehicles match these filters." />}

      <p className="mt-3 text-xs text-amber-500/80">Registration numbers must be unique and vehicle status updates are managed by the backend workflow.</p>

      {modalOpen && (
        <Modal title={editingId ? "Edit Vehicle" : "Add Vehicle"} onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-3">
            {formError && (
              <p className="rounded-md border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-xs text-rose-400">{formError}</p>
            )}

            <div>
              <label className="mb-1 block text-xs text-slate-500">Registration Number</label>
              <input className={fieldClasses} value={form.registration_number} onChange={(e) => setForm({ ...form, registration_number: e.target.value })} disabled={!!editingId} />
            </div>

            <div>
              <label className="mb-1 block text-xs text-slate-500">Vehicle Name/Model</label>
              <input className={fieldClasses} value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs text-slate-500">Type</label>
                <select className={fieldClasses} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                  {VEHICLE_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-500">Max Capacity (kg)</label>
                <input type="number" min="1" className={fieldClasses} value={form.max_load_capacity} onChange={(e) => setForm({ ...form, max_load_capacity: e.target.value })} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs text-slate-500">Odometer</label>
                <input type="number" min="0" className={fieldClasses} value={form.odometer} onChange={(e) => setForm({ ...form, odometer: e.target.value })} />
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-500">Acquisition Cost</label>
                <input type="number" min="0" className={fieldClasses} value={form.acquisition_cost} onChange={(e) => setForm({ ...form, acquisition_cost: e.target.value })} />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs text-slate-500">Status</label>
              <select className={fieldClasses} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                {VEHICLE_STATUSES.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            <button type="submit" className="w-full rounded-md bg-amber-600 py-2.5 text-sm font-medium text-slate-950 hover:bg-amber-500">
              {editingId ? "Save changes" : "Add vehicle"}
            </button>
          </form>
        </Modal>
      )}
    </>
  );
}