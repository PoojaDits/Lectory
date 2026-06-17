import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { cn } from "@/utils/cn";
import { formatCurrency } from "@/utils/helpers";
import type { BookWithListings } from "@/types";

interface BookCardProps {
  book: BookWithListings;
  className?: string;
}

export default function BookCard({ book, className }: BookCardProps) {
  const outOfStock = !book.inStock;

  return (
    <Link
      to={`/books/${book.id}`}
      className={cn(
        "group flex flex-col rounded-2xl overflow-hidden bg-white border border-slate-100 h-full w-full max-w-[320px]",
        "transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5",
        className
      )}
    >
      {/* Book Cover */}
      <div className="relative aspect-[3/4] bg-slate-100 overflow-hidden">
        {book.coverImage ? (
          <img
            src={book.coverImage}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-100 to-orange-100">
            <span className="text-amber-800 font-bold text-lg text-center px-4">
              {book.title}
            </span>
          </div>
        )}

        {/* Stock / Price Badge */}
        <div className="absolute top-3 right-3">
          {outOfStock ? (
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-slate-800 text-white">
              Out of stock
            </span>
          ) : book.bestPrice != null ? (
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-white shadow text-amber-900">
              {formatCurrency(book.bestPrice)}
            </span>
          ) : null}
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
          <span className="px-5 py-2 rounded-full bg-white text-sm font-semibold text-slate-900 shadow">
            View Details
          </span>
        </div>
      </div>

      {/* Book Info */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-slate-900 line-clamp-2 group-hover:text-amber-700 transition">
          {book.title}
        </h3>
        <p className="text-sm text-slate-500 mt-0.5 line-clamp-1">{book.author}</p>

        {/* Rating */}
        {book.rating != null && (
          <div className="flex items-center gap-1 mt-2">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="text-sm text-slate-600 font-medium">{book.rating.toFixed(1)}</span>
          </div>
        )}

        {/* Footer */}
        <div className="mt-auto pt-3 flex items-center justify-between text-sm">
          {outOfStock ? (
            <span className="text-slate-400 font-medium">Unavailable</span>
          ) : (
            <>
              <span className="font-bold text-slate-900">
                {book.bestPrice ? formatCurrency(book.bestPrice) : "—"}
              </span>
              <span className="text-xs text-slate-500">
                {book.sellerCount} seller{book.sellerCount !== 1 && "s"}
              </span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
