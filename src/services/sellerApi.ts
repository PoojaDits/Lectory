import apiClient from "@/lib/axios";
import { sameId } from "@/utils/helpers";
import type {
  BookInput,
  EntityId,
  Listing,
  ListingInput,
  MarketBook,
  Seller,
} from "@/types";

/** Seller API connected to the NestJS backend. */

export const fetchSellerProfile = async (): Promise<Seller> => {
  const { data } = await apiClient.get<Seller>("/sellers/me");
  return data;
};

export const updateSellerProfile = async (
  updates: Partial<Pick<Seller, "businessName" | "contactPerson" | "mobileNumber">>
): Promise<Seller> => {
  const { data } = await apiClient.patch<Seller>("/sellers/me", updates);
  return data;
};

export const fetchSellerListings = async (
  _sellerId?: EntityId
): Promise<(Listing & { book?: MarketBook })[]> => {
  const [{ data: listings }, { data: books }] = await Promise.all([
    apiClient.get<Listing[]>("/listings/mine"),
    apiClient.get<MarketBook[]>("/books"),
  ]);

  return listings.map((l) => ({
    ...l,
    book: books.find((b) => sameId(b.id, l.bookId)),
  }));
};

export const fetchApprovedBooks = async (): Promise<MarketBook[]> => {
  const { data } = await apiClient.get<MarketBook[]>("/books", {
    params: { status: "Approved" },
  });
  return data.filter((b) => b.status === "Approved");
};

export const createListing = async (
  input: ListingInput
): Promise<Listing> => {
  // Backend takes sellerId from JWT. Do not send sellerId because backend
  // validation forbids non-whitelisted DTO fields.
  const { data } = await apiClient.post<Listing>("/listings", {
    bookId: String(input.bookId),
    price: input.price,
    stock: input.stock,
    active: true,
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
  _sellerId: EntityId,
  updates: ListingUpdate
): Promise<Listing> => {
  if (updates.stock !== undefined && updates.stock < 0) {
    throw new Error("Stock cannot be negative.");
  }

  const { data } = await apiClient.patch<Listing>(`/listings/${id}`, updates);
  return data;
};

export const deleteListing = async (
  id: EntityId,
  _sellerId: EntityId
): Promise<void> => {
  await apiClient.delete(`/listings/${id}`);
};

/**
 * Seller submits a new book request. Backend sets createdBySellerId from JWT
 * and status to "Pending Approval" automatically.
 */
export const submitNewBook = async (
  input: BookInput,
  _sellerId: EntityId
): Promise<MarketBook> => {
  const { data } = await apiClient.post<MarketBook>("/books", {
    isbn: input.isbn,
    title: input.title,
    author: input.author,
    publisher: input.publisher || undefined,
    description: input.description || undefined,
    coverImage: input.coverImage || undefined,
  });
  return data;
};
