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

/** All sellable books (used by the Browse page). */
export const useStoreBooks = () =>
  useQuery({
    queryKey: queryKeys.books.store,
    queryFn: () => fetchBooksForStore(),
    staleTime: HOME_STALE,
  });
