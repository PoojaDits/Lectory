import { create } from "zustand";

/** Hard price bounds the sidebar slider/number inputs enforce. */
export const PRICE_BOUNDS = { min: 0, max: 2000 } as const;

export type BookFormat = "pocket" | "paperback" | "hardcover";
export type Language = "english" | "hindi" | "spanish";

interface HomeFilters {
  priceMin: number;
  priceMax: number;
  minRating: number;
  formats: BookFormat[];
  languages: Language[];
  inStockOnly: boolean;

  setPriceMin: (n: number) => void;
  setPriceMax: (n: number) => void;
  setMinRating: (n: number) => void;
  toggleFormat: (f: BookFormat) => void;
  toggleLanguage: (l: Language) => void;
  setInStockOnly: (v: boolean) => void;
  reset: () => void;
}

const clamp = (n: number) =>
  Math.max(PRICE_BOUNDS.min, Math.min(PRICE_BOUNDS.max, n));

const initial: Pick<
  HomeFilters,
  "priceMin" | "priceMax" | "minRating" | "formats" | "languages" | "inStockOnly"
> = {
  priceMin: PRICE_BOUNDS.min,
  priceMax: PRICE_BOUNDS.max,
  minRating: 0,
  formats: [],
  languages: [],
  inStockOnly: false,
};

export const useHomeFilters = create<HomeFilters>((set) => ({
  ...initial,
  setPriceMin: (n) => set({ priceMin: clamp(n) }),
  setPriceMax: (n) => set({ priceMax: clamp(n) }),
  setMinRating: (n) => set({ minRating: n }),
  toggleFormat: (f) =>
    set((s) => ({
      formats: s.formats.includes(f)
        ? s.formats.filter((x) => x !== f)
        : [...s.formats, f],
    })),
  toggleLanguage: (l) =>
    set((s) => ({
      languages: s.languages.includes(l)
        ? s.languages.filter((x) => x !== l)
        : [...s.languages, l],
    })),
  setInStockOnly: (v) => set({ inStockOnly: v }),
  reset: () => set(initial),
}));

/** Selector that returns true if any filter is non-default. */
export const useHasActiveFilters = () =>
  useHomeFilters((s) =>
    s.priceMin > PRICE_BOUNDS.min ||
    s.priceMax < PRICE_BOUNDS.max ||
    s.minRating > 0 ||
    s.formats.length > 0 ||
    s.languages.length > 0 ||
    s.inStockOnly
  );

/**
 * Pure filter function used by the home-content hooks. Receives the
 * current filter inputs as an argument so callers can drive it from a
 * `useMemo` with explicit dependencies (no imperative store reads).
 */
export interface HomeFilterInputs {
  priceMin: number;
  priceMax: number;
  minRating: number;
  formats: BookFormat[];
  languages: Language[];
  inStockOnly: boolean;
}

/**
 * Match a book against a set of language filters. Books without a
 * `language` field are treated as English (the catalog default) so
 * legacy entries don't disappear when English is selected.
 */
const bookMatchesLanguages = (
  bookLanguage: string | undefined,
  selected: Language[]
): boolean => {
  if (selected.length === 0) return true;
  const lang = (bookLanguage ?? "English").toLowerCase();
  return selected.some((l) => l.toLowerCase() === lang);
};

export const applyHomeFilters = <
  T extends {
    bestPrice?: number;
    rating?: number;
    pageCount?: number;
    inStock: boolean;
    language?: string;
  }
>(
  books: T[],
  filters: HomeFilterInputs
): T[] => {
  const {
    priceMin,
    priceMax,
    minRating,
    formats,
    languages,
    inStockOnly,
  } = filters;

  return books.filter((b) => {
    if (b.bestPrice != null) {
      if (b.bestPrice < priceMin || b.bestPrice > priceMax) return false;
    }
    if (minRating > 0 && (b.rating ?? 0) < minRating) return false;
    if (formats.length > 0) {
      const fmt = pageCountToFormat(b.pageCount);
      if (!fmt || !formats.includes(fmt)) return false;
    }
    if (!bookMatchesLanguages(b.language, languages)) return false;
    if (inStockOnly && !b.inStock) return false;
    return true;
  });
};

export const pageCountToFormat = (
  pageCount?: number
): BookFormat | null => {
  if (pageCount == null) return null;
  if (pageCount < 200) return "pocket";
  if (pageCount <= 400) return "paperback";
  return "hardcover";
};
