import { create } from "zustand";
import type { HeroSlide, AsyncState } from "@/types";
import { fetchHeroSlides } from "@/services/bookStoreApi";
import { fallbackHeroSlides } from "@/data/fallback";

interface HeroStore extends AsyncState {
  slides: HeroSlide[];
  currentIndex: number;
  loadSlides: () => Promise<void>;
  setCurrentIndex: (index: number) => void;
  nextSlide: () => void;
  prevSlide: () => void;
}

export const useHeroStore = create<HeroStore>((set, get) => ({
  slides: [],
  currentIndex: 0,
  isLoading: false,
  error: null,

  loadSlides: async () => {
    set({ isLoading: true, error: null });
    try {
      const slides = await fetchHeroSlides();
      set({ slides, isLoading: false });
    } catch {
      set({ slides: fallbackHeroSlides, isLoading: false, error: null });
    }
  },

  setCurrentIndex: (index) => set({ currentIndex: index }),

  nextSlide: () => {
    const { currentIndex, slides } = get();
    set({ currentIndex: (currentIndex + 1) % slides.length });
  },

  prevSlide: () => {
    const { currentIndex, slides } = get();
    set({ currentIndex: (currentIndex - 1 + slides.length) % slides.length });
  },
}));
