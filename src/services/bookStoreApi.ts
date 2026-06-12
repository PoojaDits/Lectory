import apiClient from "@/lib/axios";
import type {
  HeroSlide,
  Book,
  Category,
  NewArrival,
  Testimonial,
} from "@/types";
import {
  fallbackPreOrderBooks,
  fallbackBestSellers,
  fallbackRecommendedBooks,
  fallbackMangaBooks,
  fallbackAiBooks,
} from "@/data/fallback";

// ── Hero Slides ──
export const fetchHeroSlides = async (): Promise<HeroSlide[]> => {
  const { data } = await apiClient.get<HeroSlide[]>("/heroSlides");
  return data;
};

// ── Pre-Order Books ──
export const fetchPreOrderBooks = async (): Promise<Book[]> => {
  try {
    const { data } = await apiClient.get<Book[]>("/preOrderBooks");
    return data;
  } catch {
    return fallbackPreOrderBooks;
  }
};

// ── Best Sellers ──
export const fetchBestSellers = async (): Promise<Book[]> => {
  try {
    const { data } = await apiClient.get<Book[]>("/bestSellerBooks");
    return data;
  } catch {
    return fallbackBestSellers;
  }
};

// ── Recommended Books ──
export const fetchRecommendedBooks = async (): Promise<Book[]> => {
  try {
    const { data } = await apiClient.get<Book[]>("/recommendedBooks");
    return data;
  } catch {
    return fallbackRecommendedBooks;
  }
};

// ── Manga Books ──
export const fetchMangaBooks = async (): Promise<Book[]> => {
  try {
    const { data } = await apiClient.get<Book[]>("/mangaBooks");
    return data;
  } catch {
    return fallbackMangaBooks;
  }
};

// ── Artificial Intelligence Books ──
export const fetchAiBooks = async (): Promise<Book[]> => {
  try {
    const { data } = await apiClient.get<Book[]>("/aiBooks");
    return data;
  } catch {
    return fallbackAiBooks;
  }
};

// ── Categories ──
export const fetchCategories = async (): Promise<Category[]> => {
  const { data } = await apiClient.get<Category[]>("/categories");
  return data;
};

// ── New Arrivals ──
export const fetchNewArrivals = async (): Promise<NewArrival[]> => {
  const { data } = await apiClient.get<NewArrival[]>("/newArrivals");
  return data;
};

// ── Testimonials ──
export const fetchTestimonials = async (): Promise<Testimonial[]> => {
  const { data } = await apiClient.get<Testimonial[]>("/testimonials");
  return data;
};
