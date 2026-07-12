// Central formatting so every page renders numbers/dates the same way.
// Currency defaults to INR to match the wireframe (Acq. Cost in Rs).

export function formatCurrency(value, currency = "INR") {
  if (value === null || value === undefined || value === "") return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(Number(value));
}

export function formatNumber(value) {
  if (value === null || value === undefined || value === "") return "—";
  return new Intl.NumberFormat("en-IN").format(Number(value));
}

export function formatDate(value) {
  if (!value) return "—";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

// For <input type="month"> fields comparing license/registration expiry.
export function isPast(dateStr) {
  if (!dateStr) return false;
  return new Date(dateStr).getTime() < Date.now();
}