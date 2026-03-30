import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getAdminToken } from "../lib/auth";

export default function AuthGuard() {
  const location = useLocation();
  const token = getAdminToken();

  if (!token) {
    return <Navigate to={`/admin/login?from=${encodeURIComponent(location.pathname)}`} replace />;
  }

  return <Outlet />;
}
