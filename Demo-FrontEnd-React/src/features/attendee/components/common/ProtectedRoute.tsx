import { Navigate, Outlet, useLocation } from "react-router";
import { isAuthenticated } from "../../../auth/services/auth-session.service";

const ProtectedRoute = () => {
  const location = useLocation();

  if (!isAuthenticated()) {
    const redirect = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${redirect}`} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
