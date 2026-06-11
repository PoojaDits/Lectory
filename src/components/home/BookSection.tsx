import { useState, useMemo } from "react";
import { useApi } from "../../hooks/useApi";
import {
  fetchFeaturedBooks,
  fetchPreOrderBooks,
  fetchGenres,
  addToCart,
} from "../../lib/api";
import type { Book } from "../../lib/api";

function getDiscount(price: number, original?: number): number | null {
  if (!original || original <= price) return null;
  return Math.round(((original - price) / original) * 100);
}

function BookCard({ book }: { book: Book }) {
  const [wishlisted, setWishlisted] = useState(false);
  const [adding, setAdding] = useState(false);
  const discount = getDiscount(book.price, book.originalPrice);

  const handleAddToCart = async () => {
    setAdding(true);
    try {
      await addToCart(book);
    } catch {
      // silently fail — UI stays responsive
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col">
      {/* Book cover */}
      <div className="relative h-52 sm:h-56 flex items-center justify-center p-6">
        <div
          className={`absolute inset-4 rounded-lg bg-gradient-to-br ${book.coverColor} opacity-90 shadow-lg`}
        />
        <div className="relative z-10 text-center px-3">
          <div className="text-white font-bold text-sm leading-tight line-clamp-2 mb-1">
            {book.title}
          </div>
          <div className="text-white/70 text-xs">{book.author}</div>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-1">
          {book.badge && (
            <span
              className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${book.accentColor}`}
            >
              {book.badge}
            </span>
          )}
          {discount && (
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-green-500 text-white">
              {discount}% OFF
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={() => setWishlisted(!wishlisted)}
          className={`absolute top-3 right-3 z-20 p-1.5 rounded-full transition-all ${
            wishlisted
              ? "bg-red-500 text-white"
              : "bg-white/80 text-gray-400 hover:text-red-500"
          }`}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <svg
            className="w-3.5 h-3.5"
            fill={wishlisted ? "currentColor" : "none"}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
      </div>

      {/* Details */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-sm text-gray-900 line-clamp-1">
          {book.title}
        </h3>
        <p className="text-xs text-gray-500 mt-0.5">{book.author}</p>
        <div className="mt-auto pt-3 flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-bold text-gray-900">
              ₹{book.price}
            </span>
            {book.originalPrice && (
              <span className="text-xs text-gray-400 line-through">
                ₹{book.originalPrice}
              </span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={adding}
            className="px-3 py-1.5 bg-amber-800 hover:bg-amber-700 disabled:opacity-50 text-white text-xs font-medium rounded-full transition-colors"
          >
            {adding ? "..." : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}

function SkeletonGrid({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse"
        >
          <div className="h-52 bg-gray-200" />
          <div className="p-4 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-100 rounded w-1/2" />
            <div className="flex justify-between pt-2">
              <div className="h-5 bg-gray-200 rounded w-16" />
              <div className="h-7 bg-gray-200 rounded-full w-12" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function BookSection() {
  const featuredFetcher = useMemo(() => () => fetchFeaturedBooks(), []);
  const preOrderFetcher = useMemo(() => () => fetchPreOrderBooks(), []);
  const genresFetcher = useMemo(() => () => fetchGenres(), []);

  const { data: featuredBooks, loading: featuredLoading } =
    useApi(featuredFetcher);
  const { data: preOrderBooks, loading: preOrderLoading } =
    useApi(preOrderFetcher);
  const { data: genres, loading: genresLoading } = useApi(genresFetcher);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Featured Books */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Featured Books
            </h2>
            <p className="text-gray-500 mt-1 text-sm">Handpicked for you</p>
          </div>
          <a
            href="/books"
            className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-amber-800 hover:text-amber-600 transition-colors"
          >
            View All
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </a>
        </div>
        {featuredLoading || !featuredBooks ? (
          <SkeletonGrid count={8} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </section>

      {/* Pre-Orders */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Pre-Orders
            </h2>
            <p className="text-gray-500 mt-1 text-sm">
              Reserve upcoming releases
            </p>
          </div>
          <a
            href="/pre-orders"
            className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-amber-800 hover:text-amber-600 transition-colors"
          >
            View All
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </a>
        </div>
        {preOrderLoading || !preOrderBooks ? (
          <SkeletonGrid count={4} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {preOrderBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </section>

      {/* Genre Categories */}
      <section>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
          Browse by Genre
        </h2>
        {genresLoading || !genres ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-32 rounded-xl bg-gray-200 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {genres.map((genre) => (
              <a
                key={genre.name}
                href={`/genres/${genre.name.toLowerCase()}`}
                className={`group relative overflow-hidden rounded-xl bg-gradient-to-br ${genre.color} p-5 h-32 flex flex-col items-center justify-center text-center hover:scale-105 transition-transform`}
              >
                <span className="text-3xl mb-2 drop-shadow">{genre.icon}</span>
                <span className="text-white font-semibold text-sm">
                  {genre.name}
                </span>
              </a>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
