import { useEffect, useRef, useState } from "react";
import { BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface LazyImageProps {
  src?: string;
  alt: string;
  className?: string;
  /** Tailwind gradient classes for the placeholder fallback. */
  fallbackGradient?: string;
  /** Start loading this far before the image enters the viewport. */
  rootMargin?: string;
}

/**
 * Truly lazy image using IntersectionObserver:
 * - The real `src` is NOT attached until the element scrolls near the viewport,
 *   so off-screen images are never downloaded.
 * - Shows a shimmer placeholder until the image is in view + decoded.
 * - Fades the image in once loaded.
 * - Falls back to a book icon if the URL is missing or fails to load.
 */
export default function LazyImage({
  src,
  alt,
  className,
  fallbackGradient = "from-slate-200 to-slate-300",
  rootMargin = "200px",
}: LazyImageProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  // Observe the container; flip `inView` once (then stop observing).
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    // If the browser lacks IntersectionObserver, load eagerly.
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin]);

  const showFallback = !src || failed;

  return (
    <div ref={containerRef} className="absolute inset-0 h-full w-full">
      {showFallback ? (
        <div
          className={cn(
            "flex h-full w-full items-center justify-center bg-gradient-to-br p-4",
            fallbackGradient,
            className
          )}
        >
          <BookOpen className="h-12 w-12 text-white/50" />
        </div>
      ) : (
        <>
          {/* Shimmer placeholder until the image is decoded */}
          {!loaded && (
            <div className="absolute inset-0 animate-pulse bg-slate-200" />
          )}

          {/* Only attach src once the element is in view */}
          {inView && (
            <img
              src={src}
              alt={alt}
              decoding="async"
              onLoad={() => setLoaded(true)}
              onError={() => setFailed(true)}
              className={cn(
                "h-full w-full object-cover transition-all duration-500",
                loaded ? "opacity-100 group-hover:scale-105" : "opacity-0",
                className
              )}
            />
          )}
        </>
      )}
    </div>
  );
}