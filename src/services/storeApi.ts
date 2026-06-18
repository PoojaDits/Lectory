import apiClient from "@/lib/axios";
import { sameId } from "@/utils/helpers";
import type { EntityId, Listing, MarketBook, Seller, Store } from "@/types";
import { fetchSellers } from "@/services/marketplaceApi";

/**
 * Store (a.k.a. Seller) data access for the public "Stores" pages.
 *
 * In the marketplace data model a *Store* is simply a Seller, and the books
 * it "contains" are its active Listings (each linking a book to the seller
 * with a price + stock). These helpers enrich sellers with derived display
 * values so the Stores pages render without extra joins.
 */

/** A single book as offered by a store, paired with its listing details. */
export interface StoreBook {
  listing: Listing;
  book: MarketBook;
}

/** The full data needed to render a store's details page. */
export interface StoreDetails {
  store: Seller | null;
  books: StoreBook[];
}

/**
 * All approved stores, each enriched with the count of distinct books it
 * currently lists for sale. Sellers with no active listings are kept so the
 * page can show a "new store" state.
 */
export const fetchStores = async (): Promise<Store[]> => {
  const [sellers, { data: listings }] = await Promise.all([
    fetchSellers(),
    apiClient.get<Listing[]>("/listings"),
  ]);

  const active = listings.filter((l) => l.active);

  return sellers
    .filter((s) => s.status === "Approved")
    .map((seller) => {
      const bookIds = new Set(
        active
          .filter((l) => sameId(l.sellerId, seller.id))
          .map((l) => String(l.bookId))
      );
      return { ...seller, bookCount: bookIds.size };
    })
    .sort((a, b) => b.bookCount - a.bookCount);
};

/**
 * A single store together with every active book listing it owns. Books are
 * joined from the `books` collection; listings pointing at a missing book are
 * dropped. In-stock items are sorted first.
 */
export const fetchStoreDetails = async (
  sellerId: EntityId
): Promise<StoreDetails> => {
  const [sellers, { data: listings }, { data: books }] = await Promise.all([
    fetchSellers(),
    apiClient.get<Listing[]>("/listings"),
    apiClient.get<MarketBook[]>("/books"),
  ]);

  const store = sellers.find((s) => sameId(s.id, sellerId)) ?? null;

  const storeBooks: StoreBook[] = listings
    .filter((l) => l.active && sameId(l.sellerId, sellerId))
    .map((listing) => {
      const book = books.find((b) => sameId(b.id, listing.bookId));
      return book ? { listing, book } : null;
    })
    .filter((row): row is StoreBook => row !== null)
    // in-stock first, then cheapest
    .sort((a, b) => {
      const aStock = a.listing.stock > 0 ? 0 : 1;
      const bStock = b.listing.stock > 0 ? 0 : 1;
      if (aStock !== bStock) return aStock - bStock;
      return a.listing.price - b.listing.price;
    });

  return { store, books: storeBooks };
};
