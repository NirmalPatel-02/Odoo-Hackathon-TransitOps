import { useEffect, useMemo, useState } from "react";
import DataTable from "../../components/common/DataTable";
import FilterSelect from "../../components/common/FilterSelect";
import Modal from "../../components/common/Modal";
import StatusBadge from "../../components/common/StatusBadge";
import { useAuth } from "../../context/AuthContext";
import { canEdit } from "../../constants/permissions";

const DRIVER_STATUSES = ["Available", "On Trip", "Off Duty", "Suspended"];
const DRIVER_LICENSE_CATEGORIES = ["A", "B", "C", "D", "E"];

const MOCK_DRIVERS = [
  {
    id: 1,
    name: "Asha Rao",
    licenseNumber: "DL-2023001",
    licenseCategory: "D",
    licenseExpiryDate: "2027-06-15",
    contactNumber: "+91 98765 43210",
    safetyScore: 96,
    status: "Available",
  },
  {
    id: 2,
    name: "Rahul Menon",
    licenseNumber: "DL-2023002",
    licenseCategory: "C",
    licenseExpiryDate: "2026-11-10",
    contactNumber: "+91 91234 56789",
    safetyScore: 88,
    status: "On Trip",
  },
  {
    id: 3,
    name: "Nikhil Das",
    licenseNumber: "DL-2023003",
    licenseCategory: "B",
    licenseExpiryDate: "2028-01-19",
    contactNumber: "+91 99887 66554",
    safetyScore: 91,
    status: "Off Duty",
  },
];

const EMPTY_FORM = {
  name: "",
  licenseNumber: "",
  licenseCategory: "B",
  licenseExpiryDate: "",
  contactNumber: "",
  safetyScore: "",
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

  useEffect(() => {
    setDrivers(MOCK_DRIVERS);
  }, []);

  const filteredDrivers = useMemo(() => {
    return drivers.filter((driver) => {
      const matchesStatus = statusFilter === "All" || driver.status === statusFilter;
      const matchesSearch =
        !search.trim() ||
        driver.name.toLowerCase().includes(search.trim().toLowerCase()) ||
        driver.licenseNumber.toLowerCase().includes(search.trim().toLowerCase());

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
      licenseNumber: driver.licenseNumber,
      licenseCategory: driver.licenseCategory,
      licenseExpiryDate: driver.licenseExpiryDate,
      contactNumber: driver.contactNumber,
      safetyScore: driver.safetyScore,
      status: driver.status,
    });
    setFormError("");
    setModalOpen(true);
  };

  const handleDelete = (driver) => {
    setDrivers((prev) => prev.filter((item) => item.id !== driver.id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!form.name.trim() || !form.licenseNumber.trim()) {
      setFormError("Name and license number are required.");
      return;
    }

    const safetyScore = Number(form.safetyScore);
    if (!safetyScore || safetyScore < 0 || safetyScore > 100) {
      setFormError("Safety score must be between 0 and 100.");
      return;
    }

    const payload = {
      ...form,
      name: form.name.trim(),
      licenseNumber: form.licenseNumber.trim(),
      safetyScore,
    };

    if (editingId) {
      setDrivers((prev) => prev.map((driver) => (driver.id === editingId ? { ...driver, ...payload } : driver)));
    } else {
      setDrivers((prev) => [...prev, { id: Date.now(), ...payload }]);
    }

    setModalOpen(false);
  };

  const columns = [
    { key: "name", label: "Name" },
    { key: "licenseNumber", label: "License No." },
    { key: "licenseCategory", label: "License Category" },
    { key: "licenseExpiryDate", label: "Expiry Date" },
    { key: "contactNumber", label: "Contact" },
    { key: "safetyScore", label: "Safety Score", render: (row) => `${row.safetyScore}/100` },
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
                <button type="button" onClick={() => handleDelete(row)} className="text-rose-400 hover:text-rose-300">
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
            value={statusFilter}
            onChange={setStatusFilter}
            prefixLabel="Status"
            options={[
              { value: "All", label: "All" },
              ...DRIVER_STATUSES.map((status) => ({ value: status, label: status })),
            ]}
          />
          <input
            type="text"
            placeholder="Search by name or license..."
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
            + Add Driver
          </button>
        )}
      </div>

      <DataTable columns={columns} rows={filteredDrivers} emptyMessage="No drivers match these filters." />

      {modalOpen && (
        <Modal title={editingId ? "Edit Driver" : "Add Driver"} onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-3">
            {formError && (
              <p className="rounded-md border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-xs text-rose-400">
                {formError}
              </p>
            )}

            <div>
              <label className="mb-1 block text-xs text-slate-500">Driver Name</label>
              <input className={fieldClasses} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs text-slate-500">License Number</label>
                <input className={fieldClasses} value={form.licenseNumber} onChange={(e) => setForm({ ...form, licenseNumber: e.target.value })} />
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-500">License Category</label>
                <select className={fieldClasses} value={form.licenseCategory} onChange={(e) => setForm({ ...form, licenseCategory: e.target.value })}>
                  {DRIVER_LICENSE_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs text-slate-500">License Expiry Date</label>
                <input type="date" className={fieldClasses} value={form.licenseExpiryDate} onChange={(e) => setForm({ ...form, licenseExpiryDate: e.target.value })} />
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-500">Contact Number</label>
                <input className={fieldClasses} value={form.contactNumber} onChange={(e) => setForm({ ...form, contactNumber: e.target.value })} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs text-slate-500">Safety Score</label>
                <input type="number" min="0" max="100" className={fieldClasses} value={form.safetyScore} onChange={(e) => setForm({ ...form, safetyScore: e.target.value })} />
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-500">Status</label>
                <select className={fieldClasses} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  {DRIVER_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
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
