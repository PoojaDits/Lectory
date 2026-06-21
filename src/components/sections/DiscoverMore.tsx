import { useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, Users } from "lucide-react";
import { useStoreBooks } from "@/hooks/useHomeContent";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import SectionHeader from "@/components/ui/SectionHeader";
import LazyImage from "@/components/ui/LazyImage";
import { formatCurrency } from "@/utils/helpers";

const CHUNK_SIZE = 10;

export default function DiscoverMore() {
  const { data: books = [], isLoading } = useStoreBooks();
  const [visibleCount, setVisibleCount] = useState(CHUNK_SIZE);

  const hasMore = visibleCount < books.length;

  const sentinelRef = useInfiniteScroll<HTMLDivElement>({
    hasMore,
    isLoading,
    onLoadMore: () => {
      setVisibleCount((prev) => Math.min(prev + CHUNK_SIZE, books.length));
    },
  });

  if (books.length === 0 && !isLoading) return null;

  return (
    <section className="py-16 md:py-24 section-bg border-t border-amber-100/60 bg-gradient-to-b from-white to-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="✨ Discover More"
          title="Endless stories await"
          subtitle="Keep scrolling to explore our entire catalog of incredible books."
          align="center"
        />

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5 xl:gap-6 mt-12">
          {books.slice(0, visibleCount).map((book) => (
            <Link
              key={String(book.id)}
              to={`/books/${book.id}`}
              className="group relative mx-auto flex h-full w-full max-w-[220px] flex-col overflow-hidden rounded-2xl border border-amber-100/50 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-900/5"
            >
              <div className="relative h-48 w-full overflow-hidden bg-slate-50 p-3">
                {book.coverImage ? (
                  <div className="relative h-full w-full">
                    <LazyImage
                      src={book.coverImage}
                      alt={book.title}
                      objectFit="contain"
                      className="drop-shadow-md transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="flex h-full w-full items-end bg-gradient-to-br from-amber-500 to-orange-600 p-3">
                    <p className="text-xs font-bold leading-snug text-white drop-shadow line-clamp-3">
                      {book.title}
                    </p>
                  </div>
                )}
                {book.sellerCount > 0 && (
                  <span className="absolute left-2 top-2 z-10 flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-[10px] font-bold text-amber-800 shadow-sm">
                    <Users className="h-3 w-3" />
                    {book.sellerCount}
                  </span>
                )}
                {!book.inStock ? (
                  <span className="absolute right-2 top-2 z-10 rounded-full bg-slate-700 px-2 py-1 text-[10px] font-bold text-white shadow-sm">
                    Out of stock
                  </span>
                ) : (
                  book.bestPrice != null && (
                    <span className="absolute right-2 top-2 z-10 rounded-full bg-amber-500 px-2 py-1 text-[10px] font-bold text-white shadow-sm">
                      From {formatCurrency(book.bestPrice)}
                    </span>
                  )
                )}
              </div>
              <div className="flex flex-1 flex-col p-4">
                <h3 className="line-clamp-2 text-sm font-bold text-slate-900 group-hover:text-amber-700">
                  {book.title}
                </h3>
                <p className="mt-1 line-clamp-1 text-xs text-slate-500">{book.author}</p>
                <div className="mt-auto pt-3">
                  {book.inStock && book.bestPrice != null ? (
                    <span className="text-lg font-black text-slate-900">
                      From {formatCurrency(book.bestPrice)}
                    </span>
                  ) : (
                    <span className="text-sm font-bold text-slate-400">Unavailable</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {hasMore && (
          <div ref={sentinelRef} className="mt-12 flex items-center justify-center py-6">
            <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
            <span className="ml-3 text-sm font-semibold text-amber-900">Loading more books...</span>
          </div>
        )}
      </div>
    </section>
  );
}
