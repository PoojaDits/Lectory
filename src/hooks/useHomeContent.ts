import { useQuery } from "@tanstack/react-query";
import {
  fetchHeroSlides,
  fetchCategories,
  fetchNewArrivals,
  fetchTestimonials,
  fetchPreOrderBooks,
  fetchBestSellers,
  fetchRecommendedBooks,
  fetchMangaBooks,
  fetchAiBooks,
} from "@/services/bookStoreApi";
import {
  fallbackHeroSlides,
  fallbackCategories,
  fallbackNewArrivals,
  fallbackTestimonials,
  fallbackPreOrderBooks,
  fallbackBestSellers,
  fallbackRecommendedBooks,
  fallbackMangaBooks,
  fallbackAiBooks,
} from "@/data/fallback";

/**
 * React Query hooks for the (decorative) home-page content.
 * Each falls back to local seed data if the API is unavailable
 * so the marketing page never renders empty.
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

export const usePreOrders = () =>
  useQuery({
    queryKey: ["home", "preOrders"],
    queryFn: fetchPreOrderBooks,
    placeholderData: fallbackPreOrderBooks,
    staleTime: HOME_STALE,
  });

export const useBestSellers = () =>
  useQuery({
    queryKey: ["home", "bestSellers"],
    queryFn: fetchBestSellers,
    placeholderData: fallbackBestSellers,
    staleTime: HOME_STALE,
  });

export const useRecommendedBooks = () =>
  useQuery({
    queryKey: ["home", "recommended"],
    queryFn: fetchRecommendedBooks,
    placeholderData: fallbackRecommendedBooks,
    staleTime: HOME_STALE,
  });

export const useMangaBooks = () =>
  useQuery({
    queryKey: ["home", "manga"],
    queryFn: fetchMangaBooks,
    placeholderData: fallbackMangaBooks,
    staleTime: HOME_STALE,
  });

export const useAiBooks = () =>
  useQuery({
    queryKey: ["home", "ai"],
    queryFn: fetchAiBooks,
    placeholderData: fallbackAiBooks,
    staleTime: HOME_STALE,
  });
