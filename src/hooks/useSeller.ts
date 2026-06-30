import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createListing,
  deleteListing,
  fetchApprovedBooks,
  fetchSellerListings,
  submitNewBook,
  updateListing,
  type ListingUpdate,
} from "@/services/sellerApi";
import { queryKeys } from "@/lib/queryKeys";
import { notify } from "@/lib/toast";
import { getErrorMessage } from "@/utils/helpers";
import type { BookInput, EntityId, ListingInput } from "@/types";

export function useSellerListings(sellerId: EntityId | undefined) {
  return useQuery({
    queryKey: queryKeys.listings.bySeller(sellerId ?? ""),
    queryFn: () => fetchSellerListings(sellerId!),
    enabled: sellerId != null,
  });
}

export function useApprovedBooks() {
  return useQuery({
    queryKey: queryKeys.books.approved,
    queryFn: fetchApprovedBooks,
  });
}

export function useCreateListing() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: ListingInput) => createListing(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.listings.all });
      qc.invalidateQueries({ queryKey: queryKeys.listings.bySeller("") });
      notify.success("Listing created successfully.");
    },
    onError: (error) => notify.error(getErrorMessage(error)),
  });
}

export function useUpdateListing(sellerId: EntityId | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: EntityId;
      updates: ListingUpdate;
    }) => updateListing(id, sellerId!, updates),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.listings.all });
      qc.invalidateQueries({ queryKey: queryKeys.books.store });
      notify.success("Listing updated.");
    },
    onError: (error) => notify.error(getErrorMessage(error)),
  });
}

export function useDeleteListing(sellerId: EntityId | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: EntityId) => deleteListing(id, sellerId!),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.listings.all });
      qc.invalidateQueries({ queryKey: queryKeys.books.store });
      notify.success("Listing removed.");
    },
    onError: (error) => notify.error(getErrorMessage(error)),
  });
}

export function useSubmitNewBook(sellerId: EntityId | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: BookInput) => submitNewBook(input, sellerId!),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.books.all });
      qc.invalidateQueries({ queryKey: queryKeys.admin.dashboard });
      notify.success("Book submitted for admin approval.");
    },
    onError: (error) => notify.error(getErrorMessage(error)),
  });
}
