import { create } from "zustand";
import type { Book, Category, NewArrival, Testimonial, AsyncState } from "@/types";
import {
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
  fallbackCategories,
  fallbackNewArrivals,
  fallbackTestimonials,
  fallbackPreOrderBooks,
  fallbackBestSellers,
  fallbackRecommendedBooks,
  fallbackMangaBooks,
  fallbackAiBooks,
} from "@/data/fallback";

interface BookStoreState extends AsyncState {
  categories: Category[];
  newArrivals: NewArrival[];
  testimonials: Testimonial[];
  preOrders: Book[];
  bestSellers: Book[];
  recommendedBooks: Book[];
  mangaBooks: Book[];
  aiBooks: Book[];
  loadCategories: () => Promise<void>;
  loadNewArrivals: () => Promise<void>;
  loadTestimonials: () => Promise<void>;
  loadPreOrders: () => Promise<void>;
  loadBestSellers: () => Promise<void>;
  loadRecommendedBooks: () => Promise<void>;
  loadMangaBooks: () => Promise<void>;
  loadAiBooks: () => Promise<void>;
  loadAll: () => Promise<void>;
}

export const useBookStore = create<BookStoreState>((set) => ({
  categories: [],
  newArrivals: [],
  testimonials: [],
  preOrders: [],
  bestSellers: [],
  recommendedBooks: [],
  mangaBooks: [],
  aiBooks: [],
  isLoading: false,
  error: null,

  loadCategories: async () => {
    try {
      const data = await fetchCategories();
      set({ categories: data });
    } catch {
      set({ categories: fallbackCategories });
    }
  },

  loadNewArrivals: async () => {
    try {
      const data = await fetchNewArrivals();
      set({ newArrivals: data });
    } catch {
      set({ newArrivals: fallbackNewArrivals });
    }
  },

  loadTestimonials: async () => {
    try {
      const data = await fetchTestimonials();
      set({ testimonials: data });
    } catch {
      set({ testimonials: fallbackTestimonials });
    }
  },

  loadPreOrders: async () => {
    try {
      const data = await fetchPreOrderBooks();
      set({ preOrders: data });
    } catch {
      set({ preOrders: fallbackPreOrderBooks });
    }
  },

  loadBestSellers: async () => {
    try {
      const data = await fetchBestSellers();
      set({ bestSellers: data });
    } catch {
      set({ bestSellers: fallbackBestSellers });
    }
  },

  loadRecommendedBooks: async () => {
    try {
      const data = await fetchRecommendedBooks();
      set({ recommendedBooks: data });
    } catch {
      set({ recommendedBooks: fallbackRecommendedBooks });
    }
  },

  loadMangaBooks: async () => {
    try {
      const data = await fetchMangaBooks();
      set({ mangaBooks: data });
    } catch {
      set({ mangaBooks: fallbackMangaBooks });
    }
  },

  loadAiBooks: async () => {
    try {
      const data = await fetchAiBooks();
      set({ aiBooks: data });
    } catch {
      set({ aiBooks: fallbackAiBooks });
    }
  },

  loadAll: async () => {
    set({ isLoading: true, error: null });
    try {
      const [
        categories,
        newArrivals,
        testimonials,
        preOrders,
        bestSellers,
        recommendedBooks,
        mangaBooks,
        aiBooks,
      ] = await Promise.allSettled([
        fetchCategories(),
        fetchNewArrivals(),
        fetchTestimonials(),
        fetchPreOrderBooks(),
        fetchBestSellers(),
        fetchRecommendedBooks(),
        fetchMangaBooks(),
        fetchAiBooks(),
      ]);

      set({
        categories:
          categories.status === "fulfilled"
            ? categories.value
            : fallbackCategories,
        newArrivals:
          newArrivals.status === "fulfilled"
            ? newArrivals.value
            : fallbackNewArrivals,
        testimonials:
          testimonials.status === "fulfilled"
            ? testimonials.value
            : fallbackTestimonials,
        preOrders:
          preOrders.status === "fulfilled"
            ? preOrders.value
            : fallbackPreOrderBooks,
        bestSellers:
          bestSellers.status === "fulfilled"
            ? bestSellers.value
            : fallbackBestSellers,
        recommendedBooks:
          recommendedBooks.status === "fulfilled"
            ? recommendedBooks.value
            : fallbackRecommendedBooks,
        mangaBooks:
          mangaBooks.status === "fulfilled"
            ? mangaBooks.value
            : fallbackMangaBooks,
        aiBooks:
          aiBooks.status === "fulfilled"
            ? aiBooks.value
            : fallbackAiBooks,
        isLoading: false,
      });
    } catch {
      set({
        categories: fallbackCategories,
        newArrivals: fallbackNewArrivals,
        testimonials: fallbackTestimonials,
        preOrders: fallbackPreOrderBooks,
        bestSellers: fallbackBestSellers,
        recommendedBooks: fallbackRecommendedBooks,
        mangaBooks: fallbackMangaBooks,
        aiBooks: fallbackAiBooks,
        isLoading: false,
        error: "Failed to load data",
      });
    }
  },
}));
