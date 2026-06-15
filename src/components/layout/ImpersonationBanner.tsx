import { useNavigate } from "react-router-dom";
import { ShieldAlert, LogOut } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { notify } from "@/lib/toast";

/**
 * Sticky banner shown while an admin is impersonating another user.
 * Lets the admin exit and return to their own account.
 */
export default function ImpersonationBanner() {
  const isImpersonating = useAuthStore((s) => s.isImpersonating);
  const currentUser = useAuthStore((s) => s.currentUser);
  const impersonator = useAuthStore((s) => s.impersonator);
  const stopImpersonating = useAuthStore((s) => s.stopImpersonating);
  const navigate = useNavigate();

  if (!isImpersonating || !currentUser) return null;

  const handleExit = () => {
    stopImpersonating();
    notify.info("Returned to your admin account.");
    navigate("/admin");
  };

  return (
    <div className="fixed left-0 right-0 top-16 z-40 bg-amber-500 text-amber-950 shadow-md md:top-20">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-2 text-sm font-semibold sm:flex-row">
        <span className="flex items-center gap-2">
          <ShieldAlert className="h-4 w-4" />
          Viewing as <span className="font-black">{currentUser.name ?? currentUser.email}</span>
          <span className="hidden sm:inline">
            ({currentUser.role}) — impersonated by {impersonator?.name ?? "admin"}
          </span>
        </span>
        <button
          type="button"
          onClick={handleExit}
          className="inline-flex items-center gap-1.5 rounded-full bg-amber-950 px-3 py-1.5 text-xs font-bold text-amber-50 transition hover:bg-amber-900"
        >
          <LogOut className="h-3.5 w-3.5" />
          Exit impersonation
        </button>
      </div>
    </div>
  );
}
