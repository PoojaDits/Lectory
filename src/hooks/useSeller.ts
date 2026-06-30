import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createListing,
  deleteListing,
  fetchApprovedBooks,
  fetchSellerListings,
  fetchSellerProfile,
  submitNewBook,
  updateListing,
  updateSellerProfile,
  type ListingUpdate,
} from "@/services/sellerApi";
import { queryKeys } from "@/lib/queryKeys";
import { notify } from "@/lib/toast";
import { getErrorMessage } from "@/utils/helpers";
import type { BookInput, EntityId, ListingInput, Seller } from "@/types";
import { useAuthStore } from "@/stores/useAuthStore";

export function useSellerProfile(sellerId: EntityId | undefined) {
  return useQuery({
    queryKey: queryKeys.sellers.detail(sellerId ?? ""),
    queryFn: fetchSellerProfile,
    enabled: sellerId != null,
  });
}

export function useUpdateSellerProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (updates: Partial<Pick<Seller, "businessName" | "contactPerson" | "mobileNumber">>) =>
      updateSellerProfile(updates),
    onSuccess: (updatedSeller) => {
      qc.invalidateQueries({ queryKey: queryKeys.sellers.detail(updatedSeller.id ?? "") });
      qc.invalidateQueries({ queryKey: queryKeys.sellers.all });
      qc.invalidateQueries({ queryKey: queryKeys.stores.all });

      const { currentUser, setUser } = useAuthStore.getState();
      if (currentUser && String(currentUser.id) === String(updatedSeller.id)) {
        setUser({
          ...currentUser,
          businessName: updatedSeller.businessName,
          contactPerson: updatedSeller.contactPerson,
          mobileNumber: updatedSeller.mobileNumber,
          status: updatedSeller.status,
        });
      }

      notify.success("Seller profile updated.");
    },
    onError: (error) => notify.error(getErrorMessage(error)),
  });
}

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

export function useCreateListing(sellerId?: EntityId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: ListingInput) => createListing(input),
    onSuccess: () => {
      // Refresh the seller's listing grid immediately after they list an
      // approved book, including books that were just approved by admin.
      qc.invalidateQueries({ queryKey: queryKeys.listings.all });
      if (sellerId != null) {
        qc.invalidateQueries({ queryKey: queryKeys.listings.bySeller(sellerId) });
      }
      qc.invalidateQueries({ queryKey: queryKeys.books.store });
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
      if (sellerId != null) {
        qc.invalidateQueries({ queryKey: queryKeys.listings.bySeller(sellerId) });
      }
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
      if (sellerId != null) {
        qc.invalidateQueries({ queryKey: queryKeys.listings.bySeller(sellerId) });
      }
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
