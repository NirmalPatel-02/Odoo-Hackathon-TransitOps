import { STATUS_STYLES, DEFAULT_STATUS_STYLE } from "../../constants/statusColors";

export default function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || DEFAULT_STATUS_STYLE;

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium whitespace-nowrap ${style}`}
    >
      {status}
    </span>
  );
}