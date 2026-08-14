import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../store/auth.store";

const PublicRoute = () => {
  const authenticated = useAuthStore((state) => state.authenticated);
  const initialized = useAuthStore((state) => state.initialized);

  // Don't make routing decisions until auth state is hydrated
  if (!initialized) return null;

  // Already logged in → send to feed
  if (authenticated) {
    return <Navigate to="/feed" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
