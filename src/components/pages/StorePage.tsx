import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  MapPin,
  Search,
  Store as StoreIcon,
  Users,
} from "lucide-react";
import { useStores } from "@/hooks/useStore";
import LazyImage from "@/components/ui/LazyImage";
import type { Store } from "@/types";

interface StoresPageProps {
  onNavigateHome: () => void;
}

/** Deterministic amber-ish gradient from a store name, for the logo backdrop. */
function gradientFor(name: string): string {
  const palettes = [
    "from-amber-500 to-orange-600",
    "from-rose-500 to-pink-600",
    "from-emerald-500 to-teal-600",
    "from-indigo-500 to-blue-600",
    "from-violet-500 to-purple-600",
    "from-cyan-500 to-sky-600",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return palettes[Math.abs(hash) % palettes.length];
}

/** Up to two leading initials, for stores without a logo image. */
function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

export default function StoresPage({ onNavigateHome }: StoresPageProps) {
  const { data: stores = [], isLoading, isError } = useStores();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return stores;
    return stores.filter(
      (s) =>
        s.businessName.toLowerCase().includes(q) ||
        (s.tagline ?? "").toLowerCase().includes(q) ||
        (s.location ?? "").toLowerCase().includes(q)
    );
  }, [stores, query]);

  return (
    <main className="min-h-screen bg-slate-50 px-4 pb-20 pt-24">
      <div className="mx-auto max-w-8xl">
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
              Bookstores on Lectory
            </h1>
            <p className="mt-2 text-slate-600">
              Browse our marketplace of independent sellers and discover the books
              each one has to offer.
            </p>
          </div>

          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search stores..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
            />
          </div>
        </div>

        {/* States */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm"
              >
                <div className="h-28 w-full animate-pulse bg-slate-200" />
                <div className="space-y-3 p-5">
                  <div className="h-5 w-2/3 animate-pulse rounded bg-slate-200" />
                  <div className="h-3 w-1/2 animate-pulse rounded bg-slate-100" />
                  <div className="h-3 w-full animate-pulse rounded bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="rounded-full bg-red-50 p-6">
              <StoreIcon className="h-10 w-10 text-red-400" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-slate-900">
              Couldn't load stores
            </h3>
            <p className="mt-2 text-slate-500">
              Please check your connection and try again.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="rounded-full bg-slate-100 p-6">
              <StoreIcon className="h-10 w-10 text-slate-400" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-slate-900">
              {query ? "No stores match your search" : "No stores yet"}
            </h3>
            <p className="mt-2 text-slate-500">
              {query
                ? "Try a different keyword."
                : "Check back soon — new sellers are joining all the time."}
            </p>
          </div>
        ) : (
          <>
            <p className="mb-4 text-sm font-medium text-slate-500">
              {filtered.length} store{filtered.length !== 1 && "s"} available
            </p>
            <div className="grid grid-cols-1 gap-30 sm:grid-cols-2 lg:grid-cols-2 p-20">
              {filtered.map((store) => (
                <StoreCard key={String(store.id)} store={store} />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}

function StoreCard({ store }: { store: Store }) {
  const gradient = gradientFor(store.businessName);

  return (
    <Link
      to={`/stores/${store.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
    >
      {/* Banner with logo */}
      <div className={`relative h-28 w-full bg-gradient-to-br ${gradient}`}>
        <div className="absolute inset-0 bg-black/5" />
        {store.logo ? (
          <LazyImage
            src={store.logo}
            alt={store.businessName}
            objectFit="cover"
            className="opacity-90 transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <StoreIcon className="h-10 w-10 text-white/70" />
          </div>
        )}

        {/* Book count badge */}
        <span className="absolute right-3 top-3 z-10 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-amber-800 shadow-sm backdrop-blur">
          <BookOpen className="h-3 w-3" />
          {store.bookCount} {store.bookCount === 1 ? "book" : "books"}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div
            className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-base font-black text-white shadow-md ring-2 ring-white`}
          >
            {initialsOf(store.businessName)}
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-lg font-bold text-slate-900 group-hover:text-amber-700">
              {store.businessName}
            </h3>
            {store.tagline && (
              <p className="truncate text-xs font-medium text-amber-600">
                {store.tagline}
              </p>
            )}
          </div>
        </div>

        {store.description && (
          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-600">
            {store.description}
          </p>
        )}

        {/* Meta */}
        <div className="mt-auto flex items-center justify-between pt-4 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1 font-semibold text-amber-700">
            <Users className="h-3.5 w-3.5" />
            {store.contactPerson}
          </span>
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {store.location ?? "India"}
          </span>
        </div>

        <span className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-900 px-4 py-2.5 text-sm font-bold text-white transition group-hover:bg-amber-800">
          Visit Store
        </span>
      </div>
    </Link>
  );
}
