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
  const impersonator = useAuthStore((s) => s.impersonator);
  const isRoleTransitioning = useAuthStore((s) => s.isRoleTransitioning);
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (allow.length > 0 && !allow.includes(currentUser.role)) {
    // Suppress the "permission denied" toast while the auth store
    // signals an in-flight impersonation transition. Both entering and
    // exiting impersonation flip currentUser.role, which can briefly
    // mismatch the still-changing URL across one or more renders until
    // React Router finishes committing the navigation. The toast should
    // only appear for genuine, user-initiated access attempts — not for
    // the transitions we ourselves are orchestrating.
    const isTransitioning =
      isRoleTransitioning || Boolean(impersonator);
    if (!isTransitioning) {
      notify.error("You don't have permission to access that page.");
    }
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
