import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, BookOpen, Loader2, Search, Users } from "lucide-react";
import { useStoreBooks } from "@/hooks/useHomeContent";
import Pagination from "@/components/ui/Pagination";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { formatCurrency } from "@/utils/helpers";

interface BrowseBooksPageProps {
  onNavigateHome: () => void;
}

const PAGE_SIZE = 16; // books per page
const CHUNK = 8; // revealed per scroll step within a page

export default function BrowseBooksPage({
  onNavigateHome,
}: BrowseBooksPageProps) {
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  // how many of the current page's 16 are revealed (starts at 8)
  const [visibleInPage, setVisibleInPage] = useState(CHUNK);

  // ── Fetch the full marketplace catalog via React Query (cached) ──
  const { data: books = [], isLoading, isError } = useStoreBooks();

  // ── Debounce the search box (300ms) ──
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setSearchQuery(searchInput), 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchInput]);

  // ── Filter ──
  const filteredBooks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return books;
    return books.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q)
    );
  }, [books, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredBooks.length / PAGE_SIZE));

  // Reset to page 1 (and the first chunk) whenever the search changes.
  // We adjust state during render (rather than in an effect) so there is no
  // stale render and no cascading re-render. See React docs:
  // https://react.dev/reference/react/useState#storing-information-from-previous-renders
  const [prevSearchQuery, setPrevSearchQuery] = useState(searchQuery);
  if (prevSearchQuery !== searchQuery) {
    setPrevSearchQuery(searchQuery);
    setCurrentPage(1);
    setVisibleInPage(CHUNK);
  }

  // Keep currentPage valid if the result set shrinks (also adjusted in render).
  const safePage = Math.min(currentPage, totalPages);
  if (safePage !== currentPage) {
    setCurrentPage(safePage);
  }

  // ── Slice the current page (16), then reveal up to visibleInPage of them ──
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const pageBooks = filteredBooks.slice(pageStart, pageStart + PAGE_SIZE);
  const visibleBooks = pageBooks.slice(0, visibleInPage);
  const hasMoreInPage = visibleInPage < pageBooks.length;

  // ── Infinite scroll: reveals the next 8 within the current page ──
  const sentinelRef = useInfiniteScroll<HTMLDivElement>({
    hasMore: hasMoreInPage,
    isLoading,
    onLoadMore: () =>
      setVisibleInPage((v) => Math.min(v + CHUNK, pageBooks.length)),
  });

  const goToPage = (page: number) => {
    const safe = Math.min(Math.max(1, page), totalPages);
    setCurrentPage(safe);
    setVisibleInPage(CHUNK); // new page starts by showing first 8 again
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 pb-20 pt-24">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <button
              type="button"
              onClick={onNavigateHome}
              className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-amber-900 transition hover:text-amber-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </button>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Browse All Books
            </h1>
            <p className="mt-2 text-slate-600">
              Discover your next great read from our entire collection.
            </p>
          </div>

          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search books or authors..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
            />
          </div>
        </div>

        {/* Result count */}
        {!isLoading && !isError && filteredBooks.length > 0 && (
          <p className="mb-4 text-sm font-medium text-slate-500">
            Page {currentPage} of {totalPages} · showing {visibleBooks.length} of{" "}
            {pageBooks.length} on this page ({filteredBooks.length} total)
          </p>
        )}

        {/* Initial loading skeletons */}
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:gap-6">
            {Array.from({ length: CHUNK }).map((_, i) => (
              <div
                key={i}
                className="mx-auto w-full max-w-[220px] overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm"
              >
                <div className="h-48 w-full animate-pulse bg-slate-200" />
                <div className="space-y-2 p-4">
                  <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
                  <div className="h-3 w-1/2 animate-pulse rounded bg-slate-100" />
                  <div className="h-5 w-1/3 animate-pulse rounded bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="rounded-full bg-red-50 p-6">
              <BookOpen className="h-10 w-10 text-red-400" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-slate-900">
              Couldn't load books
            </h3>
            <p className="mt-2 text-slate-500">
              Please make sure the API server is running and try again.
            </p>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="rounded-full bg-slate-100 p-6">
              <BookOpen className="h-10 w-10 text-slate-400" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-slate-900">
              No books found
            </h3>
            <p className="mt-2 text-slate-500">
              We couldn't find any books matching your search.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:gap-6">
              {visibleBooks.map((book) => (
                <Link
                  key={String(book.id)}
                  to={`/books/${book.id}`}
                  className="group relative mx-auto flex h-full w-full max-w-[220px] flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:shadow-md"
                >
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                    {book.coverImage ? (
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-end bg-gradient-to-br from-amber-500 to-orange-600 p-3">
                        <p className="text-xs font-bold leading-snug text-white drop-shadow line-clamp-3">
                          {book.title}
                        </p>
                      </div>
                    )}

                    {/* Seller count badge */}
                    {book.sellerCount > 0 && (
                      <span className="absolute left-2 top-2 z-10 flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-[10px] font-bold text-amber-800 shadow-sm">
                        <Users className="h-3 w-3" />
                        {book.sellerCount}
                      </span>
                    )}

                    {/* Best price / out-of-stock badge */}
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
                    <p className="mt-1 line-clamp-1 text-xs text-slate-500">
                      {book.author}
                    </p>
                    <div className="mt-auto pt-3">
                      {book.inStock && book.bestPrice != null ? (
                        <span className="text-lg font-black text-slate-900">
                          From {formatCurrency(book.bestPrice)}
                        </span>
                      ) : (
                        <span className="text-sm font-bold text-slate-400">
                          Unavailable
                        </span>
                      )}
                      <span className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-amber-700">
                        View {book.sellerCount} {book.sellerCount === 1 ? "seller" : "sellers"} →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Infinite scroll: reveal the rest of THIS page (next 8) */}
            {hasMoreInPage && (
              <div
                ref={sentinelRef}
                className="mt-10 flex items-center justify-center py-6"
              >
                <Loader2 className="h-6 w-6 animate-spin text-amber-600" />
                <span className="ml-3 text-sm font-semibold text-slate-500">
                  Loading more books...
                </span>
              </div>
            )}

            {/* Numbered pagination (1 2 3 4 …) — appears once the page is fully revealed */}
            {!hasMoreInPage && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={goToPage}
              />
            )}
          </>
        )}
      </div>
    </main>
  );
}