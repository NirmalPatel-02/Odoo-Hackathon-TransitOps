import { useEffect, useMemo, useState } from "react";
import DataTable from "../../components/common/DataTable";
import FilterSelect from "../../components/common/FilterSelect";
import Modal from "../../components/common/Modal";
import StatusBadge from "../../components/common/StatusBadge";
import { useAuth } from "../../context/AuthContext";
import { canEdit } from "../../constants/permissions";
import { formatCurrency, formatDate } from "../../utils/formatters";
import { createExpense, listExpenses } from "../../api/endpoints/fuelExpenses";

const EXPENSE_TYPES = ["Fuel", "Maintenance", "Insurance", "Other"];
const EXPENSE_STATUSES = ["Pending", "Approved", "Rejected"];

const EMPTY_FORM = {
  type: "Fuel",
  amount: "",
  description: "",
  expense_date: "",
  status: "Pending",
};

const fieldClasses =
  "w-full rounded-md border border-slate-800 bg-[#0b0d10] px-3 py-2 text-sm text-slate-200 focus:border-amber-600/60 focus:outline-none";

export default function FuelExpensePage() {
  const { user } = useAuth();
  const editable = canEdit(user?.role_name, "fuel_expenses");

  const [expenses, setExpenses] = useState([]);
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const { data } = await listExpenses();
      setExpenses(data);
    } catch (error) {
      setFormError(error.response?.data?.detail || "Unable to load expenses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const matchesType = typeFilter === "All" || expense.type === typeFilter;
      const matchesStatus = statusFilter === "All" || expense.status === statusFilter;
      const matchesSearch = !search.trim() || expense.description.toLowerCase().includes(search.trim().toLowerCase());
      return matchesType && matchesStatus && matchesSearch;
    });
  }, [expenses, typeFilter, statusFilter, search]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!form.description.trim() || !form.amount || !form.expense_date) {
      setFormError("Description, amount, and date are required.");
      return;
    }

    try {
      const { data } = await createExpense({
        type: form.type,
        amount: Number(form.amount),
        description: form.description.trim(),
        expense_date: form.expense_date,
        status: form.status,
      });
      setExpenses((prev) => [data, ...prev]);
      setModalOpen(false);
      setForm(EMPTY_FORM);
    } catch (error) {
      setFormError(error.response?.data?.detail || "Unable to save expense.");
    }
  };

  const columns = [
    { key: "description", label: "Description" },
    { key: "type", label: "Type" },
    { key: "expense_date", label: "Date", render: (row) => formatDate(row.expense_date) },
    { key: "amount", label: "Amount", render: (row) => formatCurrency(row.amount) },
    { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
  ];

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <FilterSelect value={typeFilter} onChange={setTypeFilter} prefixLabel="Type" options={[{ value: "All", label: "All" }, ...EXPENSE_TYPES.map((type) => ({ value: type, label: type }))]} />
          <FilterSelect value={statusFilter} onChange={setStatusFilter} prefixLabel="Status" options={[{ value: "All", label: "All" }, ...EXPENSE_STATUSES.map((status) => ({ value: status, label: status }))]} />
          <input type="text" placeholder="Search description..." value={search} onChange={(e) => setSearch(e.target.value)} className="rounded-md border border-slate-800 bg-[#101318] px-3 py-2 text-sm text-slate-300 placeholder:text-slate-600 focus:border-amber-600/60 focus:outline-none" />
        </div>

        {editable && (
          <button type="button" onClick={() => setModalOpen(true)} className="rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-amber-500">
            + Add Expense
          </button>
        )}
      </div>

      {loading ? <p className="text-sm text-slate-500">Loading expenses…</p> : <DataTable columns={columns} rows={filteredExpenses} emptyMessage="No expenses found." />}

      {modalOpen && (
        <Modal title="Add Expense" onClose={() => setModalOpen(false)}>
          <form onSubmit={handleCreate} className="space-y-3">
            {formError && <p className="rounded-md border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-xs text-rose-400">{formError}</p>}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs text-slate-500">Type</label>
                <select className={fieldClasses} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                  {EXPENSE_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-500">Amount</label>
                <input type="number" min="0" step="0.01" className={fieldClasses} value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs text-slate-500">Description</label>
              <textarea className={fieldClasses} rows="3" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs text-slate-500">Date</label>
                <input type="date" className={fieldClasses} value={form.expense_date} onChange={(e) => setForm({ ...form, expense_date: e.target.value })} />
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-500">Status</label>
                <select className={fieldClasses} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  {EXPENSE_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
                </select>
              </div>
            </div>

            <button type="submit" className="w-full rounded-md bg-amber-600 py-2.5 text-sm font-medium text-slate-950 hover:bg-amber-500">Save expense</button>
          </form>
        </Modal>
      )}
    </>
  );
}
