
import apiClient from "@/lib/axios";
import { sameId } from "@/utils/helpers";
import type { CartEntry, Customer, EntityId, Order, OrderItem } from "@/types";

/** Get customer by ID */
export const fetchCustomerProfile = async (id: EntityId): Promise<Customer> => {
  const { data } = await apiClient.get<Customer>(`/customers/${id}`);
  return data;
};

/** Update customer profile */
export const updateCustomerProfile = async (
  id: EntityId,
  updates: Partial<Customer>
): Promise<Customer> => {
  const { data } = await apiClient.patch<Customer>(`/customers/${id}`, updates);
  return data;
};

/** Get all orders for a customer */
export const fetchCustomerOrders = async (customerId: EntityId): Promise<Order[]> => {
  const { data } = await apiClient.get<Order[]>("/orders");
  return data.filter((o) => sameId(o.customerId, customerId));
};

/** Get all orders for a seller */
export const fetchSellerOrders = async (sellerId: EntityId): Promise<Order[]> => {
  const { data } = await apiClient.get<Order[]>("/orders");
  return data.filter((o) => sameId(o.sellerId, sellerId));
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

  // Group entries by seller
  const bySeller: Record<string, CartEntry[]> = {};
  for (const entry of entries) {
    const sId = String(entry.sellerId);
    if (!bySeller[sId]) bySeller[sId] = [];
    bySeller[sId].push(entry);
  }

  const createdOrders: Order[] = [];
  const timestamp = new Date().toISOString();

  // Create an Order for each seller
  for (const [sId, sellerEntries] of Object.entries(bySeller)) {
    const total = sellerEntries.reduce((sum, e) => sum + e.price * e.quantity, 0);
    const orderId = `ord_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    const items: OrderItem[] = sellerEntries.map((e, idx) => ({
      id: `oitem_${Date.now()}_${idx}_${Math.random().toString(36).substring(2, 5)}`,
      orderId,
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

    const orderPayload: Order = {
      id: orderId,
      customerId,
      sellerId: sId,
      status: "Created",
      shippingAddress,
      total,
      createdAt: timestamp,
      items,
    };

    const { data: newOrder } = await apiClient.post<Order>("/orders", orderPayload);

    // Also post items to /orderItems collection for good measure
    await Promise.all(
      items.map((it) => apiClient.post("/orderItems", it).catch(() => {}))
    );

    // Reduce listing stock by purchased quantity
    await Promise.all(
      sellerEntries.map(async (e) => {
        try {
          const { data: listing } = await apiClient.get(`/listings/${e.listingId}`);
          if (listing && typeof listing.stock === "number") {
            const newStock = Math.max(0, listing.stock - e.quantity);
            await apiClient.patch(`/listings/${e.listingId}`, { stock: newStock });
          }
        } catch (err) {
          console.error(`Failed to reduce stock for listing ${e.listingId}`, err);
        }
      })
    );

    createdOrders.push(newOrder);
  }

  return createdOrders;
};
