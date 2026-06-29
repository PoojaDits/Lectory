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
    "bg-secondary-100 text-secondary-700";

  return (
    <span
      // UI-07: text label + a non-color dot so status is not conveyed by
      // colour alone, and an accessible label for assistive tech.
      role="status"
      aria-label={`Status: ${status}`}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold",
        style,
        className
      )}
    >
      <span
        aria-hidden="true"
        className="h-1.5 w-1.5 rounded-full bg-current opacity-70"
      />
      {status}
    </span>
  );
}
