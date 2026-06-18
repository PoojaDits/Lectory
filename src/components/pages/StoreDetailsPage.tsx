import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  Mail,
  MapPin,
  Phone,
  Search,
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
    <main className="min-h-screen bg-slate-50 px-4 pb-20 pt-24">
      <div className="mx-auto max-w-7xl">
        {/* Back nav */}
        <button
          type="button"
          onClick={onNavigateHome}
          className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-amber-900 transition hover:text-amber-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </button>

        {isLoading ? (
          <StoreHeaderSkeleton />
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="rounded-full bg-red-50 p-6">
              <StoreIcon className="h-10 w-10 text-red-400" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-slate-900">
              Couldn't load this store
            </h3>
            <p className="mt-2 text-slate-500">
              Please check your connection and try again.
            </p>
          </div>
        ) : !store ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="rounded-full bg-slate-100 p-6">
              <StoreIcon className="h-10 w-10 text-slate-400" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-slate-900">
              Store not found
            </h3>
            <p className="mt-2 text-slate-500">
              This store may no longer be available.
            </p>
            <Link
              to="/stores"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-amber-900 px-5 py-2.5 text-sm font-bold text-white"
            >
              Browse all stores
            </Link>
          </div>
        ) : (
          <>
            {/* ── Store header / description ── */}
            <StoreHeader store={store} bookCount={books.length} />

            {/* ── Books section ── */}
            <section className="mt-10">
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-black tracking-tight text-slate-900">
                    Books in this store
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {books.length} {books.length === 1 ? "title" : "titles"}{" "}
                    available from {store.businessName}.
                  </p>
                </div>

                {books.length > 0 && (
                  <div className="relative w-full sm:max-w-xs">
                    <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search this store..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
                    />
                  </div>
                )}
              </div>

              {books.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
                  <div className="rounded-full bg-slate-100 p-6">
                    <BookOpen className="h-10 w-10 text-slate-400" />
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-slate-900">
                    No books listed yet
                  </h3>
                  <p className="mt-2 max-w-sm text-slate-500">
                    {store.businessName} hasn't listed any books for sale yet.
                    Check back soon for new arrivals.
                  </p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="rounded-full bg-slate-100 p-6">
                    <BookOpen className="h-10 w-10 text-slate-400" />
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-slate-900">
                    No books match your search
                  </h3>
                  <p className="mt-2 text-slate-500">Try a different keyword.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:gap-6">
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

/* ───────────────────────── Header ───────────────────────── */

function StoreHeader({
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
    <header className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
      {/* Banner */}
      <div className="relative h-40 w-full bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 sm:h-48">
        {store.logo ? (
          <LazyImage
            src={store.logo}
            alt={store.businessName}
            objectFit="cover"
            className="opacity-40"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <StoreIcon className="h-20 w-20 text-white/40" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      {/* Body */}
      <div className="px-6 pb-6 sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-end gap-4">
            {/* Avatar */}
            <div className="-mt-12 flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-3xl font-black text-white shadow-lg ring-4 ring-white">
              {initials}
            </div>
            <div className="pb-1">
              <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                {store.businessName}
              </h1>
              {store.tagline && (
                <p className="text-sm font-medium text-amber-600">
                  {store.tagline}
                </p>
              )}
            </div>
          </div>

          {/* Quick stats */}
          <div className="flex gap-3 pb-1">
            <div className="rounded-xl bg-amber-50 px-4 py-2 text-center">
              <p className="text-lg font-black text-amber-900">{bookCount}</p>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-amber-600">
                Books
              </p>
            </div>
            {store.rating != null && (
              <div className="rounded-xl bg-amber-50 px-4 py-2 text-center">
                <p className="text-lg font-black text-amber-900">
                  {store.rating.toFixed(1)}
                </p>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-amber-600">
                  Rating
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        {store.description && (
          <p className="mt-5 max-w-3xl text-sm leading-relaxed text-slate-600">
            {store.description}
          </p>
        )}

        {/* Meta row */}
        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 border-t border-slate-100 pt-5 text-sm text-slate-600">
          <span className="inline-flex items-center gap-1.5">
            <User className="h-4 w-4 text-amber-600" />
            {store.contactPerson}
          </span>
          <a
            href={`mailto:${store.email}`}
            className="inline-flex items-center gap-1.5 transition hover:text-amber-700"
          >
            <Mail className="h-4 w-4 text-amber-600" />
            {store.email}
          </a>
          <a
            href={`tel:${store.mobileNumber}`}
            className="inline-flex items-center gap-1.5 transition hover:text-amber-700"
          >
            <Phone className="h-4 w-4 text-amber-600" />
            {store.mobileNumber}
          </a>
          {store.location && (
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-amber-600" />
              {store.location}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5">
            <StoreIcon className="h-4 w-4 text-amber-600" />
            Seller since {formatDate(store.createdAt)}
          </span>
        </div>
      </div>
    </header>
  );
}

function StoreHeaderSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
      <div className="h-48 w-full animate-pulse bg-slate-200" />
      <div className="space-y-4 px-8 pb-8">
        <div className="h-8 w-1/2 animate-pulse rounded bg-slate-200" />
        <div className="h-4 w-1/3 animate-pulse rounded bg-slate-100" />
        <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-slate-100" />
      </div>
    </div>
  );
}

/* ───────────────────────── Book card ───────────────────────── */

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
      className="group flex h-full w-full max-w-[240px] flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-50 p-3">
        {book.coverImage ? (
          <LazyImage
            src={book.coverImage}
            alt={book.title}
            objectFit="contain"
            className="drop-shadow-md transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-amber-100 to-orange-100 p-3">
            <span className="text-center text-sm font-bold text-amber-800 line-clamp-3">
              {book.title}
            </span>
          </div>
        )}

        {/* Stock badge */}
        <div className="absolute right-2 top-2">
          {outOfStock ? (
            <span className="rounded-full bg-slate-800 px-2 py-1 text-[10px] font-bold text-white shadow-sm">
              Out of stock
            </span>
          ) : (
            <span className="rounded-full bg-white px-2 py-1 text-[10px] font-bold text-amber-900 shadow-sm">
              {formatCurrency(price)}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-3">
        <h3 className="line-clamp-2 text-sm font-bold text-slate-900 transition group-hover:text-amber-700">
          {book.title}
        </h3>
        <p className="mt-0.5 line-clamp-1 text-xs text-slate-500">
          {book.author}
        </p>
        <div className="mt-auto pt-3">
          {outOfStock ? (
            <span className="text-sm font-bold text-slate-400">Unavailable</span>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-base font-black text-slate-900">
                {formatCurrency(price)}
              </span>
              <span className="text-[11px] font-medium text-slate-400">
                {stock} in stock
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
