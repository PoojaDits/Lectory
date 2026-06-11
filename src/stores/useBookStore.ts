import { create } from "zustand";
import type { Book, Category, NewArrival, Testimonial, AsyncState } from "@/types";
import {
  fetchBestsellers,
  fetchCategories,
  fetchNewArrivals,
  fetchTestimonials,
} from "@/services/bookStoreApi";
import {
  fallbackBestsellers,
  fallbackCategories,
  fallbackNewArrivals,
  fallbackTestimonials,
} from "@/data/fallback";

interface BookStoreState extends AsyncState {
  bestsellers: Book[];
  categories: Category[];
  newArrivals: NewArrival[];
  testimonials: Testimonial[];
  loadBestsellers: () => Promise<void>;
  loadCategories: () => Promise<void>;
  loadNewArrivals: () => Promise<void>;
  loadTestimonials: () => Promise<void>;
  loadAll: () => Promise<void>;
}

export const useBookStore = create<BookStoreState>((set) => ({
  bestsellers: [],
  categories: [],
  newArrivals: [],
  testimonials: [],
  isLoading: false,
  error: null,

  loadBestsellers: async () => {
    try {
      const data = await fetchBestsellers();
      set({ bestsellers: data });
    } catch {
      set({ bestsellers: fallbackBestsellers });
    }
  },

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

  loadAll: async () => {
    set({ isLoading: true, error: null });
    try {
      const [bestsellers, categories, newArrivals, testimonials] =
        await Promise.allSettled([
          fetchBestsellers(),
          fetchCategories(),
          fetchNewArrivals(),
          fetchTestimonials(),
        ]);

      set({
        bestsellers:
          bestsellers.status === "fulfilled"
            ? bestsellers.value
            : fallbackBestsellers,
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
        isLoading: false,
      });
    } catch {
      set({
        bestsellers: fallbackBestsellers,
        categories: fallbackCategories,
        newArrivals: fallbackNewArrivals,
        testimonials: fallbackTestimonials,
        isLoading: false,
        error: "Failed to load data",
      });
    }
  },
}));
