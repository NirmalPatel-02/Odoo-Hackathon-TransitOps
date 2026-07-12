import { useEffect, useMemo, useState } from "react";
import DataTable from "../../components/common/DataTable";
import FilterSelect from "../../components/common/FilterSelect";
import Modal from "../../components/common/Modal";
import StatusBadge from "../../components/common/StatusBadge";
import { useAuth } from "../../context/AuthContext";
import { canEdit } from "../../constants/permissions";
import { formatCurrency, formatNumber } from "../../utils/formatters";
// import { listVehicles, createVehicle, updateVehicle, deleteVehicle } from "../../api/endpoints/vehicles";

const VEHICLE_TYPES = ["Van", "Truck", "Mini"];
const VEHICLE_STATUSES = ["Available", "On Trip", "In Shop", "Retired"];

// Mock data matching GET /api/v1/vehicles until the backend is wired up.
const MOCK_VEHICLES = [
  { id: 1, regNo: "GJ01AB4521", name: "VAN-05", type: "Van", capacityKg: 500, odometer: 74000, acquisitionCost: 620000, status: "Available" },
  { id: 2, regNo: "GJ01AB9981", name: "TRUCK-11", type: "Truck", capacityKg: 5000, odometer: 182000, acquisitionCost: 2450000, status: "On Trip" },
  { id: 3, regNo: "GJ01AB1120", name: "MINI-03", type: "Mini", capacityKg: 1000, odometer: 66000, acquisitionCost: 410000, status: "In Shop" },
  { id: 4, regNo: "GJ01AB0089", name: "VAN-09", type: "Van", capacityKg: 750, odometer: 241900, acquisitionCost: 590000, status: "Retired" },
];

const EMPTY_FORM = {
  regNo: "",
  name: "",
  type: "Van",
  capacityKg: "",
  odometer: "",
  acquisitionCost: "",
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

  useEffect(() => {
    // listVehicles().then((res) => setVehicles(res.data));
    setVehicles(MOCK_VEHICLES);
  }, []);

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      const matchesType = typeFilter === "All" || v.type === typeFilter;
      const matchesStatus = statusFilter === "All" || v.status === statusFilter;
      const matchesSearch =
        !search.trim() ||
        v.regNo.toLowerCase().includes(search.trim().toLowerCase());
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
      regNo: vehicle.regNo,
      name: vehicle.name,
      type: vehicle.type,
      capacityKg: vehicle.capacityKg,
      odometer: vehicle.odometer,
      acquisitionCost: vehicle.acquisitionCost,
      status: vehicle.status,
    });
    setFormError("");
    setModalOpen(true);
  };

  const handleDelete = (vehicle) => {
    // deleteVehicle(vehicle.id).then(() => ...)
    setVehicles((prev) => prev.filter((v) => v.id !== vehicle.id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!form.regNo.trim() || !form.name.trim()) {
      setFormError("Registration number and name/model are required.");
      return;
    }

    // Mandatory business rule: registration number must be unique.
    const duplicate = vehicles.some(
      (v) =>
        v.regNo.toLowerCase() === form.regNo.trim().toLowerCase() &&
        v.id !== editingId
    );
    if (duplicate) {
      setFormError("This registration number is already registered.");
      return;
    }

    const capacity = Number(form.capacityKg);
    if (!capacity || capacity <= 0) {
      setFormError("Maximum load capacity must be greater than 0.");
      return;
    }

    const payload = {
      ...form,
      regNo: form.regNo.trim(),
      capacityKg: capacity,
      odometer: Number(form.odometer) || 0,
      acquisitionCost: Number(form.acquisitionCost) || 0,
    };

    if (editingId) {
      // await updateVehicle(editingId, payload);
      setVehicles((prev) =>
        prev.map((v) => (v.id === editingId ? { ...v, ...payload } : v))
      );
    } else {
      // const { data } = await createVehicle(payload);
      setVehicles((prev) => [...prev, { id: Date.now(), ...payload }]);
    }

    setModalOpen(false);
  };

  const columns = [
    { key: "regNo", label: "Reg. No. (Unique)" },
    { key: "name", label: "Name/Model" },
    { key: "type", label: "Type" },
    { key: "capacityKg", label: "Capacity", render: (r) => `${formatNumber(r.capacityKg)} kg` },
    { key: "odometer", label: "Odometer", render: (r) => formatNumber(r.odometer) },
    { key: "acquisitionCost", label: "Acq. Cost", render: (r) => formatCurrency(r.acquisitionCost) },
    { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
    ...(editable
      ? [
          {
            key: "actions",
            label: "",
            render: (r) => (
              <div className="flex gap-3 text-xs">
                <button
                  type="button"
                  onClick={() => openEditModal(r)}
                  className="text-sky-400 hover:text-sky-300"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(r)}
                  className="text-rose-400 hover:text-rose-300"
                >
                  Delete
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
              ...VEHICLE_TYPES.map((t) => ({ value: t, label: t })),
            ]}
          />
          <FilterSelect
            value={statusFilter}
            onChange={setStatusFilter}
            prefixLabel="Status"
            options={[
              { value: "All", label: "All" },
              ...VEHICLE_STATUSES.map((s) => ({ value: s, label: s })),
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
          <button
            type="button"
            onClick={openAddModal}
            className="rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-amber-500"
          >
            + Add Vehicle
          </button>
        )}
      </div>

      <DataTable columns={columns} rows={filteredVehicles} emptyMessage="No vehicles match these filters." />

      <p className="mt-3 text-xs text-amber-500/80">
        Rule: Registration No. must be unique. Retired/In Shop vehicles are hidden from the Trip Dispatcher.
      </p>

      {modalOpen && (
        <Modal title={editingId ? "Edit Vehicle" : "Add Vehicle"} onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-3">
            {formError && (
              <p className="rounded-md border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-xs text-rose-400">
                {formError}
              </p>
            )}

            <div>
              <label className="mb-1 block text-xs text-slate-500">Registration Number</label>
              <input
                className={fieldClasses}
                value={form.regNo}
                onChange={(e) => setForm({ ...form, regNo: e.target.value })}
                disabled={!!editingId}
              />
            </div>

            <div>
              <label className="mb-1 block text-xs text-slate-500">Vehicle Name/Model</label>
              <input
                className={fieldClasses}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs text-slate-500">Type</label>
                <select
                  className={fieldClasses}
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                >
                  {VEHICLE_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-500">Max Capacity (kg)</label>
                <input
                  type="number"
                  min="1"
                  className={fieldClasses}
                  value={form.capacityKg}
                  onChange={(e) => setForm({ ...form, capacityKg: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs text-slate-500">Odometer</label>
                <input
                  type="number"
                  min="0"
                  className={fieldClasses}
                  value={form.odometer}
                  onChange={(e) => setForm({ ...form, odometer: e.target.value })}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-500">Acquisition Cost</label>
                <input
                  type="number"
                  min="0"
                  className={fieldClasses}
                  value={form.acquisitionCost}
                  onChange={(e) => setForm({ ...form, acquisitionCost: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs text-slate-500">Status</label>
              <select
                className={fieldClasses}
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                {VEHICLE_STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full rounded-md bg-amber-600 py-2.5 text-sm font-medium text-slate-950 hover:bg-amber-500"
            >
              {editingId ? "Save changes" : "Add vehicle"}
            </button>
          </form>
        </Modal>
      )}
    </>
  );
}