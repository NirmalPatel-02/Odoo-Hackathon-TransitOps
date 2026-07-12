import { useEffect, useMemo, useState } from "react";
import DataTable from "../../components/common/DataTable";
import FilterSelect from "../../components/common/FilterSelect";
import Modal from "../../components/common/Modal";
import StatusBadge from "../../components/common/StatusBadge";
import { useAuth } from "../../context/AuthContext";
import { canEdit } from "../../constants/permissions";
import { formatDate } from "../../utils/formatters";
import { createDriver, listDrivers, updateDriver } from "../../api/endpoints/drivers";

const DRIVER_STATUSES = ["Available", "On Trip", "Off Duty", "Suspended"];
const DRIVER_LICENSE_CATEGORIES = ["A", "B", "C", "D", "E"];

const EMPTY_FORM = {
  name: "",
  license_number: "",
  license_category: "B",
  license_expiry_date: "",
  contact_number: "",
  safety_score: "",
  status: "Available",
};

const fieldClasses =
  "w-full rounded-md border border-slate-800 bg-[#0b0d10] px-3 py-2 text-sm text-slate-200 focus:border-amber-600/60 focus:outline-none";

export default function DriverManagementPage() {
  const { user } = useAuth();
  const editable = canEdit(user?.role_name, "drivers");

  const [drivers, setDrivers] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchDrivers = async () => {
    setLoading(true);
    try {
      const { data } = await listDrivers();
      setDrivers(data);
    } catch (error) {
      setFormError(error.response?.data?.detail || "Unable to load drivers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const filteredDrivers = useMemo(() => {
    return drivers.filter((driver) => {
      const matchesStatus = statusFilter === "All" || driver.status === statusFilter;
      const matchesSearch =
        !search.trim() ||
        driver.name.toLowerCase().includes(search.trim().toLowerCase()) ||
        driver.license_number.toLowerCase().includes(search.trim().toLowerCase());

      return matchesStatus && matchesSearch;
    });
  }, [drivers, search, statusFilter]);

  const openAddModal = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setModalOpen(true);
  };

  const openEditModal = (driver) => {
    setEditingId(driver.id);
    setForm({
      name: driver.name,
      license_number: driver.license_number,
      license_category: driver.license_category,
      license_expiry_date: driver.license_expiry_date,
      contact_number: driver.contact_number,
      safety_score: driver.safety_score,
      status: driver.status,
    });
    setFormError("");
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!form.name.trim() || !form.license_number.trim()) {
      setFormError("Name and license number are required.");
      return;
    }

    const safetyScore = Number(form.safety_score);
    if (!safetyScore || safetyScore < 0 || safetyScore > 100) {
      setFormError("Safety score must be between 0 and 100.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      license_number: form.license_number.trim().toUpperCase(),
      license_category: form.license_category,
      license_expiry_date: form.license_expiry_date,
      contact_number: form.contact_number,
      safety_score: safetyScore,
      status: form.status,
    };

    try {
      if (editingId) {
        const { data } = await updateDriver(editingId, payload);
        setDrivers((prev) => prev.map((driver) => (driver.id === editingId ? data : driver)));
      } else {
        const { data } = await createDriver(payload);
        setDrivers((prev) => [data, ...prev]);
      }
      setModalOpen(false);
    } catch (error) {
      setFormError(error.response?.data?.detail || "Unable to save driver.");
    }
  };

  const columns = [
    { key: "name", label: "Name" },
    { key: "license_number", label: "License No." },
    { key: "license_category", label: "License Category" },
    { key: "license_expiry_date", label: "Expiry Date", render: (row) => formatDate(row.license_expiry_date) },
    { key: "contact_number", label: "Contact" },
    { key: "safety_score", label: "Safety Score", render: (row) => `${row.safety_score}/100` },
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
          <FilterSelect value={statusFilter} onChange={setStatusFilter} prefixLabel="Status" options={[{ value: "All", label: "All" }, ...DRIVER_STATUSES.map((status) => ({ value: status, label: status }))]} />
          <input type="text" placeholder="Search by name or license..." value={search} onChange={(e) => setSearch(e.target.value)} className="rounded-md border border-slate-800 bg-[#101318] px-3 py-2 text-sm text-slate-300 placeholder:text-slate-600 focus:border-amber-600/60 focus:outline-none" />
        </div>

        {editable && (
          <button type="button" onClick={openAddModal} className="rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-amber-500">
            + Add Driver
          </button>
        )}
      </div>

      {loading ? <p className="text-sm text-slate-500">Loading drivers…</p> : <DataTable columns={columns} rows={filteredDrivers} emptyMessage="No drivers match these filters." />}

      {modalOpen && (
        <Modal title={editingId ? "Edit Driver" : "Add Driver"} onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-3">
            {formError && <p className="rounded-md border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-xs text-rose-400">{formError}</p>}

            <div>
              <label className="mb-1 block text-xs text-slate-500">Driver Name</label>
              <input className={fieldClasses} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs text-slate-500">License Number</label>
                <input className={fieldClasses} value={form.license_number} onChange={(e) => setForm({ ...form, license_number: e.target.value })} />
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-500">License Category</label>
                <select className={fieldClasses} value={form.license_category} onChange={(e) => setForm({ ...form, license_category: e.target.value })}>
                  {DRIVER_LICENSE_CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs text-slate-500">License Expiry Date</label>
                <input type="date" className={fieldClasses} value={form.license_expiry_date} onChange={(e) => setForm({ ...form, license_expiry_date: e.target.value })} />
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-500">Contact Number</label>
                <input className={fieldClasses} value={form.contact_number} onChange={(e) => setForm({ ...form, contact_number: e.target.value })} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs text-slate-500">Safety Score</label>
                <input type="number" min="0" max="100" className={fieldClasses} value={form.safety_score} onChange={(e) => setForm({ ...form, safety_score: e.target.value })} />
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-500">Status</label>
                <select className={fieldClasses} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  {DRIVER_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
                </select>
              </div>
            </div>

            <button type="submit" className="w-full rounded-md bg-amber-600 py-2.5 text-sm font-medium text-slate-950 hover:bg-amber-500">
              {editingId ? "Save changes" : "Add driver"}
            </button>
          </form>
        </Modal>
      )}
    </>
  );
}
