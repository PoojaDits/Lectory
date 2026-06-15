import { STATUS_STYLES, ORDER_STATUS_STYLES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { BookStatus, OrderStatus, SellerStatus } from "@/types";

interface StatusBadgeProps {
  status: SellerStatus | BookStatus | OrderStatus;
  className?: string;
}

/** Colored pill for seller/book/order statuses. */
export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const style =
    (STATUS_STYLES as Record<string, string>)[status] ??
    (ORDER_STATUS_STYLES as Record<string, string>)[status] ??
    "bg-slate-100 text-slate-700";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold",
        style,
        className
      )}
    >
      {status}
    </span>
  );
}
