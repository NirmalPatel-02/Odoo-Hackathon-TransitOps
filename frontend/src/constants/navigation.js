// Sidebar nav config. Visibility is driven by the `resource` key against
// constants/permissions.js (getAccess !== 'none'), not a hardcoded role list,
// so it stays in sync with the access table automatically.

export const NAV_ITEMS = [
  { label: "Dashboard", path: "/dashboard", resource: "dashboard" },
  { label: "Vehicles", path: "/fleet", resource: "vehicles" },
  { label: "Drivers", path: "/drivers", resource: "drivers" },
  { label: "Trips", path: "/trips", resource: "trips" },
  { label: "Maintenance", path: "/maintenance", resource: "maintenance" },
  { label: "Fuel & Expenses", path: "/fuel-expenses", resource: "fuelExpenses" },
  { label: "Analytics", path: "/analytics", resource: "analytics" },
  { label: "Settings", path: "/settings", resource: "settings" },
];