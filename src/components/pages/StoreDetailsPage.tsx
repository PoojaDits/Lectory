import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  CheckCircle2,
  Mail,
  MapPin,
  Phone,
  Search,
  Star,
  Store as StoreIcon,
  User,
} from "lucide-react";
import { useStoreDetails } from "@/hooks/useStore";
import LazyImage from "@/components/ui/LazyImage";
import { formatCurrency, formatDate } from "@/utils/helpers";
import type { MarketBook, Seller } from "@/types";

interface StoreDetailsPageProps {
  onNavigateHome: () => void;
}

export default function StoreDetailsPage({
  onNavigateHome,
}: StoreDetailsPageProps) {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useStoreDetails(id);
  const [query, setQuery] = useState("");

  const store = data?.store ?? null;
  const books = data?.books ?? [];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return books;
    return books.filter(
      ({ book }) =>
        book.title.toLowerCase().includes(q) ||
        book.author.toLowerCase().includes(q)
    );
  }, [books, query]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/15 to-orange-50/25 pt-20 sm:pt-24 pb-24">
      <div className="mx-auto w-full px-6 sm:px-12 md:px-16 lg:px-24 xl:px-32 max-w-7xl">
        
        {/* Navigation Bar */}
        <div className="mb-6 sm:mb-8 flex items-center justify-between">
          <button
            type="button"
            onClick={onNavigateHome}
            className="group inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/90 backdrop-blur px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-slate-800 shadow-xs sm:shadow-sm transition-all hover:border-primary-300 hover:bg-primary-50/50 hover:text-primary-900"
          >
            <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </button>
        </div>

        {/* State Handling */}
        {isLoading ? (
          <StoreDetailsSkeleton />
        ) : isError ? (
          <div className="mx-auto max-w-xl rounded-3xl sm:rounded-[2.5rem] border border-slate-100 bg-white p-8 sm:p-14 text-center shadow-xl shadow-slate-200/50 mt-4">
            <div className="mx-auto flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-rose-50 text-rose-500">
              <StoreIcon className="h-8 w-8 sm:h-10 sm:w-10" />
            </div>
            <h1 className="mt-5 sm:mt-6 text-xl sm:text-3xl font-black tracking-tight text-slate-900">
              Couldn't Load Bookstore
            </h1>
            <p className="mt-2 sm:mt-3 text-xs sm:text-base text-slate-500 leading-relaxed max-w-md mx-auto">
              Please check your network connection and try reloading the page.
            </p>
          </div>
        ) : !store ? (
          <div className="mx-auto max-w-xl rounded-3xl sm:rounded-[2.5rem] border border-slate-100 bg-white p-8 sm:p-14 text-center shadow-xl shadow-slate-200/50 mt-4">
            <div className="mx-auto flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-primary-50 text-primary-600">
              <StoreIcon className="h-8 w-8 sm:h-10 sm:w-10" />
            </div>
            <h1 className="mt-5 sm:mt-6 text-xl sm:text-3xl font-black tracking-tight text-slate-900">
              Bookstore Not Found
            </h1>
            <p className="mt-2 sm:mt-3 text-xs sm:text-base text-slate-500 leading-relaxed max-w-md mx-auto">
              This bookstore profile may have been removed or closed down.
            </p>
            <div className="mt-6 sm:mt-8 flex justify-center">
              <Link
                to="/stores"
                className="rounded-full bg-primary-900 px-8 py-3.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-primary-900/20 transition hover:bg-primary-800"
              >
                Browse All Bookstores
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* ── Store Showcase Header Card ── */}
            <StoreHeroShowcase store={store} bookCount={books.length} />

            {/* ── Store Catalog Section ── */}
            <section className="mt-12 sm:mt-16">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end justify-between border-b border-slate-200/80 pb-6 mb-8">
                <div>
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-primary-700 mb-1">
                    <BookOpen className="h-4 w-4" /> Catalog Collection
                  </div>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900">
                    Titles Available from {store.businessName}
                  </h2>
                  <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium">
                    Showing {filtered.length} of {books.length} listed book{books.length === 1 ? "" : "s"} ready for purchase.
                  </p>
                </div>

                {books.length > 0 && (
                  <div className="relative w-full sm:w-72 md:w-80 shrink-0">
                    <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search books in this store..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="w-full rounded-full border border-slate-200 bg-white py-3 pl-10 pr-4 text-xs sm:text-sm outline-none transition focus:border-primary-600 focus:ring-4 focus:ring-primary-100 shadow-xs"
                    />
                  </div>
                )}
              </div>

              {/* Catalog Grid State */}
              {books.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white/60 py-20 px-6 text-center">
                  <div className="rounded-full bg-primary-50 p-6 text-primary-600 mb-4">
                    <BookOpen className="h-10 w-10" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900">
                    No Titles Listed Yet
                  </h3>
                  <p className="mt-2 max-w-sm text-xs sm:text-sm text-slate-500 leading-relaxed">
                    {store.businessName} is currently curating their catalog. Check back soon for fresh arrivals and pre-orders.
                  </p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="rounded-full bg-slate-100 p-6 text-slate-400 mb-3">
                    <Search className="h-8 w-8" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    No books match "{query}"
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm text-slate-500">Try searching for a different keyword or author.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-6">
                  {filtered.map(({ listing, book }) => (
                    <StoreBookCard
                      key={`${book.id}-${listing.id}`}
                      book={book}
                      price={listing.price}
                      stock={listing.stock}
                    />
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}

/* ───────────────────────── Hero Showcase Header ───────────────────────── */

function StoreHeroShowcase({
  store,
  bookCount,
}: {
  store: Seller;
  bookCount: number;
}) {
  const initials = store.businessName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  return (
    <header className="overflow-hidden rounded-3xl sm:rounded-[2.5rem] border border-slate-200/80 bg-white shadow-xl shadow-slate-200/40 relative">
      
      {/* Coloured Hero Banner Card */}
      <div className="relative h-44 sm:h-56 md:h-64 w-full bg-gradient-to-r from-amber-600 via-orange-600 to-primary-900 overflow-hidden">
        {/* Subtle dot pattern */}
        <div className="absolute inset-0 opacity-15"
          style={{ backgroundImage: "radial-gradient(circle at 25% 50%, white 1px, transparent 1px), radial-gradient(circle at 75% 25%, white 1px, transparent 1px)", backgroundSize: "32px 32px" }}
        />
        <div className="absolute inset-0 bg-black/15" />

        {store.logo ? (
          <LazyImage
            src={store.logo}
            alt={store.businessName}
            objectFit="cover"
            className="opacity-30 mix-blend-overlay w-full h-full"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <StoreIcon className="h-32 w-32 sm:h-48 sm:w-48 text-white/10" />
          </div>
        )}

        {/* Top Right Verified Badge */}
        <div className="absolute right-4 top-4 sm:right-6 sm:top-6 z-10 flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-black/30 backdrop-blur-md px-3 py-1.5 text-[11px] sm:text-xs font-bold text-white shadow-xs border border-white/20">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Verified Seller
          </span>
          {store.rating != null && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-400 px-3 py-1.5 text-[11px] sm:text-xs font-black text-slate-950 shadow-xs">
              <Star className="h-3.5 w-3.5 fill-slate-950 text-slate-950" /> {store.rating.toFixed(1)}
            </span>
          )}
        </div>
      </div>

      {/* Profile Info Container */}
      <div className="relative px-6 sm:px-10 pb-8 pt-0">
        
        {/* Overlapping Floating Avatar */}
        <div className="absolute -top-12 sm:-top-16 left-6 sm:left-10 flex h-24 w-24 sm:h-32 sm:w-32 shrink-0 items-center justify-center rounded-2xl sm:rounded-3xl bg-gradient-to-br from-primary-600 via-primary-800 to-amber-950 text-3xl sm:text-5xl font-black text-white shadow-2xl ring-4 sm:ring-8 ring-white">
          {initials}
        </div>

        {/* Title & Metric Pills Row */}
        <div className="pt-14 sm:pt-20 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-tight">
              {store.businessName}
            </h1>
            {store.tagline && (
              <p className="text-sm sm:text-base font-bold text-primary-700 mt-1">
                "{store.tagline}"
              </p>
            )}
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 border border-slate-200/80 px-4 py-3 shadow-2xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 text-primary-800">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Inventory</p>
                <p className="text-base sm:text-lg font-black text-slate-900">{bookCount} {bookCount === 1 ? "Book" : "Books"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 border border-slate-200/80 px-4 py-3 shadow-2xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Location</p>
                <p className="text-base sm:text-lg font-black text-slate-900">{store.location ?? "India"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Store Description */}
        {store.description && (
          <div className="mt-6 rounded-2xl bg-slate-50/80 border border-slate-200/60 p-5 sm:p-6">
            <p className="text-xs sm:text-base leading-relaxed text-slate-600 whitespace-pre-line">
              {store.description}
            </p>
          </div>
        )}

        {/* Footer Meta Contacts Bar */}
        <div className="mt-6 pt-6 border-t border-slate-100 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs sm:text-sm font-semibold text-slate-600">
          <span className="inline-flex items-center gap-2 bg-slate-100/80 px-3 py-1.5 rounded-xl">
            <User className="h-4 w-4 text-primary-600" />
            Contact: {store.contactPerson}
          </span>
          
          <a
            href={`mailto:${store.email}`}
            className="inline-flex items-center gap-2 bg-slate-100/80 px-3 py-1.5 rounded-xl transition hover:bg-primary-50 hover:text-primary-800"
          >
            <Mail className="h-4 w-4 text-primary-600" />
            {store.email}
          </a>

          <a
            href={`tel:${store.mobileNumber}`}
            className="inline-flex items-center gap-2 bg-slate-100/80 px-3 py-1.5 rounded-xl transition hover:bg-primary-50 hover:text-primary-800"
          >
            <Phone className="h-4 w-4 text-primary-600" />
            {store.mobileNumber}
          </a>

          <span className="inline-flex items-center gap-2 text-slate-400 ml-auto hidden lg:inline-flex">
            <Calendar className="h-4 w-4" />
            Partner since {formatDate(store.createdAt)}
          </span>
        </div>

      </div>
    </header>
  );
}

/* ───────────────────────── Loading Skeleton ───────────────────────── */

function StoreDetailsSkeleton() {
  return (
    <div className="space-y-12 animate-pulse">
      <div className="overflow-hidden rounded-3xl sm:rounded-[2.5rem] border border-slate-100 bg-white shadow-sm">
        <div className="h-56 w-full bg-slate-200" />
        <div className="px-8 pb-8 pt-16 space-y-4">
          <div className="h-10 w-1/3 bg-slate-200 rounded-xl" />
          <div className="h-4 w-1/4 bg-slate-100 rounded-md" />
          <div className="h-20 w-full bg-slate-100 rounded-2xl mt-6" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="h-64 rounded-2xl bg-slate-100 border border-slate-200/60" />
        ))}
      </div>
    </div>
  );
}

/* ───────────────────────── Store Book Card ───────────────────────── */

function StoreBookCard({
  book,
  price,
  stock,
}: {
  book: MarketBook;
  price: number;
  stock: number;
}) {
  const outOfStock = stock <= 0;

  return (
    <Link
      to={`/books/${book.id}`}
      className="group relative flex h-full w-full mx-auto max-w-[220px] flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary-300"
    >
      {/* Image Aspect Box */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-50 p-3">
        {book.coverImage ? (
          <LazyImage
            src={book.coverImage}
            alt={book.title}
            objectFit="contain"
            className="drop-shadow-md transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary-100 to-orange-100 p-3">
            <span className="text-center text-xs font-bold text-primary-800 line-clamp-3">
              {book.title}
            </span>
          </div>
        )}

        {/* Top Right Price Badge */}
        <div className="absolute right-2 top-2 z-10">
          {outOfStock ? (
            <span className="rounded-full bg-slate-900 px-2.5 py-1 text-[10px] font-bold text-white shadow-sm">
              Sold Out
            </span>
          ) : (
            <span className="rounded-full bg-white/95 backdrop-blur px-2.5 py-1 text-[10px] font-black text-primary-950 shadow-sm border border-slate-100">
              {formatCurrency(price)}
            </span>
          )}
        </div>
      </div>

      {/* Book Metadata Info */}
      <div className="flex flex-1 flex-col p-3.5 sm:p-4">
        <h3 className="line-clamp-2 text-xs sm:text-sm font-bold text-slate-900 transition group-hover:text-primary-700 leading-snug">
          {book.title}
        </h3>
        <p className="mt-1 line-clamp-1 text-[11px] font-medium text-slate-500">
          {book.author}
        </p>

        <div className="mt-auto pt-3 flex items-center justify-between border-t border-slate-100/80">
          <span className="text-sm sm:text-base font-black text-slate-900">
            {formatCurrency(price)}
          </span>
          <span className={`text-[10px] sm:text-[11px] font-bold ${outOfStock ? "text-rose-600" : "text-emerald-700"}`}>
            {outOfStock ? "OOS" : `${stock} left`}
          </span>
        </div>
      </div>
    </Link>
  );
}
