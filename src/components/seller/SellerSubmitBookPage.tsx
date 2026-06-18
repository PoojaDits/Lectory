import SellerSubmitBookTab from "./SellerSubmitBookTab";
import { useAuthStore } from "@/stores/useAuthStore";

export default function SellerSubmitBookPage() {
  const currentUser = useAuthStore((s) => s.currentUser);

  return (
    <div className="max-w-4xl">
      <SellerSubmitBookTab sellerId={currentUser?.id ?? 0} />
    </div>
  );
}
