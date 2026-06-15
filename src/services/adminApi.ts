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

// Sellers 
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

//Customers 
export const fetchCustomers = async (): Promise<Customer[]> => {
  const { data } = await apiClient.get<Customer[]>("/customers");
  return data;
};

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


export const createBook = async (
  input: Omit<MarketBook, "id" | "status" | "createdAt">
): Promise<MarketBook> => {
  const existing = await fetchBooks();
  if (existing.some((b) => b.isbn === input.isbn)) {
    throw new Error("A book with this ISBN already exists.");
  }
  const { data } = await apiClient.post<MarketBook>("/books", {
    ...input,
    status: "Approved",
    createdAt: new Date().toISOString(),
    reviewedAt: new Date().toISOString(),
  });
  return data;
};

export const deleteBook = async (id: EntityId): Promise<void> => {
  await apiClient.delete(`/books/${id}`);
};

// Listings 
export const fetchListings = async (): Promise<Listing[]> => {
  const { data } = await apiClient.get<Listing[]>("/listings");
  return data;
};

export const updateListingStatus = async (
  id: EntityId,
  active: boolean
): Promise<Listing> => {
  const { data } = await apiClient.patch<Listing>(`/listings/${id}`, {
    active,
    updatedAt: new Date().toISOString(),
  });
  return data;
};

// Orders 
export const fetchOrders = async (): Promise<Order[]> => {
  const { data } = await apiClient.get<Order[]>("/orders");
  return data;
};

export const updateOrderStatus = async (
  id: EntityId,
  status: OrderStatus
): Promise<Order> => {
  const { data } = await apiClient.patch<Order>(`/orders/${id}`, {
    status,
    updatedAt: new Date().toISOString(),
  });
  return data;
};
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
