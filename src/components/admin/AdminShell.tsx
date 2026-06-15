import { useMemo } from "react";
import AdminLayout from "./AdminLayout";
import { useBooks, useSellers } from "@/hooks/useAdmin";

interface AdminShellProps {
  onNavigateHome: () => void;
  onLogin: () => void;
}

/**
 * AdminShell wraps the AdminLayout and supplies the pending counts that
 * surface as sidebar badges. The nested routes inside AdminLayout's
 * <Outlet /> are defined in App.tsx.
 */
export default function AdminShell({
  onNavigateHome,
  onLogin,
}: AdminShellProps) {
  const { data: sellers = [] } = useSellers();
  const { data: books = [] } = useBooks();

  const pendingCounts = useMemo(
    () => ({
      sellers: sellers.filter((s) => s.status === "Pending Approval").length,
      books: books.filter((b) => b.status === "Pending Approval").length,
    }),
    [sellers, books]
  );

  return (
    <AdminLayout
      onNavigateHome={onNavigateHome}
      onLogin={onLogin}
      pendingCounts={pendingCounts}
    />
  );
}
