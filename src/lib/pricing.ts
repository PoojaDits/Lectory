import type { Order } from "@/types";

/**
 * Order pricing configuration.
 *
 * The order total is always computed server-side (in the order service) from
 * the line items — never trusted from the client. Printed books are GST-exempt
 * in India (0%), and the storefront advertises free express shipping; both are
 * modelled explicitly here so they can be changed in one place.
 *
 * `discount` is the hook a future coupon/promo engine would populate.
 */
export const ORDER_PRICING = {
  TAX_RATE: 0, // 0% GST on printed books (India)
  SHIPPING_FEE: 0, // free express shipping (as advertised in the UI)
  DISCOUNT: 0, // no automatic discount; coupons set this per order
} as const;

export interface OrderTotals {
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
}

/** Compute a full price breakdown from a line-item subtotal. */
export function computeOrderTotals(subtotal: number): OrderTotals {
  const discount = ORDER_PRICING.DISCOUNT;
  const shipping = ORDER_PRICING.SHIPPING_FEE;
  const tax = Math.round(subtotal * ORDER_PRICING.TAX_RATE);
  const total = subtotal + shipping + tax - discount;
  return { subtotal, discount, shipping, tax, total };
}

/**
 * Normalise an order's totals for display, gracefully falling back to `total`
 * for legacy orders created before the breakdown fields existed.
 */
export function orderTotals(order: Order): OrderTotals {
  // Orders from the API only store `total`. We treat that as the subtotal
  // since tax, shipping, and discount are all currently 0.
  return {
    subtotal: order.total ?? 0,
    discount: 0,
    shipping: 0,
    tax: 0,
    total: order.total ?? 0,
  };
}
