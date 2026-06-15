import apiClient from "@/lib/axios";
import { sameId } from "@/utils/helpers";
import type { Cart, CartEntry, CartEntryInput, EntityId } from "@/types";

/**
 * Cart service backed by the `carts` and `cartItems` collections on the
 * JSON Server.
 *
 * Per the marketplace spec the customer purchases from a Seller Listing, so a
 * cart line stores the chosen **listing** (plus a snapshot of the book + seller
 * so the cart page renders without joins).
 *
 * NOTE on filtering: JSON Server v1 coerces numeric-looking query params to
 * numbers and compares with strict equality, so `?cartId="1"` (string) would
 * NOT match. To stay robust against id-type quirks we fetch the collection and
 * match with `sameId` (loose string comparison) — the same pattern the rest of
 * the codebase uses.
 */

// ── Cart lookup / provisioning ──

/**
 * Find the cart owned by a customer. Returns `null` when the customer doesn't
 * have a cart yet.
 */
export const findCartByCustomer = async (
  customerId: EntityId
): Promise<Cart | null> => {
  const { data } = await apiClient.get<Cart[]>(`/carts`);
  return data.find((c) => sameId(c.customerId, customerId)) ?? null;
};

/**
 * Get the customer's cart, creating an empty one if it doesn't exist yet.
 * (Registration auto-provisions a cart, but we handle the edge case where one
 * is missing — e.g. admin-created customers.)
 */
export const ensureCart = async (customerId: EntityId): Promise<Cart> => {
  const existing = await findCartByCustomer(customerId);
  if (existing) return existing;

  const { data: created } = await apiClient.post<Cart>(`/carts`, {
    customerId,
  });
  return created;
};

// ── Cart entries (the lines inside a cart) ──

/** All lines in a cart. */
export const fetchCartEntries = async (cartId: EntityId): Promise<CartEntry[]> => {
  const { data } = await apiClient.get<CartEntry[]>(`/cartItems`);
  return data.filter((e) => sameId(e.cartId, cartId));
};

/**
 * Add a listing to the cart, or — when the same listing is already in the
 * cart — increase its quantity (respecting the listing's remaining stock when
 * `maxStock` is provided). Returns the resulting entry.
 *
 * Note: the same book from a *different* listing is a separate cart line, per
 * the spec's "customer adds same book from multiple sellers" edge case.
 */
export const addListingToCart = async (
  cartId: EntityId,
  input: CartEntryInput,
  maxStock?: number
): Promise<CartEntry> => {
  const entries = await fetchCartEntries(cartId);
  const existing = entries.find((e) => sameId(e.listingId, input.listingId));

  if (existing) {
    const addQty = input.quantity ?? 1;
    // Never exceed available stock (Rule 5: stock must never become negative).
    const desired = existing.quantity + addQty;
    const quantity =
      maxStock != null ? Math.min(desired, maxStock) : desired;

    const { data } = await apiClient.patch<CartEntry>(
      `/cartItems/${existing.id}`,
      { quantity }
    );
    return data;
  }

  const qty = input.quantity ?? 1;
  const quantity = maxStock != null ? Math.min(qty, maxStock) : qty;

  const { data } = await apiClient.post<CartEntry>(`/cartItems`, {
    cartId,
    listingId: input.listingId,
    bookId: input.bookId,
    sellerId: input.sellerId,
    quantity,
    price: input.price,
    title: input.title,
    author: input.author,
    coverImage: input.coverImage,
    sellerName: input.sellerName,
    createdAt: new Date().toISOString(),
  });
  return data;
};

/** Set an absolute quantity (clamped to a minimum of 1). */
export const setEntryQuantity = async (
  entryId: EntityId,
  quantity: number
): Promise<CartEntry> => {
  const safe = Math.max(1, Math.round(quantity));
  const { data } = await apiClient.patch<CartEntry>(`/cartItems/${entryId}`, {
    quantity: safe,
  });
  return data;
};

/** Remove a single line from the cart. */
export const removeCartEntry = async (entryId: EntityId): Promise<void> => {
  await apiClient.delete(`/cartItems/${entryId}`);
};

/** Remove every line from a cart. */
export const clearCart = async (cartId: EntityId): Promise<void> => {
  const entries = await fetchCartEntries(cartId);
  await Promise.all(
    entries.map((e) => apiClient.delete(`/cartItems/${e.id}`))
  );
};
