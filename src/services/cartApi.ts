import apiClient from "@/lib/axios";
import type { Cart, CartEntry, CartEntryInput, EntityId } from "@/types";

// ── Cart lookup / provisioning ──

/** Get current logged-in customer's cart. */
export const findCartByCustomer = async (_customerId: EntityId): Promise<Cart | null> => {
  const { data } = await apiClient.get<Cart | null>(`/carts/me`);
  return data;
};

/** Get the customer's cart, creating an empty one if it doesn't exist yet. */
export const ensureCart = async (customerId: EntityId): Promise<Cart> => {
  const existing = await findCartByCustomer(customerId);
  if (existing) return existing;

  const { data: created } = await apiClient.post<Cart>(`/carts`, {
    customerId,
  });
  return created;
};

// ── Cart entries ──

/** All lines in a cart. */
export const fetchCartEntries = async (cartId: EntityId): Promise<CartEntry[]> => {
  const { data } = await apiClient.get<CartEntry[]>(`/cart-items/cart/${cartId}`);
  return data;
};

/** Add a listing to the cart, or increase quantity when same listing exists. */
export const addListingToCart = async (
  cartId: EntityId,
  input: CartEntryInput,
  maxStock?: number
): Promise<CartEntry> => {
  const qty = input.quantity ?? 1;
  const quantity = maxStock != null ? Math.min(qty, maxStock) : qty;

  const { data } = await apiClient.post<CartEntry>(`/cart-items`, {
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
  });
  return data;
};

/** Set an absolute quantity. */
export const setEntryQuantity = async (
  entryId: EntityId,
  quantity: number
): Promise<CartEntry> => {
  const safe = Math.max(1, Math.round(quantity));
  const { data } = await apiClient.patch<CartEntry>(`/cart-items/${entryId}`, {
    quantity: safe,
  });
  return data;
};

/** Remove a single line from the cart. */
export const removeCartEntry = async (entryId: EntityId): Promise<void> => {
  await apiClient.delete(`/cart-items/${entryId}`);
};

/** Remove every line from a cart. */
export const clearCart = async (cartId: EntityId): Promise<void> => {
  const entries = await fetchCartEntries(cartId);
  await Promise.all(entries.map((e) => apiClient.delete(`/cart-items/${e.id}`)));
};
