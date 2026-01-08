import { Navigate } from "react-router-dom";
import { useAdmin } from "@/contexts/AdminContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAdmin();

  // Also check sessionStorage as fallback in case state hasn't updated yet
  const isAuthFromStorage =
    sessionStorage.getItem("admin_authenticated") === "true";
  const isAuth = isAuthenticated || isAuthFromStorage;

  if (!isAuth) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
