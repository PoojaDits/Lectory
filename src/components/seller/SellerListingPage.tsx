import SellerListingsTab from "./SellerListingsTab";
import { useAuthStore } from "@/stores/useAuthStore";

export default function SellerListingsPage() {
  const currentUser = useAuthStore((s) => s.currentUser);

  return (
    <div className="max-w-6xl">
      <SellerListingsTab sellerId={currentUser?.id ?? 0} />
    </div>
  );
}
