import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

import LoginPage from '../pages/auth/LoginPage';
import Register from '../pages/auth/Register';
import DashboardLayout from '../components/layouts/DashboardLayout';
import DashboardPage from '../pages/auth/DashboardPage';
import VehicleRegistryPage from '../pages/fleet/VehicleRegistryPage';
import DriverManagementPage from '../pages/drivers/DriverManagementPage';
import TripManagementPage from '../pages/trips/TripManagementPage';
import MaintenancePage from '../pages/maintenance/MaintenancePage';
import FuelExpensePage from '../pages/expenses/FuelExpensePage';
import AnalyticsPage from '../pages/analytics/AnalyticsPage';
import SettingsPage from '../pages/settings/SettingsPage';

// Each future page slots in the same way: add the import above, then a
// <Route> below - wrapped in <ProtectedRoute resource="..."> if it should
// be gated by the RBAC access table (constants/permissions.js).
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />

          <Route element={<ProtectedRoute resource="vehicles" />}>
            <Route path="/fleet" element={<VehicleRegistryPage />} />
          </Route>

          <Route element={<ProtectedRoute resource="drivers" />}>
            <Route path="/drivers" element={<DriverManagementPage />} />
          </Route>

          <Route element={<ProtectedRoute resource="trips" />}>
            <Route path="/trips" element={<TripManagementPage />} />
          </Route>

          <Route element={<ProtectedRoute resource="maintenance" />}>
            <Route path="/maintenance" element={<MaintenancePage />} />
          </Route>

          <Route element={<ProtectedRoute resource="fuelExpenses" />}>
            <Route path="/fuel-expenses" element={<FuelExpensePage />} />
          </Route>

          <Route element={<ProtectedRoute resource="analytics" />}>
            <Route path="/analytics" element={<AnalyticsPage />} />
          </Route>

          <Route element={<ProtectedRoute resource="settings" />}>
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
