import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";
import { queryKeys } from "@/lib/queryKeys";
import { notify } from "@/lib/toast";
import { getErrorMessage } from "@/utils/helpers";
import {
  addListingToCart,
  clearCart as clearCartApi,
  ensureCart,
  fetchCartEntries,
  removeCartEntry,
  setEntryQuantity,
} from "@/services/cartApi";
import { fetchListings } from "@/services/marketplaceApi";
import { sameId } from "@/utils/helpers";
import type { CartEntry, CartEntryInput, EntityId } from "@/types";

/**
 * Resolves the current customer's cart and its entries.
 *
 * The hook is only meaningful for a logged-in customer. It is disabled
 * (`enabled: false`) for guests and other roles, so it never fires a request
 * and returns empty data until a customer logs in.
 */
export function useCart() {
  const currentUser = useAuthStore((s) => s.currentUser);
  const customerId = currentUser?.id;

  const enabled = currentUser?.role === "customer" && customerId != null;

  // 1. Resolve (or provision) the customer's cart.
  const {
    data: cart,
    isLoading: cartLoading,
    error: cartError,
  } = useQuery({
    queryKey: queryKeys.cart.byCustomer(String(customerId)),
    queryFn: () => ensureCart(customerId!),
    enabled,
    staleTime: Infinity,
  });

  const cartId = cart?.id;

  // 2. Load the entries for that cart.
  const {
    data: entries = [],
    isLoading: entriesLoading,
    error: entriesError,
  } = useQuery({
    queryKey: queryKeys.cart.entries(String(cartId)),
    queryFn: () => fetchCartEntries(cartId!),
    enabled: enabled && cartId != null,
  });

  const count = entries.reduce((sum, e) => sum + e.quantity, 0);
  const subtotal = entries.reduce((sum, e) => sum + e.quantity * e.price, 0);

  return {
    enabled,
    cartId,
    entries,
    count,
    subtotal,
    isLoading: cartLoading || entriesLoading,
    error: cartError ?? entriesError,
  };
}

/**
 * UI-03 / F-02: live stock for each listing currently in the cart.
 *
 * The cart entry only snapshots the price/title at add-time, not stock (which
 * changes over time). This hook fetches the current listings and returns a
 * `stockOf(listingId)` lookup so the cart page can show availability and cap
 * the quantity stepper at the real remaining stock.
 */
export function useCartStock() {
  const { entries, enabled } = useCart();

  const { data: listings = [] } = useQuery({
    queryKey: queryKeys.listings.all,
    queryFn: fetchListings,
    enabled: enabled && entries.length > 0,
    staleTime: 30_000,
  });

  const stockOf = (listingId: EntityId): number | undefined => {
    const l = listings.find((x) => sameId(x.id, listingId));
    return l ? l.stock : undefined;
  };

  return { stockOf };
}

/** Invalidate every cart query for the current customer (keeps UI in sync). */
function useInvalidateCart() {
  const qc = useQueryClient();
  const currentUser = useAuthStore((s) => s.currentUser);
  return (cartId?: EntityId) => {
    if (currentUser?.id != null) {
      qc.invalidateQueries({
        queryKey: queryKeys.cart.byCustomer(String(currentUser.id)),
      });
    }
    if (cartId != null) {
      qc.invalidateQueries({
        queryKey: queryKeys.cart.entries(String(cartId)),
      });
    }
  };
}

/**
 * Add a seller listing to the current customer's cart (upserts quantity,
 * capped by available stock). Customer-only.
 *
 * Uses an OPTIMISTIC cache update so the cart badge/count update instantly and
 * the page does NOT visibly refresh/refetch on add. Previously this invalidated
 * the cart queries on success, which forced a refetch and made pages that read
 * the cart (e.g. the book details page) re-render/flicker as if reloaded.
 */
export function useAddListingToCart() {
  const qc = useQueryClient();
  const currentUser = useAuthStore((s) => s.currentUser);

  return useMutation({
    mutationFn: async (args: { input: CartEntryInput; maxStock?: number }) => {
      const cart = await ensureCart(currentUser!.id!);
      return addListingToCart(cart.id, args.input, args.maxStock);
    },
    // Reconcile the real server entry into the cache WITHOUT refetching.
    onSuccess: (entry) => {
      const customerCartKey = queryKeys.cart.byCustomer(String(currentUser!.id!));
      qc.setQueryData(customerCartKey, (prev: { id?: EntityId } | undefined) =>
        prev?.id ? prev : { id: entry.cartId, customerId: currentUser!.id! }
      );

      const key = queryKeys.cart.entries(String(entry.cartId));
      qc.setQueryData<CartEntry[]>(key, (prev) => {
        const list = prev ?? [];
        const idx = list.findIndex((e) => sameId(e.id, entry.id));
        if (idx >= 0) {
          const next = list.slice();
          next[idx] = entry;
          return next;
        }
        return [...list, entry];
      });
      notify.success("Added to cart successfully");
    },
    onError: (error) => notify.error(getErrorMessage(error)),
  });
}

/**
 * Ready-to-wire add-to-cart handler that enforces the "customer only" rule.
 * - Guests → prompt + redirect to /login
 * - Sellers/Admins → toast that the cart is customer-only
 * - Customers → add the chosen listing (capped at its stock)
 */
export function useAddListingToCartAction() {
  const navigate = useNavigate();
  const currentUser = useAuthStore((s) => s.currentUser);
  const addListing = useAddListingToCart();

  const handleAddToListing = (input: CartEntryInput, maxStock?: number) => {
    if (!currentUser) {
      notify.info("Please log in to add items to your cart.");
      navigate("/login");
      return;
    }
    if (currentUser.role !== "customer") {
      notify.warning("Only customer accounts can use the cart.");
      return;
    }
    addListing.mutate({ input, maxStock });
  };

  return { handleAddToListing, isPending: addListing.isPending };
}

/** Change a line's quantity to an absolute value (min 1). */
export function useUpdateCartQuantity() {
  const invalidate = useInvalidateCart();

  return useMutation({
    mutationFn: ({ id, quantity }: { id: EntityId; quantity: number }) =>
      setEntryQuantity(id, quantity),
    onSuccess: (entry) => invalidate(entry.cartId),
    onError: (error) => notify.error(getErrorMessage(error)),
  });
}

/** Remove a single line from the cart. */
export function useRemoveFromCart() {
  const invalidate = useInvalidateCart();
  const cartId = useCart().cartId;

  return useMutation({
    mutationFn: (entryId: EntityId) => removeCartEntry(entryId),
    onSuccess: () => {
      invalidate(cartId);
      notify.info("Item removed from your cart.");
    },
    onError: (error) => notify.error(getErrorMessage(error)),
  });
}

/** Empty the cart entirely. */
export function useClearCart() {
  const invalidate = useInvalidateCart();
  const cartId = useCart().cartId;

  return useMutation({
    mutationFn: () => clearCartApi(cartId!),
    onSuccess: () => {
      invalidate(cartId);
      notify.info("Your cart has been cleared.");
    },
    onError: (error) => notify.error(getErrorMessage(error)),
  });
}

export type { CartEntry };
