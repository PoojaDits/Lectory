import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  fetchHeroSlides,
  fetchCategories,
  fetchNewArrivals,
  fetchTestimonials,
} from "@/services/bookStoreApi";
import { fetchBooksByCategory, fetchBooksForStore } from "@/services/marketplaceApi";
import { queryKeys } from "@/lib/queryKeys";
import {
  fallbackHeroSlides,
  fallbackCategories,
  fallbackNewArrivals,
  fallbackTestimonials,
} from "@/data/fallback";
import { applyHomeFilters, useHomeFilters } from "@/stores/useHomeFilters";
import type { BookWithListings } from "@/types";

/**
 * React Query hooks for the home-page content.
 *
 * Decorative content (hero slides, categories, testimonials, new-arrival
 * banners) is still read from the placeholder collections and falls back to
 * local seed data if the API is down.
 *
 * The book sections now read REAL marketplace books (Open Library covers,
 * real ISBNs, multiple seller listings) filtered by their `categories` tags.
 */
const HOME_STALE = 5 * 60 * 1000;

export const useHeroSlides = () =>
  useQuery({
    queryKey: ["home", "slides"],
    queryFn: fetchHeroSlides,
    placeholderData: fallbackHeroSlides,
    staleTime: HOME_STALE,
  });

export const useCategories = () =>
  useQuery({
    queryKey: ["home", "categories"],
    queryFn: fetchCategories,
    placeholderData: fallbackCategories,
    staleTime: HOME_STALE,
  });

export const useNewArrivals = () =>
  useQuery({
    queryKey: ["home", "newArrivals"],
    queryFn: fetchNewArrivals,
    placeholderData: fallbackNewArrivals,
    staleTime: HOME_STALE,
  });

export const useTestimonials = () =>
  useQuery({
    queryKey: ["home", "testimonials"],
    queryFn: fetchTestimonials,
    placeholderData: fallbackTestimonials,
    staleTime: HOME_STALE,
  });

/** Real marketplace books grouped into storefront sections by category. */
const useCategoryBooks = (category: string) =>
  useQuery({
    queryKey: queryKeys.books.category(category),
    queryFn: () => fetchBooksByCategory(category),
    staleTime: HOME_STALE,
  });

export const useBestSellers = () => useCategoryBooks("bestseller");

export const useRecommendedBooks = () => useCategoryBooks("recommended");

export const useMangaBooks = () => useCategoryBooks("manga");

export const useAiBooks = () => useCategoryBooks("ai");

export const usePreOrders = () => useCategoryBooks("preorder");

/**
 * UI-05 / F-06: REAL new arrivals — the most recently added sellable books,
 * sorted by `createdAt` descending. This replaces the previous behaviour where
 * the "New Arrivals" section incorrectly rendered the "recommended" category.
 */
export const useNewArrivalBooks = (limit = 8) =>
  useQuery({
    queryKey: [...queryKeys.books.store, "new-arrivals", limit],
    queryFn: async () => {
      const books = await fetchBooksForStore();
      return [...books]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, limit);
    },
    staleTime: HOME_STALE,
  });

/** All sellable books (used by the Browse page). */
export const useStoreBooks = () =>
  useQuery({
    queryKey: queryKeys.books.store,
    queryFn: () => fetchBooksForStore(),
    staleTime: HOME_STALE,
  });

/**
 * Books in a given category, filtered through the home-page filter
 * store (price, rating, format, in-stock). The underlying query stays
 * the same — React Query caches the full result — so changing a
 * filter is just a cheap client-side recomputation.
 */
export const useFilteredCategoryBooks = (category: string) => {
  const query = useCategoryBooks(category);
  // Subscribe to each filter input individually so we only re-run the
  // memo when something that actually affects the output changes.
  const priceMin = useHomeFilters((s) => s.priceMin);
  const priceMax = useHomeFilters((s) => s.priceMax);
  const minRating = useHomeFilters((s) => s.minRating);
  const formats = useHomeFilters((s) => s.formats);
  const languages = useHomeFilters((s) => s.languages);
  const inStockOnly = useHomeFilters((s) => s.inStockOnly);

  const filtered = useMemo<BookWithListings[] | undefined>(() => {
    if (!query.data) return query.data;
    return applyHomeFilters(query.data, {
      priceMin,
      priceMax,
      minRating,
      formats,
      languages,
      inStockOnly,
    });
  }, [
    query.data,
    priceMin,
    priceMax,
    minRating,
    formats,
    languages,
    inStockOnly,
  ]);

  return { ...query, data: filtered };
};

/** Convenience hooks for each home-page section. */
export const useFilteredBestSellers = () =>
  useFilteredCategoryBooks("bestseller");

export const useFilteredRecommendedBooks = () =>
  useFilteredCategoryBooks("recommended");

export const useFilteredMangaBooks = () =>
  useFilteredCategoryBooks("manga");

export const useFilteredAiBooks = () => useFilteredCategoryBooks("ai");

export const useFilteredPreOrders = () =>
  useFilteredCategoryBooks("preorder");
