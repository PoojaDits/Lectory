import apiClient from "@/lib/axios";
import { sameId } from "@/utils/helpers";
import type {
  BookInput,
  EntityId,
  Listing,
  ListingInput,
  MarketBook,
} from "@/types";

/**
 * Seller API.
 *
 * All listing mutations enforce seller ownership on the client side before
 * sending the request. This prevents a seller from accidentally modifying
 * another seller's inventory (a required edge case in the spec).
 */

export const fetchSellerListings = async (
  sellerId: EntityId
): Promise<(Listing & { book?: MarketBook })[]> => {
  const [{ data: listings }, { data: books }] = await Promise.all([
    apiClient.get<Listing[]>("/listings"),
    apiClient.get<MarketBook[]>("/books"),
  ]);

  return listings
    .filter((l) => sameId(l.sellerId, sellerId))
    .map((l) => ({
      ...l,
      book: books.find((b) => sameId(b.id, l.bookId)),
    }));
};

export const fetchApprovedBooks = async (): Promise<MarketBook[]> => {
  const { data } = await apiClient.get<MarketBook[]>("/books");
  return data.filter((b) => b.status === "Approved");
};

export const createListing = async (
  input: ListingInput
): Promise<Listing> => {
  const timestamp = new Date().toISOString();

  // Verify the book is approved before listing.
  const { data: book } = await apiClient.get<MarketBook>(`/books/${input.bookId}`);
  if (book.status !== "Approved") {
    throw new Error("Only approved books can be listed for sale.");
  }

  // Prevent duplicate seller listings for the same book.
  const { data: existing } = await apiClient.get<Listing[]>("/listings");
  const duplicate = existing.find(
    (l) => sameId(l.bookId, input.bookId) && sameId(l.sellerId, input.sellerId)
  );
  if (duplicate) {
    throw new Error("You already have a listing for this book. Update it instead.");
  }

  const { data } = await apiClient.post<Listing>("/listings", {
    ...input,
    active: true,
    createdAt: timestamp,
  });
  return data;
};

export interface ListingUpdate {
  price?: number;
  stock?: number;
  active?: boolean;
}

export const updateListing = async (
  id: EntityId,
  sellerId: EntityId,
  updates: ListingUpdate
): Promise<Listing> => {
  const { data: listing } = await apiClient.get<Listing>(`/listings/${id}`);
  if (!sameId(listing.sellerId, sellerId)) {
    throw new Error("You can only update your own listings.");
  }

  if (updates.stock !== undefined && updates.stock < 0) {
    throw new Error("Stock cannot be negative.");
  }

  const { data } = await apiClient.patch<Listing>(`/listings/${id}`, {
    ...updates,
    updatedAt: new Date().toISOString(),
  });
  return data;
};

export const deleteListing = async (
  id: EntityId,
  sellerId: EntityId
): Promise<void> => {
  const { data: listing } = await apiClient.get<Listing>(`/listings/${id}`);
  if (!sameId(listing.sellerId, sellerId)) {
    throw new Error("You can only delete your own listings.");
  }
  await apiClient.delete(`/listings/${id}`);
};

/**
 * Seller submits a new book request. The book is created with status
 * "Pending Approval" and only becomes listable after admin approval.
 */
export const submitNewBook = async (
  input: BookInput,
  sellerId: EntityId
): Promise<MarketBook> => {
  const { data: existing } = await apiClient.get<MarketBook[]>("/books");
  if (existing.some((b) => b.isbn === input.isbn)) {
    throw new Error("A book with this ISBN already exists.");
  }

  const timestamp = new Date().toISOString();
  const { data } = await apiClient.post<MarketBook>("/books", {
    ...input,
    status: "Pending Approval",
    createdBySellerId: sellerId,
    createdAt: timestamp,
  });
  return data;
};
