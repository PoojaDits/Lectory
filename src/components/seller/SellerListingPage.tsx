import SellerListingsTab from "./SellerListingsTab";
import { useAuthStore } from "@/stores/useAuthStore";

export default function SellerListingsPage() {
  const currentUser = useAuthStore((s) => s.currentUser);

  return (
    <div className="max-w-6xl bg-gradient-to-br from-primary-50 via-white to-orange-50">
      <SellerListingsTab sellerId={currentUser?.id ?? 0} />
    </div>
  );
}
