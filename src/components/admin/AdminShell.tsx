import { useMemo } from "react";
import AdminLayout from "./AdminLayout";
import { useBooks, useSellers } from "@/hooks/useAdmin";

interface AdminShellProps {
  onNavigateHome: () => void;
  onLogin: () => void;
}

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
