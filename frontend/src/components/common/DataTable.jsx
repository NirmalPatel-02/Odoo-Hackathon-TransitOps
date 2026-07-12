// Generic table: columns = [{ key, label, render? }], rows = array of objects.
// `render(row)` overrides plain `row[key]` rendering (e.g. status badges, actions).

export default function DataTable({ columns, rows, emptyMessage = "No records found." }) {
  return (
    <div className="overflow-x-auto rounded-md border border-slate-800 bg-[#101318]">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="text-[11px] uppercase tracking-wide text-slate-500">
            {columns.map((col) => (
              <th key={col.key} className="whitespace-nowrap px-4 py-2 font-medium">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.id ?? i} className="border-t border-slate-800/70">
              {columns.map((col) => (
                <td key={col.key} className="whitespace-nowrap px-4 py-3 text-slate-300">
                  {col.render ? col.render(row) : row[col.key] ?? "—"}
                </td>
              ))}
            </tr>
          ))}

          {rows.length === 0 && (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-6 text-center text-slate-600"
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}