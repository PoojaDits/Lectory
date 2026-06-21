import type { OrderStatus, SellerStatus, BookStatus } from "@/types";

// ── Pagination ──
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
 * Created → Accepted → Shped → Delivered.
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

// ============================================
// 🎨 BRAND COLORS - Primary & Secondary
// ============================================
// Use these constants across the project for consistency.
// 
// Recommended usage:
//   - In Tailwind: Use `bg-primary`, `text-primary-700`, `bg-secondary` etc.
//     (configured via CSS variables in index.css)
//   - In TS/JS: import { COLORS } from "@/lib/constants"
//   - Inline styles / dynamic: COLORS.primary[600]
//
// Primary = Elegant warm amber / bookish orange-brown (main brand)
// Secondary = Deep neutral slate (supporting / text / accents)

export const COLORS = {
  // PRIMARY (Warm Amber / Brand Color)
  primary: {
    DEFAULT: "#d97706", // amber-600
    50: "#fefaf0",      // amber-50
    100: "#fef3c7",     // amber-100
    200: "#fde68c",     // amber-200
    600: "#d97706",     // amber-600
    700: "#b45309",     // amber-700
    800: "#92400e",     // amber-800
    900: "#78350f",     // amber-900
  },

  // SECONDARY (Neutral slate for supporting elements)
  secondary: {
    DEFAULT: "#1f2937", // slate-800
    50: "#f8fafc",      // slate-50
    100: "#f1f5f9",     // slate-100
    200: "#e2e8f0",     // slate-200
    600: "#475569",     // slate-600
    700: "#334155",     // slate-700
    800: "#1e2937",     // slate-800
    900: "#0f172a",     // slate-900
  },

  // Semantic / Background colors
  background: "#f8f5f0",
  text: "#1f2937",

  // Optional helper aliases (use these for common cases)
  accent: "#d97706",           // same as primary.DEFAULT
  accentDark: "#b45309",       // primary.700
  accentLight: "#fef3c7",      // primary.100

  // You can extend here with more brand colors if needed
} as const;

// Type-safe helpers (optional but useful)
export type ColorScale = keyof typeof COLORS.primary;
export type BrandColor = keyof typeof COLORS;

// Example usage in components:
// import { COLORS } from "@/lib/constants";
// 
// <div className={`bg-[${COLORS.primary[600]}]`}> // (for dynamic)
// <Button style={{ backgroundColor: COLORS.primary.DEFAULT }}> 
// Or simply use the Tailwind classes `bg-primary` etc. (recommended)

export default COLORS;