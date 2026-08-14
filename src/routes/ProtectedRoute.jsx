import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../store/auth.store";
import Loader from "../components/common/Loader";

const ProtectedRoute = () => {
  const authenticated = useAuthStore((state) => state.authenticated);
  const initialized = useAuthStore((state) => state.initialized);

  // Block rendering until init() has finished reading localStorage + fetching user
  if (!initialized) {
    return <Loader full />;
  }

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;