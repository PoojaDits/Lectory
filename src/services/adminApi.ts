import apiClient from "@/lib/axios";
import type {
  BookStatus,
  Customer,
  DashboardSummary,
  EntityId,
  Listing,
  MarketBook,
  Order,
  OrderStatus,
  Seller,
  SellerStatus,
} from "@/types";

// ── Sellers ────────────────────────────────────────────────────────────────
export const fetchSellers = async (): Promise<Seller[]> => {
  const { data } = await apiClient.get<Seller[]>("/sellers");
  return data;
};

export const fetchPendingSellers = async (): Promise<Seller[]> => {
  const { data } = await apiClient.get<Seller[]>("/sellers/pending");
  return data;
};

export const fetchSellerById = async (id: EntityId): Promise<Seller> => {
  const { data } = await apiClient.get<Seller>(`/sellers/${id}`);
  return data;
};

export const updateSellerStatus = async (
  id: EntityId,
  status: SellerStatus
): Promise<Seller> => {
  if (status === "Approved") {
    const { data } = await apiClient.patch<Seller>(`/sellers/${id}/approve`);
    return data;
  }

  if (status === "Rejected") {
    const { data } = await apiClient.patch<Seller>(`/sellers/${id}/reject`, {
      reason: "Rejected by admin",
    });
    return data;
  }

  // Rare fallback: move seller back to pending if an admin UI ever needs it.
  const { data } = await apiClient.patch<Seller>(`/sellers/${id}`, {
    sellerStatus: "PENDING_APPROVAL",
  });
  return data;
};

// ── Customers ──────────────────────────────────────────────────────────────
export const fetchCustomers = async (): Promise<Customer[]> => {
  const { data } = await apiClient.get<Customer[]>("/customers");
  return data;
};

export const fetchCustomerById = async (id: EntityId): Promise<Customer> => {
  const { data } = await apiClient.get<Customer>(`/customers/${id}`);
  return data;
};

export const updateCustomerById = async (
  id: EntityId,
  updates: Partial<Pick<Customer, "firstName" | "lastName" | "phone" | "addresses" | "avatar">>
): Promise<Customer> => {
  const { data } = await apiClient.patch<Customer>(`/customers/${id}`, updates);
  return data;
};

// ── Users / auth account actions ───────────────────────────────────────────
export const updateUserActiveStatus = async (
  id: EntityId,
  isActive: boolean
): Promise<Customer | Seller> => {
  const { data } = await apiClient.patch<Customer | Seller>(`/users/${id}/status`, {
    isActive,
  });
  return data;
};

export const deleteUserById = async (id: EntityId): Promise<void> => {
  await apiClient.delete(`/users/${id}`);
};

// ── Books / Catalog ────────────────────────────────────────────────────────
export const fetchBooks = async (): Promise<MarketBook[]> => {
  const { data } = await apiClient.get<MarketBook[]>("/books");
  return data;
};

export const fetchBookById = async (id: EntityId): Promise<MarketBook> => {
  const { data } = await apiClient.get<MarketBook>(`/books/${id}`);
  return data;
};

export const updateBookStatus = async (
  id: EntityId,
  status: BookStatus
): Promise<MarketBook> => {
  const { data } = await apiClient.patch<MarketBook>(`/books/${id}`, {
    status,
  });
  return data;
};

export const createBook = async (
  input: Omit<MarketBook, "id" | "status" | "createdAt">
): Promise<MarketBook> => {
  const { data } = await apiClient.post<MarketBook>("/books", {
    isbn: input.isbn,
    title: input.title,
    author: input.author,
    publisher: input.publisher || undefined,
    description: input.description || undefined,
    coverImage: input.coverImage || undefined,
    categories: input.categories,
    rating: input.rating,
    pageCount: input.pageCount,
    publishedDate: input.publishedDate,
    language: input.language,
  });
  return data;
};

export const deleteBook = async (id: EntityId): Promise<void> => {
  await apiClient.delete(`/books/${id}`);
};

// ── Listings ───────────────────────────────────────────────────────────────
export const fetchListings = async (): Promise<Listing[]> => {
  const { data } = await apiClient.get<Listing[]>("/listings");
  return data;
};

export const fetchListingById = async (id: EntityId): Promise<Listing> => {
  const { data } = await apiClient.get<Listing>(`/listings/${id}`);
  return data;
};

export const updateListingStatus = async (
  id: EntityId,
  active: boolean
): Promise<Listing> => {
  const { data } = await apiClient.patch<Listing>(`/listings/${id}`, {
    active,
  });
  return data;
};

// ── Orders ─────────────────────────────────────────────────────────────────
export const fetchOrders = async (): Promise<Order[]> => {
  const { data } = await apiClient.get<Order[]>("/orders");
  return data;
};

export const fetchOrderById = async (id: EntityId): Promise<Order> => {
  const { data } = await apiClient.get<Order>(`/orders/${id}`);
  return data;
};

export const updateOrderStatus = async (
  id: EntityId,
  status: OrderStatus
): Promise<Order> => {
  const { data } = await apiClient.patch<Order>(`/orders/${id}`, {
    status,
  });
  return data;
};

// ── Dashboard ──────────────────────────────────────────────────────────────
export const fetchDashboardSummary = async (): Promise<DashboardSummary> => {
  const { data } = await apiClient.get<DashboardSummary>("/admins/dashboard");
  return data;
};
