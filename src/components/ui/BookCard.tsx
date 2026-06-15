import { Link } from "react-router-dom";
import { Star, Users } from "lucide-react";
import { cn } from "@/utils/cn";
import { formatCurrency } from "@/utils/helpers";
import type { BookWithListings } from "@/types";

interface BookCardProps {
  book: BookWithListings;
  className?: string;
}

/**
 * Storefront card for a real marketplace book. Shows the (Open Library) cover,
 * a "From ₹X" best-price derived from the book's seller listings, and the
 * number of competing sellers. Clicking opens the book details page, where the
 * customer selects a seller before adding to cart (per spec).
 */
export default function BookCard({ book, className }: BookCardProps) {
  const outOfStock = !book.inStock;

  return (
    <Link
      to={`/books/${book.id}`}
      className={cn(
        "group flex flex-col rounded-2xl overflow-hidden bg-white h-full",
        "shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1",
        className
      )}
    >
      {/* Cover */}
      <div className="relative aspect-[3/4] overflow-hidden flex-shrink-0 bg-slate-100">
        {book.coverImage ? (
          <img
            src={book.coverImage}
            alt={book.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-end p-4 bg-gradient-to-br from-amber-500 to-orange-600">
            <p className="text-white font-bold text-center text-sm leading-snug drop-shadow">
              {book.title}
            </p>
          </div>
        )}

        {/* Seller count badge */}
        {book.sellerCount > 0 && (
          <span className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-full bg-white/90 text-amber-800 shadow">
            <Users className="w-3 h-3" />
            {book.sellerCount} {book.sellerCount === 1 ? "seller" : "sellers"}
          </span>
        )}

        {/* Out-of-stock / price badge */}
        {outOfStock ? (
          <span className="absolute top-3 right-3 px-2.5 py-1 text-xs font-bold rounded-full bg-slate-700 text-white shadow">
            Out of stock
          </span>
        ) : (
          book.bestPrice != null && (
            <span className="absolute top-3 right-3 px-2.5 py-1 text-xs font-bold rounded-full bg-amber-500 text-white shadow">
              From {formatCurrency(book.bestPrice)}
            </span>
          )
        )}

        {/* View-details overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100">
          <span className="flex items-center gap-2 px-4 py-2 bg-white text-gray-900 font-semibold text-sm rounded-full shadow-lg group-hover:bg-amber-500 group-hover:text-white transition-colors duration-200">
            View Details
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-3 md:p-4 flex flex-col gap-1 flex-1 min-h-0 overflow-hidden">
        <h3 className="font-bold text-gray-900 text-sm md:text-base leading-snug line-clamp-2 group-hover:text-amber-700 transition-colors">
          {book.title}
        </h3>
        <p className="text-gray-400 text-xs md:text-sm line-clamp-1">
          {book.author}
        </p>

        {/* Rating */}
        {book.rating != null && (
          <div className="flex items-center gap-1 mt-0.5">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="text-xs text-gray-500">
              {book.rating.toFixed(1)}
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 mt-auto pt-2">
          {outOfStock ? (
            <span className="text-sm font-bold text-slate-400">
              Unavailable
            </span>
          ) : (
            book.bestPrice != null && (
              <>
                <span className="font-bold text-gray-900 text-sm md:text-base">
                  From {formatCurrency(book.bestPrice)}
                </span>
                <span className="text-gray-400 text-xs">
                  by {book.sellerCount} {book.sellerCount === 1 ? "seller" : "sellers"}
                </span>
              </>
            )
          )}
        </div>
      </div>
    </Link>
  );
}
