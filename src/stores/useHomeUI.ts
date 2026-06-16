import { create } from "zustand";

/**
 * Tiny UI-only store for home-page ephemera (drawer open state, etc.).
 * Kept separate from `useHomeFilters` so that filter changes don't
 * trigger re-renders of components that only care about UI state.
 */
interface HomeUI {
  filterDrawerOpen: boolean;
  openFilterDrawer: () => void;
  closeFilterDrawer: () => void;
  toggleFilterDrawer: () => void;
}

export const useHomeUI = create<HomeUI>((set, get) => ({
  filterDrawerOpen: false,
  openFilterDrawer: () => set({ filterDrawerOpen: true }),
  closeFilterDrawer: () => set({ filterDrawerOpen: false }),
  toggleFilterDrawer: () =>
    set({ filterDrawerOpen: !get().filterDrawerOpen }),
}));
