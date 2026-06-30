import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createBook,
  deleteBook,
  deleteUserById,
  fetchBookById,
  fetchBooks,
  fetchCustomerById,
  fetchCustomers,
  fetchDashboardSummary,
  fetchListingById,
  fetchListings,
  fetchOrderById,
  fetchOrders,
  fetchPendingSellers,
  fetchSellerById,
  fetchSellers,
  updateBookStatus,
  updateCustomerById,
  updateListingStatus,
  updateOrderStatus,
  updateSellerStatus,
  updateUserActiveStatus,
} from "@/services/adminApi";
import { queryKeys } from "@/lib/queryKeys";
import { notify } from "@/lib/toast";
import { getErrorMessage } from "@/utils/helpers";
import type {
  BookStatus,
  Customer,
  EntityId,
  MarketBook,
  OrderStatus,
  SellerStatus,
} from "@/types";

// ── Queries 
export const useDashboardSummary = () =>
  useQuery({
    queryKey: queryKeys.admin.dashboard,
    queryFn: fetchDashboardSummary,
  });

export const useSellers = () =>
  useQuery({ queryKey: queryKeys.sellers.all, queryFn: fetchSellers });

export const usePendingSellers = () =>
  useQuery({ queryKey: queryKeys.sellers.pending, queryFn: fetchPendingSellers });

export const useSellerDetail = (id?: EntityId | null) =>
  useQuery({
    queryKey: id ? queryKeys.sellers.detail(id) : ["sellers", "detail", "none"],
    queryFn: () => fetchSellerById(id!),
    enabled: Boolean(id),
  });

export const useCustomers = () =>
  useQuery({ queryKey: queryKeys.customers.all, queryFn: fetchCustomers });

export const useCustomerDetail = (id?: EntityId | null) =>
  useQuery({
    queryKey: id ? queryKeys.customers.detail(id) : ["customers", "detail", "none"],
    queryFn: () => fetchCustomerById(id!),
    enabled: Boolean(id),
  });

export const useBooks = () =>
  useQuery({ queryKey: queryKeys.books.all, queryFn: fetchBooks });

export const useBookDetail = (id?: EntityId | null) =>
  useQuery({
    queryKey: id ? queryKeys.books.detail(id) : ["books", "detail", "none"],
    queryFn: () => fetchBookById(id!),
    enabled: Boolean(id),
  });

export const useListings = () =>
  useQuery({
    queryKey: queryKeys.listings.all,
    queryFn: fetchListings,
  });

export const useListingDetail = (id?: EntityId | null) =>
  useQuery({
    queryKey: id ? queryKeys.listings.detail(id) : ["listings", "detail", "none"],
    queryFn: () => fetchListingById(id!),
    enabled: Boolean(id),
  });

export const useOrders = () =>
  useQuery({
    queryKey: queryKeys.orders.all,
    queryFn: fetchOrders,
  });

export const useOrderDetail = (id?: EntityId | null) =>
  useQuery({
    queryKey: id ? queryKeys.orders.detail(id) : ["orders", "detail", "none"],
    queryFn: () => fetchOrderById(id!),
    enabled: Boolean(id),
  });

// ── Mutations
export function useUpdateCustomerProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: EntityId; updates: Partial<Customer> }) =>
      updateCustomerById(id, updates),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: queryKeys.customers.all });
      qc.invalidateQueries({ queryKey: queryKeys.customers.detail(id) });
      notify.success("Customer updated.");
    },
    onError: (error) => notify.error(getErrorMessage(error)),
  });
}

export function useUpdateUserActiveStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: EntityId; isActive: boolean }) =>
      updateUserActiveStatus(id, isActive),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: queryKeys.customers.all });
      qc.invalidateQueries({ queryKey: queryKeys.sellers.all });
      qc.invalidateQueries({ queryKey: queryKeys.customers.detail(id) });
      qc.invalidateQueries({ queryKey: queryKeys.sellers.detail(id) });
      qc.invalidateQueries({ queryKey: queryKeys.admin.dashboard });
      notify.success("User status updated.");
    },
    onError: (error) => notify.error(getErrorMessage(error)),
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: EntityId) => deleteUserById(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.customers.all });
      qc.invalidateQueries({ queryKey: queryKeys.sellers.all });
      qc.invalidateQueries({ queryKey: queryKeys.admin.dashboard });
      notify.success("User deleted.");
    },
    onError: (error) => notify.error(getErrorMessage(error)),
  });
}

export function useUpdateSellerStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, reason }: { id: EntityId; status: SellerStatus; reason?: string }) =>
      updateSellerStatus(id, status, reason),
    onSuccess: (_data, { status }) => {
      qc.invalidateQueries({ queryKey: queryKeys.sellers.all });
      qc.invalidateQueries({ queryKey: queryKeys.stores.all });
      qc.invalidateQueries({ queryKey: queryKeys.admin.dashboard });
      notify.success(`Seller ${status.toLowerCase()}.`);
    },
    onError: (error) => notify.error(getErrorMessage(error)),
  });
}

export function useUpdateBookStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: EntityId; status: BookStatus }) =>
      updateBookStatus(id, status),
    onSuccess: (_data, { status }) => {
      qc.invalidateQueries({ queryKey: queryKeys.books.all });
      qc.invalidateQueries({ queryKey: queryKeys.books.approved });
      qc.invalidateQueries({ queryKey: queryKeys.books.store });
      qc.invalidateQueries({ queryKey: queryKeys.admin.dashboard });
      notify.success(`Book ${status.toLowerCase()}.`);
    },
    onError: (error) => notify.error(getErrorMessage(error)),
  });
}

export function useCreateBook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: Omit<MarketBook, "id" | "status" | "createdAt">) =>
      createBook(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.books.all });
      qc.invalidateQueries({ queryKey: queryKeys.books.approved });
      qc.invalidateQueries({ queryKey: queryKeys.books.store });
      qc.invalidateQueries({ queryKey: queryKeys.admin.dashboard });
      notify.success("Book added to the marketplace catalog.");
    },
    onError: (error) => notify.error(getErrorMessage(error)),
  });
}

export function useDeleteBook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: EntityId) => deleteBook(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.books.all });
      qc.invalidateQueries({ queryKey: queryKeys.books.approved });
      qc.invalidateQueries({ queryKey: queryKeys.books.store });
      qc.invalidateQueries({ queryKey: queryKeys.admin.dashboard });
      notify.success("Book removed from the catalog.");
    },
    onError: (error) => notify.error(getErrorMessage(error)),
  });
}

export function useUpdateListingStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, active }: { id: EntityId; active: boolean }) =>
      updateListingStatus(id, active),
    onSuccess: (_data, { active }) => {
      qc.invalidateQueries({ queryKey: queryKeys.listings.all });
      qc.invalidateQueries({ queryKey: queryKeys.books.store });
      notify.success(`Listing ${active ? "activated" : "deactivated"}.`);
    },
    onError: (error) => notify.error(getErrorMessage(error)),
  });
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: EntityId; status: OrderStatus }) =>
      updateOrderStatus(id, status),
    onSuccess: (_data, { status }) => {
      qc.invalidateQueries({ queryKey: queryKeys.orders.all });
      qc.invalidateQueries({ queryKey: ["orders"] });
      qc.invalidateQueries({ queryKey: queryKeys.admin.dashboard });
      notify.success(`Order marked as ${status}.`);
    },
    onError: (error) => notify.error(getErrorMessage(error)),
  });
}
