import type { OrderStatus, SellerStatus, BookStatus } from "@/types";

export const PAGE_SIZE = 8;

// ── Order status workflow ──
export const ORDER_STATUSES: OrderStatus[] = [
  "Created",
  "Accepted",
  "Shipped",
  "Delivered",
  "Cancelled",
];

/**
 * Allowed forward transitions for a seller processing an order.
 * Created → Accepted → Shipped → Delivered.
 * An order may be Cancelled before it is Shipped.
 */
export const ORDER_STATUS_FLOW: Record<OrderStatus, OrderStatus[]> = {
  Created: ["Accepted", "Cancelled"],
  Accepted: ["Shipped", "Cancelled"],
  Shipped: ["Delivered"],
  Delivered: [],
  Cancelled: [],
};

export const SELLER_STATUSES: SellerStatus[] = [
  "Pending Approval",
  "Approved",
  "Rejected",
];

export const BOOK_STATUSES: BookStatus[] = [
  "Pending Approval",
  "Approved",
  "Rejected",
];

// ── Tailwind badge styles per status ──
export const ORDER_STATUS_STYLES: Record<OrderStatus, string> = {
  Created: "bg-blue-100 text-blue-800",
  Accepted: "bg-amber-100 text-amber-800",
  Shipped: "bg-indigo-100 text-indigo-800",
  Delivered: "bg-emerald-100 text-emerald-800",
  Cancelled: "bg-red-100 text-red-800",
};

export const STATUS_STYLES: Record<SellerStatus | BookStatus, string> = {
  "Pending Approval": "bg-amber-100 text-amber-800",
  Approved: "bg-emerald-100 text-emerald-800",
  Rejected: "bg-red-100 text-red-800",
};
