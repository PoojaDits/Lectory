import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  ChevronRight,
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

/** Deterministic gradient from a store name */
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

/** Up to two leading initials */
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
    <main className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-orange-50 pb-24 pt-24 relative">
      {/* Decorative BG Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-orange-200/30 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3" />
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-yellow-100/40 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ── Hero Header ── */}
        <div className="mb-12">
          <button
            type="button"
            onClick={onNavigateHome}
            className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-primary-800 transition hover:text-primary-600 group"
          >
            <span className="flex items-center justify-center h-7 w-7 rounded-full bg-primary-100 group-hover:bg-primary-200 transition">
              <ArrowLeft className="h-3.5 w-3.5" />
            </span>
            Back to Home
          </button>

          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-100/80 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary-800">
                <StoreIcon className="h-3.5 w-3.5" />
                Marketplace
              </div>
              <h1 className="text-4xl font-black tracking-tight text-secondary-900 sm:text-5xl lg:text-6xl">
                Bookstores on{" "}
                <span className="bg-gradient-to-r from-primary-600 to-orange-500 bg-clip-text text-transparent">
                  Lectory
                </span>
              </h1>
              <p className="mt-3 max-w-xl text-base text-slate-500 leading-relaxed">
                Browse our curated marketplace of independent sellers and discover the
                books each one has to offer.
              </p>
            </div>

            {/* Stats pill */}
            {!isLoading && !isError && (
              <div className="flex items-center gap-4 rounded-2xl border border-primary-100 bg-white/80 px-6 py-4 shadow-sm backdrop-blur">
                <div className="text-center">
                  <p className="text-2xl font-black text-primary-700">{stores.length}</p>
                  <p className="text-xs font-semibold text-slate-500">Stores</p>
                </div>
                <div className="h-10 w-px bg-primary-100" />
                <div className="text-center">
                  <p className="text-2xl font-black text-primary-700">
                    {stores.reduce((acc, s) => acc + (s.bookCount ?? 0), 0)}
                  </p>
                  <p className="text-xs font-semibold text-slate-500">Books</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Search Bar ── */}
        <div className="mb-8 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, location or tagline..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-2xl border border-secondary-200 bg-white py-3.5 pl-11 pr-4 text-sm shadow-sm outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-primary-100 placeholder:text-slate-400"
            />
          </div>
          {!isLoading && !isError && filtered.length > 0 && (
            <p className="hidden sm:block text-sm font-semibold text-slate-400">
              {filtered.length} store{filtered.length !== 1 && "s"} found
            </p>
          )}
        </div>

        {/* ── States ── */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="overflow-hidden rounded-3xl border border-secondary-100 bg-white shadow-sm">
                <div className="h-36 w-full animate-pulse bg-gradient-to-r from-secondary-100 to-secondary-200" />
                <div className="space-y-3 p-6 pt-10">
                  <div className="h-5 w-2/3 animate-pulse rounded-lg bg-secondary-200" />
                  <div className="h-3 w-1/2 animate-pulse rounded bg-secondary-100" />
                  <div className="h-3 w-full animate-pulse rounded bg-secondary-100" />
                  <div className="h-10 w-full animate-pulse rounded-xl bg-secondary-100" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <div className="rounded-full bg-red-50 p-8 shadow-inner">
              <StoreIcon className="h-12 w-12 text-red-400" />
            </div>
            <h3 className="mt-5 text-xl font-bold text-secondary-900">Couldn't load stores</h3>
            <p className="mt-2 text-slate-500">Please check your connection and try again.</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <div className="rounded-full bg-primary-50 p-8 shadow-inner">
              <StoreIcon className="h-12 w-12 text-amber-400" />
            </div>
            <h3 className="mt-5 text-xl font-bold text-secondary-900">
              {query ? "No stores match your search" : "No stores yet"}
            </h3>
            <p className="mt-2 text-slate-500">
              {query ? "Try a different keyword." : "Check back soon — new sellers are joining all the time."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((store) => (
              <StoreCard key={String(store.id)} store={store} />
            ))}
          </div>
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
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/80 bg-white shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-primary-900/10"
    >
      {/* Coloured Banner */}
      <div className={`relative h-36 w-full bg-gradient-to-br ${gradient} overflow-hidden`}>
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "30px 30px" }}
        />
        <div className="absolute inset-0 bg-black/10" />

        {store.logo ? (
          <LazyImage
            src={store.logo}
            alt={store.businessName}
            objectFit="cover"
            className="opacity-80 transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <StoreIcon className="h-14 w-14 text-white/30" />
          </div>
        )}

        {/* Book count badge */}
        <span className="absolute right-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-full bg-black/30 px-3 py-1.5 text-[11px] font-bold text-white backdrop-blur-sm">
          <BookOpen className="h-3 w-3" />
          {store.bookCount} {store.bookCount === 1 ? "book" : "books"}
        </span>
      </div>

      {/* Floating Avatar — overlaps the banner */}
      <div className="relative px-5">
        <div
          className={`absolute -top-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} text-lg font-black text-white shadow-lg ring-4 ring-white transition-transform duration-300 group-hover:scale-110`}
        >
          {initialsOf(store.businessName)}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col px-5 pb-5 pt-10">
        <h3 className="text-lg font-black text-secondary-900 group-hover:text-primary-700 transition-colors leading-tight">
          {store.businessName}
        </h3>

        {store.tagline && (
          <p className="mt-0.5 text-xs font-semibold text-primary-600 line-clamp-1">
            {store.tagline}
          </p>
        )}

        {store.description && (
          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-500">
            {store.description}
          </p>
        )}

        {/* Meta row */}
        <div className="mt-4 flex items-center gap-4 text-xs text-slate-400 font-medium">
          <span className="inline-flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-amber-500" />
            {store.contactPerson}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-amber-500" />
            {store.location ?? "India"}
          </span>
        </div>

        {/* CTA Button */}
        <div className="mt-5">
          <span
            className={`inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r ${gradient} px-4 py-3 text-sm font-bold text-white shadow-md transition-all duration-300 group-hover:shadow-lg group-hover:brightness-105`}
          >
            Visit Store
            <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
