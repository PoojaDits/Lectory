import { create } from "zustand";

export interface Slide {
  id: number;
  title: string;
  subtitle: string;
  cta: string;
  link: string;
  gradient: string;
  accent: string;
}

interface SliderState {
  slides: Slide[];
  currentIndex: number;
  isAutoPlaying: boolean;
  setSlides: (slides: Slide[]) => void;
  goToSlide: (index: number) => void;
  nextSlide: () => void;
  prevSlide: () => void;
  toggleAutoPlay: () => void;
}

export const useSliderStore = create<SliderState>((set, get) => ({
  slides: [],
  currentIndex: 0,
  isAutoPlaying: true,

  setSlides: (slides) => set({ slides }),

  goToSlide: (index) => set({ currentIndex: index }),

  nextSlide: () => {
    const { slides, currentIndex } = get();
    if (slides.length === 0) return;
    set({ currentIndex: (currentIndex + 1) % slides.length });
  },

  prevSlide: () => {
    const { slides, currentIndex } = get();
    if (slides.length === 0) return;
    set({
      currentIndex: (currentIndex - 1 + slides.length) % slides.length,
    });
  },

  toggleAutoPlay: () => set((s) => ({ isAutoPlaying: !s.isAutoPlaying })),
}));
