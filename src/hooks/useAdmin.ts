import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createBook,
  deleteBook,
  fetchBooks,
  fetchCustomers,
  fetchDashboardSummary,
  fetchListings,
  fetchOrders,
  fetchSellers,
  updateBookStatus,
  updateListingStatus,
  updateOrderStatus,
  updateSellerStatus,
} from "@/services/adminApi";
import { queryKeys } from "@/lib/queryKeys";
import { notify } from "@/lib/toast";
import { getErrorMessage } from "@/utils/helpers";
import type {
  BookStatus,
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

export const useCustomers = () =>
  useQuery({ queryKey: queryKeys.customers.all, queryFn: fetchCustomers });

export const useBooks = () =>
  useQuery({ queryKey: queryKeys.books.all, queryFn: fetchBooks });

export const useListings = () =>
  useQuery({
    queryKey: queryKeys.listings.all,
    queryFn: fetchListings,
  });

export const useOrders = () =>
  useQuery({
    queryKey: queryKeys.orders.all,
    queryFn: fetchOrders,
  });

// ── Mutations
export function useUpdateSellerStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: EntityId; status: SellerStatus }) =>
      updateSellerStatus(id, status),
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
