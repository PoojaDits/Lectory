import apiClient from "@/lib/axios";
import type {
  Customer,
  DashboardSummary,
  EntityId,
  MarketBook,
  Order,
  Seller,
  SellerStatus,
  BookStatus,
} from "@/types";

// ── Sellers ──
export const fetchSellers = async (): Promise<Seller[]> => {
  const { data } = await apiClient.get<Seller[]>("/sellers");
  return data;
};

export const updateSellerStatus = async (
  id: EntityId,
  status: SellerStatus
): Promise<Seller> => {
  const { data } = await apiClient.patch<Seller>(`/sellers/${id}`, {
    status,
    reviewedAt: new Date().toISOString(),
  });
  return data;
};

// ── Customers ──
export const fetchCustomers = async (): Promise<Customer[]> => {
  const { data } = await apiClient.get<Customer[]>("/customers");
  return data;
};

// ── Books (master catalog) ──
export const fetchBooks = async (): Promise<MarketBook[]> => {
  const { data } = await apiClient.get<MarketBook[]>("/books");
  return data;
};

export const updateBookStatus = async (
  id: EntityId,
  status: BookStatus
): Promise<MarketBook> => {
  const { data } = await apiClient.patch<MarketBook>(`/books/${id}`, {
    status,
    reviewedAt: new Date().toISOString(),
  });
  return data;
};

// ── Orders ──
export const fetchOrders = async (): Promise<Order[]> => {
  const { data } = await apiClient.get<Order[]>("/orders");
  return data;
};

// ── Dashboard summary (aggregated client-side from the collections) ──
export const fetchDashboardSummary = async (): Promise<DashboardSummary> => {
  const [sellers, customers, books, orders] = await Promise.all([
    fetchSellers(),
    fetchCustomers(),
    fetchBooks(),
    fetchOrders(),
  ]);

  return {
    totalSellers: sellers.length,
    totalCustomers: customers.length,
    totalBooks: books.length,
    totalOrders: orders.length,
    pendingSellers: sellers.filter((s) => s.status === "Pending Approval")
      .length,
    pendingBooks: books.filter((b) => b.status === "Pending Approval").length,
  };
};


