import apiClient from "@/lib/axios";
import type { CartEntry, Customer, EntityId, Order, OrderItem } from "@/types";

/** Get current logged-in customer profile */
export const fetchCustomerProfile = async (_id?: EntityId): Promise<Customer> => {
  const { data } = await apiClient.get<Customer>(`/customers/me`);
  return data;
};

/** Update current logged-in customer profile */
export const updateCustomerProfile = async (
  _id: EntityId,
  updates: Partial<Customer>
): Promise<Customer> => {
  const { data } = await apiClient.patch<Customer>(`/customers/me`, updates);
  return data;
};

/** Get all orders for current logged-in customer */
export const fetchCustomerOrders = async (_customerId?: EntityId): Promise<Order[]> => {
  const { data } = await apiClient.get<Order[]>("/orders/me");
  return data;
};

/** Get all orders for current logged-in seller */
export const fetchSellerOrders = async (_sellerId?: EntityId): Promise<Order[]> => {
  const { data } = await apiClient.get<Order[]>("/orders/seller/me");
  return data;
};

/** Place new orders from cart entries */
export const createMarketplaceOrders = async ({
  customerId,
  entries,
  shippingAddress,
}: {
  customerId: EntityId;
  entries: CartEntry[];
  shippingAddress: string;
}): Promise<Order[]> => {
  if (entries.length === 0) throw new Error("Cannot place order with an empty cart.");

  // Group entries by seller because backend order is seller-specific.
  const bySeller: Record<string, CartEntry[]> = {};
  for (const entry of entries) {
    const sId = String(entry.sellerId);
    if (!bySeller[sId]) bySeller[sId] = [];
    bySeller[sId].push(entry);
  }

  const createdOrders: Order[] = [];

  for (const [sellerId, sellerEntries] of Object.entries(bySeller)) {
    const total = sellerEntries.reduce((sum, e) => sum + e.price * e.quantity, 0);

    const items: Omit<OrderItem, "id" | "orderId">[] = sellerEntries.map((e) => ({
      listingId: e.listingId,
      bookId: e.bookId,
      sellerId: e.sellerId,
      quantity: e.quantity,
      price: e.price,
      titleSnapshot: e.title,
      coverImageSnapshot: e.coverImage,
      authorSnapshot: e.author,
      sellerNameSnapshot: e.sellerName,
    }));

    const { data: newOrder } = await apiClient.post<Order>("/orders", {
      customerId,
      sellerId,
      shippingAddress,
      total,
      items,
    });

    createdOrders.push(newOrder);
  }

  return createdOrders;
};
