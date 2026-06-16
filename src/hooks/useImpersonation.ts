import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";
import { notify } from "@/lib/toast";
import { getErrorMessage } from "@/utils/helpers";
import type { AuthUser, Customer, Seller } from "@/types";

/**
 * Convert a Seller record into the AuthUser shape the auth store expects.
 * Impersonating a seller navigates them to the seller dashboard.
 */
export const sellerToAuthUser = (s: Seller): AuthUser => ({
  id: s.id,
  email: s.email,
  role: "seller",
  name: s.contactPerson,
  businessName: s.businessName,
  contactPerson: s.contactPerson,
  mobileNumber: s.mobileNumber,
  status: s.status,
  createdAt: s.createdAt,
  reviewedAt: s.reviewedAt,
});

/**
 * Convert a Customer record into the AuthUser shape the auth store expects.
 * Impersonating a customer navigates them to the customer account page.
 */
export const customerToAuthUser = (c: Customer): AuthUser => ({
  id: c.id,
  email: c.email,
  role: "customer",
  name: `${c.firstName} ${c.lastName}`.trim(),
  createdAt: c.createdAt,
});

/**
 * Hook that wraps the auth store's `impersonate` function with sensible
 * defaults for the admin portal: navigates the admin into the target
 * user's area after switching, shows a toast, and refuses to start a
 * new impersonation session while one is already active.
 *
 * The admin can also be impersonated from their own dashboard to debug
 * a customer or seller experience in the marketplace.
 */
export function useImpersonation() {
  const navigate = useNavigate();
  const impersonate = useAuthStore((s) => s.impersonate);
  const isImpersonating = useAuthStore((s) => s.isImpersonating);
  const currentUser = useAuthStore((s) => s.currentUser);

  const start = useCallback(
    (user: AuthUser) => {
      // Guard: only an admin (who isn't already impersonating) may impersonate.
      if (!currentUser || currentUser.role !== "admin") {
        notify.error("Only admins can impersonate users.");
        return;
      }
      if (isImpersonating) {
        notify.warning("Exit the current impersonation session first.");
        return;
      }

      try {
        // IMPORTANT: navigate FIRST, then flip the user. React 19 batches
        // Zustand updates and React-Router location updates together, so
        // by the time ProtectedRoute re-evaluates the URL is already the
        // impersonated user's home and the role check passes. Doing this
        // in the opposite order briefly renders the new role against the
        // still-admin URL, which fires the "permission denied" toast.
        navigate(user.role === "seller" ? "/seller" : "/account");
        impersonate(user);
        notify.success(`Now viewing as ${user.name ?? user.email}.`);
      } catch (err) {
        notify.error(getErrorMessage(err));
      }
    },
    [currentUser, impersonate, isImpersonating, navigate]
  );

  return { start, isImpersonating };
}
