import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchDashboardSummary,
  fetchSellers,
  fetchCustomers,
  fetchBooks,
  updateSellerStatus,
  updateBookStatus,
} from "@/services/adminApi";
import { queryKeys } from "@/lib/queryKeys";
import { notify } from "@/lib/toast";
import { getErrorMessage } from "@/utils/helpers";
import type { BookStatus, EntityId, SellerStatus } from "@/types";

// ── Queries ──
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

// ── Mutations ──
export function useUpdateSellerStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: EntityId; status: SellerStatus }) =>
      updateSellerStatus(id, status),
    onSuccess: (_data, { status }) => {
      qc.invalidateQueries({ queryKey: queryKeys.sellers.all });
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
      qc.invalidateQueries({ queryKey: queryKeys.admin.dashboard });
      notify.success(`Book ${status.toLowerCase()}.`);
    },
    onError: (error) => notify.error(getErrorMessage(error)),
  });
}
