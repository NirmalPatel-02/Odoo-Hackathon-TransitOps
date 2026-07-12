import { useEffect, useMemo, useState } from "react";
import DataTable from "../../components/common/DataTable";
import FilterSelect from "../../components/common/FilterSelect";
import Modal from "../../components/common/Modal";
import StatusBadge from "../../components/common/StatusBadge";
import { useAuth } from "../../context/AuthContext";
import { canEdit } from "../../constants/permissions";
import { formatCurrency, formatDate } from "../../utils/formatters";
import { closeMaintenanceLog, createMaintenanceLog, listMaintenanceLogs } from "../../api/endpoints/maintenance";
import { listVehicles } from "../../api/endpoints/vehicles";

const MAINTENANCE_STATUSES = ["Open", "Closed"];

const EMPTY_FORM = {
  vehicle_id: "",
  issue_description: "",
  start_date: "",
};

const fieldClasses =
  "w-full rounded-md border border-slate-800 bg-[#0b0d10] px-3 py-2 text-sm text-slate-200 focus:border-amber-600/60 focus:outline-none";

export default function MaintenancePage() {
  const { user } = useAuth();
  const editable = canEdit(user?.role_name, "maintenance");

  const [logs, setLogs] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [logsRes, vehiclesRes] = await Promise.all([listMaintenanceLogs(), listVehicles()]);
      setLogs(logsRes.data);
      setVehicles(vehiclesRes.data);
    } catch (error) {
      setFormError(error.response?.data?.detail || "Unable to load maintenance logs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesStatus = statusFilter === "All" || log.status === statusFilter;
      const matchesSearch = !search.trim() || log.issue_description.toLowerCase().includes(search.trim().toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [logs, statusFilter, search]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!form.vehicle_id || !form.issue_description.trim() || !form.start_date) {
      setFormError("Vehicle, issue description, and start date are required.");
      return;
    }

    try {
      const { data } = await createMaintenanceLog({
        vehicle_id: Number(form.vehicle_id),
        issue_description: form.issue_description.trim(),
        start_date: form.start_date,
      });
      setLogs((prev) => [data, ...prev]);
      setModalOpen(false);
      setForm(EMPTY_FORM);
    } catch (error) {
      setFormError(error.response?.data?.detail || "Unable to create maintenance log.");
    }
  };

  const handleClose = async (logId) => {
    try {
      const { data } = await closeMaintenanceLog(logId, { cost: 0, end_date: new Date().toISOString().slice(0, 10) });
      setLogs((prev) => prev.map((log) => (log.id === logId ? data : log)));
    } catch (error) {
      setFormError(error.response?.data?.detail || "Unable to close maintenance log.");
    }
  };

  const columns = [
    { key: "issue_description", label: "Issue" },
    { key: "start_date", label: "Start Date", render: (row) => formatDate(row.start_date) },
    { key: "end_date", label: "End Date", render: (row) => formatDate(row.end_date) },
    { key: "cost", label: "Cost", render: (row) => formatCurrency(row.cost) },
    { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
    {
      key: "actions",
      label: "",
      render: (row) => (
        editable ? (
          row.status === "Open" ? <button type="button" onClick={() => handleClose(row.id)} className="text-emerald-400 hover:text-emerald-300">Close</button> : <span className="text-slate-500">Closed</span>
        ) : <span className="text-slate-500">View only</span>
      ),
    },
  ];

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <FilterSelect value={statusFilter} onChange={setStatusFilter} prefixLabel="Status" options={[{ value: "All", label: "All" }, ...MAINTENANCE_STATUSES.map((status) => ({ value: status, label: status }))]} />
          <input type="text" placeholder="Search issue..." value={search} onChange={(e) => setSearch(e.target.value)} className="rounded-md border border-slate-800 bg-[#101318] px-3 py-2 text-sm text-slate-300 placeholder:text-slate-600 focus:border-amber-600/60 focus:outline-none" />
        </div>

        {editable && (
          <button type="button" onClick={() => setModalOpen(true)} className="rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-amber-500">
            + New Maintenance Log
          </button>
        )}
      </div>

      {loading ? <p className="text-sm text-slate-500">Loading maintenance logs…</p> : <DataTable columns={columns} rows={filteredLogs} emptyMessage="No maintenance logs found." />}

      {modalOpen && (
        <Modal title="Create Maintenance Log" onClose={() => setModalOpen(false)}>
          <form onSubmit={handleCreate} className="space-y-3">
            {formError && <p className="rounded-md border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-xs text-rose-400">{formError}</p>}

            <div>
              <label className="mb-1 block text-xs text-slate-500">Vehicle</label>
              <select className={fieldClasses} value={form.vehicle_id} onChange={(e) => setForm({ ...form, vehicle_id: e.target.value })}>
                <option value="">Select vehicle</option>
                {vehicles.map((vehicle) => <option key={vehicle.id} value={vehicle.id}>{vehicle.registration_number} — {vehicle.model}</option>)}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs text-slate-500">Issue Description</label>
              <textarea className={fieldClasses} rows="3" value={form.issue_description} onChange={(e) => setForm({ ...form, issue_description: e.target.value })} />
            </div>

            <div>
              <label className="mb-1 block text-xs text-slate-500">Start Date</label>
              <input type="date" className={fieldClasses} value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
            </div>

            <button type="submit" className="w-full rounded-md bg-amber-600 py-2.5 text-sm font-medium text-slate-950 hover:bg-amber-500">Create log</button>
          </form>
        </Modal>
      )}
    </>
  );
}
