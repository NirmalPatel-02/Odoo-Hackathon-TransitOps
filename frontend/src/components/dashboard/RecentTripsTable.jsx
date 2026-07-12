import StatusBadge from "../common/StatusBadge";

export default function RecentTripsTable({ trips }) {
  return (
    <div className="rounded-md border border-slate-800 bg-[#101318]">
      <div className="border-b border-slate-800 px-4 py-3">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Recent Trips
        </h2>
      </div>

      <table className="w-full text-left text-sm">
        <thead>
          <tr className="text-[11px] uppercase tracking-wide text-slate-500">
            <th className="px-4 py-2 font-medium">Trip</th>
            <th className="px-4 py-2 font-medium">Vehicle</th>
            <th className="px-4 py-2 font-medium">Driver</th>
            <th className="px-4 py-2 font-medium">Status</th>
            <th className="px-4 py-2 font-medium">ETA</th>
          </tr>
        </thead>
        <tbody>
          {trips.map((trip) => (
            <tr key={trip.id} className="border-t border-slate-800/70">
              <td className="px-4 py-3 text-slate-300">{trip.id}</td>
              <td className="px-4 py-3 text-slate-300">
                {trip.vehicle || "—"}
              </td>
              <td className="px-4 py-3 text-slate-300">
                {trip.driver || "—"}
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={trip.status} />
              </td>
              <td className="px-4 py-3 text-slate-500">{trip.eta}</td>
            </tr>
          ))}

          {trips.length === 0 && (
            <tr>
              <td colSpan={5} className="px-4 py-6 text-center text-slate-600">
                No trips yet today.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}