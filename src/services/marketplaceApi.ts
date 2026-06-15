import apiClient from "@/lib/axios";
import { sameId } from "@/utils/helpers";
import type {
  BookWithListings,
  Listing,
  MarketBook,
  Seller,
} from "@/types";

/**
 * Marketplace data access.
 *
 * Reads the master `books`, `listings`, and `sellers` collections and enriches
 * books with their listings on the client. JSON Server v1 does type-sensitive
 * filtering (see cartApi note), so we filter with `sameId` to stay robust.
 *
 * This replaces the old placeholder collections (bestSellerBooks, etc.).
 * Storefront sections are now driven by a book's `categories` tags.
 */

export const fetchBooks = async (): Promise<MarketBook[]> => {
  const { data } = await apiClient.get<MarketBook[]>("/books");
  return data;
};

export const fetchListings = async (): Promise<Listing[]> => {
  const { data } = await apiClient.get<Listing[]>("/listings");
  return data;
};

export const fetchSellers = async (): Promise<Seller[]> => {
  const { data } = await apiClient.get<Seller[]>("/sellers");
  return data;
};

/**
 * Enrich approved, listed books with their (active) listings + seller info and
 * derived display values (best price, stock, seller count).
 *
 * `bookFilter` lets callers narrow the set (e.g. by category). Only books that
 * have at least one active listing are returned — a book with no offers isn't
 * sellable and shouldn't appear in the storefront.
 */
export const fetchBooksForStore = async (
  bookFilter?: (b: MarketBook) => boolean
): Promise<BookWithListings[]> => {
  const [books, listings, sellers] = await Promise.all([
    fetchBooks(),
    fetchListings(),
    fetchSellers(),
  ]);

  return books
    .filter((b) => b.status === "Approved")
    .filter((b) => !bookFilter || bookFilter(b))
    .map((book) => {
      const bookListings = listings
        .filter((l) => l.active && sameId(l.bookId, book.id))
        .map((l) => ({
          ...l,
          seller: sellers.find((s) => sameId(s.id, l.sellerId)),
        }));

      const inStockPrices = bookListings
        .filter((l) => l.stock > 0)
        .map((l) => l.price);
      const bestPrice = inStockPrices.length
        ? Math.min(...inStockPrices)
        : undefined;

      return {
        ...book,
        listings: bookListings,
        bestPrice,
        inStock: inStockPrices.length > 0,
        sellerCount: new Set(bookListings.map((l) => String(l.sellerId))).size,
      };
    })
    .filter((b) => b.listings.length > 0); // hide books nobody is selling
};

/** Books in a given category (e.g. "bestseller"), enriched for display. */
export const fetchBooksByCategory = (
  category: string
): Promise<BookWithListings[]> =>
  fetchBooksForStore((b) => (b.categories ?? []).includes(category));

/** A single book with all its seller listings (for the details page). */
export const fetchBookDetails = async (
  bookId: string | number
): Promise<BookWithListings | null> => {
  const all = await fetchBooksForStore((b) => sameId(b.id, bookId));
  return all[0] ?? null;
};
