import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { canView } from "../constants/permissions";

// Usage:
//   <Route element={<ProtectedRoute />}>          -> any authenticated user
//   <Route element={<ProtectedRoute resource="vehicles" />}>  -> gated by role
export default function ProtectedRoute({ resource }) {
  const { isAuthenticated, user, initializing } = useAuth();
  const location = useLocation();

  if (initializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-500">
        Loading…
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (resource && !canView(user.role_name, resource)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}