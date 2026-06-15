import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";
import { notify } from "@/lib/toast";
import type { UserRole } from "@/types";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allow?: UserRole[];
}
export default function ProtectedRoute({
  children,
  allow = [],
}: ProtectedRouteProps) {
  const currentUser = useAuthStore((s) => s.currentUser);
  const location = useLocation();

  if (!currentUser) {
    notify.warning("Please log in to continue.");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (allow.length > 0 && !allow.includes(currentUser.role)) {
    notify.error("You don't have permission to access that page.");
    const home =
      currentUser.role === "admin"
        ? "/admin"
        : currentUser.role === "seller"
          ? "/seller"
          : "/account";
    return <Navigate to={home} replace />;
  }

  return <>{children}</>;
}
