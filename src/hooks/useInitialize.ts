import { useEffect } from "react";
import { useHeroStore } from "@/stores/useHeroStore";
import { useBookStore } from "@/stores/useBookStore";

/**
 * Boot hook — fires all data fetches on app mount.
 * Call once in the root layout / App component.
 */
export function useInitialize() {
  const loadSlides = useHeroStore((s) => s.loadSlides);
  const loadAll = useBookStore((s) => s.loadAll);

  useEffect(() => {
    loadSlides();
    loadAll();
  }, [loadSlides, loadAll]);
}
