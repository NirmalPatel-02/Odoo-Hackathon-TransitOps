
export const ROLES = {
  FLEET_MANAGER: "Fleet Manager",
  DRIVER: "Driver",
  SAFETY_OFFICER: "Safety Officer",
  FINANCIAL_ANALYST: "Financial Analyst",
};

export const PERMISSIONS = {
  [ROLES.FLEET_MANAGER]: {
    dashboard: "full",
    vehicles: "full",
    drivers: "full",
    trips: "full",
    maintenance: "full",
    fuelExpenses: "full",
    analytics: "full",
    settings: "full",
  },
  [ROLES.DRIVER]: {
    dashboard: "view",
    vehicles: "none",
    drivers: "view-own",
    trips: "full",
    maintenance: "none",
    fuelExpenses: "none",
    analytics: "none",
    settings: "none",
  },
  [ROLES.SAFETY_OFFICER]: {
    dashboard: "view",
    vehicles: "none",
    drivers: "full",
    trips: "none",
    maintenance: "none",
    fuelExpenses: "none",
    analytics: "view",
    settings: "none",
  },
  [ROLES.FINANCIAL_ANALYST]: {
    dashboard: "view",
    vehicles: "none",
    drivers: "none",
    trips: "none",
    maintenance: "view",
    fuelExpenses: "full",
    analytics: "full",
    settings: "none",
  },
};

export function getAccess(role, resource) {
  return PERMISSIONS[role]?.[resource] || "none";
}

export function canView(role, resource) {
  return getAccess(role, resource) !== "none";
}

export function canEdit(role, resource) {
  return getAccess(role, resource) === "full";
}