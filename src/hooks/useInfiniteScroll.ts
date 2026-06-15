import { useEffect, useRef } from "react";

interface UseInfiniteScrollOptions {
  /** Called when the sentinel scrolls into view. */
  onLoadMore: () => void;
  /** Whether there is more content to reveal. */
  hasMore: boolean;
  /** Pause observing (e.g. while a fetch is in flight). */
  isLoading?: boolean;
  /** Start loading this far before the sentinel is visible. */
  rootMargin?: string;
}

/**
 * IntersectionObserver-based infinite scroll.
 * Attach the returned ref to a sentinel element at the end of the list;
 * `onLoadMore` fires whenever that sentinel enters the viewport.
 */
export function useInfiniteScroll<T extends HTMLElement = HTMLDivElement>({
  onLoadMore,
  hasMore,
  isLoading = false,
  rootMargin = "300px",
}: UseInfiniteScrollOptions) {
  const sentinelRef = useRef<T | null>(null);
  // Keep the latest callback without re-creating the observer each render.
  const onLoadMoreRef = useRef(onLoadMore);
  onLoadMoreRef.current = onLoadMore;

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasMore || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          onLoadMoreRef.current();
        }
      },
      { rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, isLoading, rootMargin]);

  return sentinelRef;
}
