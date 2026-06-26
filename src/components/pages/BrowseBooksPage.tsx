import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, BookOpen, Filter, Search, Users } from "lucide-react";
import { useStoreBooks } from "@/hooks/useHomeContent";
import { CATEGORY_META } from "@/lib/categories";
import { formatCurrency } from "@/utils/helpers";
import HomeSidebar from "../Home/HomeSidebar";
import HomeSidebarDrawer from "../Home/HomeSidebarDrawer";
import { applyHomeFilters, useHomeFilters } from "@/stores/useHomeFilters";
import { useHomeUI } from "@/stores/useHomeUI";
import LazyImage from "../ui/LazyImage";
import Pagination from "../ui/Pagination";

function useGridColumns() {
  const [cols, setCols] = useState(5);

  useEffect(() => {
    function update() {
      const w = window.innerWidth;
      if (w < 768) setCols(2);
      else if (w < 1024) setCols(3);
      else if (w < 1280) setCols(4);
      else setCols(5);
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return cols;
}

interface BrowseBooksPageProps {
  onNavigateHome: () => void;
}
export default function BrowseBooksPage({
  onNavigateHome,
}: BrowseBooksPageProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") ?? "";

  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // ── Fetch the full marketplace catalog via React Query (cached) ──
  const { data: books = [], isLoading, isError } = useStoreBooks();

  // ── Subscribe to sidebar (home) filters ──
  const priceMin = useHomeFilters((s) => s.priceMin);
  const priceMax = useHomeFilters((s) => s.priceMax);
  const minRating = useHomeFilters((s) => s.minRating);
  const formats = useHomeFilters((s) => s.formats);
  const languages = useHomeFilters((s) => s.languages);
  const inStockOnly = useHomeFilters((s) => s.inStockOnly);
  const resetFilters = useHomeFilters((s) => s.reset);
  const openFilterDrawer = useHomeUI((s) => s.openFilterDrawer);

  /** Set or clear the active category in the URL. */
  const setCategory = (tag: string) => {
    const next = new URLSearchParams(searchParams);
    if (tag) next.set("category", tag);
    else next.delete("category");
    setSearchParams(next, { replace: true });
  };

  const handleClearAll = () => {
    setCategory("");
    resetFilters();
  };

  // ── Debounce the search box (300ms) ──
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setSearchQuery(searchInput), 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchInput]);

  // ── Filter by category + text search + sidebar filters ──
  const filteredBooks = useMemo(() => {
    let result = books;

    // Category filter (from URL)
    if (activeCategory) {
      result = result.filter((b) =>
        (b.categories ?? []).includes(activeCategory)
      );
    }

    // Text search
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q)
      );
    }

    // Sidebar filters
    result = applyHomeFilters(result, {
      priceMin,
      priceMax,
      minRating,
      formats,
      languages,
      inStockOnly,
    });

    return result;
  }, [
    books,
    activeCategory,
    searchQuery,
    priceMin,
    priceMax,
    minRating,
    formats,
    languages,
    inStockOnly,
  ]);

  const colsPerRow = useGridColumns();
  const PAGE_SIZE = colsPerRow * 5;
  const totalPages = Math.ceil(filteredBooks.length / PAGE_SIZE);

  // Reset to page 1 whenever filters/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredBooks.length]); // simple proxy for filter changes

  const pageBooks = filteredBooks.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-orange-50 px-4 pb-20 pt-24 relative overflow-x-hidden">
      {/* Decorative BG Blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none " />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-200/30 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />

      <div className="relative mx-auto max-w-[1600px] lg:flex lg:items-start lg:gap-8 z-10">
        <aside className="hidden w-72 flex-shrink-0 lg:block sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto [scrollbar-width:thin] rounded-2xl border border-primary-100 bg-white p-6 shadow-sm z-20">
          <HomeSidebar />
        </aside>

        <div className="min-w-0 flex-1">
          <div className="mx-auto max-w-7xl">
            {/* Header */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <button
                  type="button"
                  onClick={onNavigateHome}
                  className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-primary-900 transition hover:text-primary-700"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Home
                </button>
                <h1 className="text-3xl font-black tracking-tight text-secondary-900 sm:text-4xl">
                  Browse All Books
                </h1>
                <p className="mt-2 text-secondary-600">
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
                  className="w-full rounded-2xl border border-secondary-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-primary-100"
                />
              </div>
            </div>

            {/* Responsive Category filter bar */}
            {!isLoading && (
              <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden w-full">
                <button
                  type="button"
                  onClick={openFilterDrawer}
                  className="lg:hidden shrink-0 inline-flex items-center gap-2 rounded-full bg-primary-900 px-4 py-2 text-xs font-black uppercase tracking-wider text-white shadow-md transition active:scale-95 hover:bg-primary-800 mr-1"
                >
                  <Filter className="h-3.5 w-3.5" />
                  Filters
                </button>

                <span className="hidden lg:inline-flex shrink-0 items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-400 mr-1">
                  <Filter className="h-3.5 w-3.5" />
                  Categories:
                </span>

                <button
                  type="button"
                  onClick={handleClearAll}
                  className={`shrink-0 rounded-full px-4 py-2 text-xs sm:text-sm font-bold transition ${
                    !activeCategory && languages.length === 0
                      ? "bg-primary-900 text-white shadow-sm"
                      : "border border-secondary-200 bg-white text-secondary-600 hover:bg-primary-50"
                  }`}
                >
                  All Books
                </button>

                {CATEGORY_META.map((cat) => (
                  <button
                    key={cat.tag}
                    type="button"
                    onClick={() => setCategory(cat.tag)}
                    className={`shrink-0 rounded-full px-4 py-2 text-xs sm:text-sm font-bold transition ${
                      activeCategory === cat.tag
                        ? "bg-primary-900 text-white shadow-sm"
                        : "border border-secondary-200 bg-white text-secondary-600 hover:bg-primary-50"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            )}



            {!isLoading && !isError && filteredBooks.length > 0 && (
              <p className="mb-4 text-sm font-medium text-slate-500">
                Showing page {currentPage} of {totalPages || 1} ({filteredBooks.length} books total)
              </p>
            )}

            {isLoading ? (
              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-6">
                {Array.from({ length: PAGE_SIZE || 8 }).map((_, i) => (
                  <div key={i} className="mx-auto w-full max-w-[220px] overflow-hidden rounded-2xl border border-secondary-100 bg-white shadow-sm">
                    <div className="h-48 w-full animate-pulse bg-secondary-200" />
                    <div className="space-y-2 p-4">
                      <div className="h-4 w-3/4 animate-pulse rounded bg-secondary-200" />
                      <div className="h-3 w-1/2 animate-pulse rounded bg-secondary-100" />
                      <div className="h-5 w-1/3 animate-pulse rounded bg-secondary-200" />
                    </div>
                  </div>
                ))}
              </div>
            ) : isError ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="rounded-full bg-red-50 p-6">
                  <BookOpen className="h-10 w-10 text-red-400" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-secondary-900">Couldn't load books</h3>
                <p className="mt-2 text-slate-500">Please check your connection and try again.</p>
              </div>
            ) : filteredBooks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="rounded-full bg-secondary-100 p-6">
                  <BookOpen className="h-10 w-10 text-slate-400" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-secondary-900">No books found</h3>
                <p className="mt-2 text-slate-500">Try adjusting your filters or search terms.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-6">
                  {pageBooks.map((book) => (
                    <Link
                      key={String(book.id)}
                      to={`/books/${book.id}`}
                      className="group relative mx-auto flex h-full w-full max-w-[220px] flex-col overflow-hidden rounded-2xl border border-secondary-100 bg-white shadow-sm transition hover:shadow-md"
                    >
                      <div className="relative h-48 w-full overflow-hidden bg-secondary-50 p-3">
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
                          <span className="absolute left-2 top-2 z-10 flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-[10px] font-bold text-primary-800 shadow-sm">
                            <Users className="h-3 w-3" />
                            {book.sellerCount}
                          </span>
                        )}
                        {!book.inStock ? (
                          <span className="absolute right-2 top-2 z-10 rounded-full bg-secondary-700 px-2 py-1 text-[10px] font-bold text-white shadow-sm">
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
                        <h3 className="line-clamp-2 text-sm font-bold text-secondary-900 group-hover:text-primary-700">
                          {book.title}
                        </h3>
                        <p className="mt-1 line-clamp-1 text-xs text-slate-500">{book.author}</p>
                        <div className="mt-auto pt-3">
                          {book.inStock && book.bestPrice != null ? (
                            <span className="text-lg font-black text-secondary-900">
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

                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => {
                      setCurrentPage(page);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <HomeSidebarDrawer />
    </main>
  );
}
