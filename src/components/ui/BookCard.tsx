import { ShoppingCart, Star } from "lucide-react";
import { cn } from "@/utils/cn";

export interface Book {
  id: number;
  title: string;
  author: string;
  price: number;
  originalPrice?: number;
  coverColor?: string;   // Tailwind gradient classes e.g. "from-indigo-600 to-blue-700"
  accentColor?: string;  // Badge classes e.g. "bg-indigo-100 text-indigo-800"
  badge?: string;
  image?: string;
  rating?: number;
}

interface BookCardProps {
  book: Book;
  className?: string;
}

export default function BookCard({ book, className }: BookCardProps) {
  const discount = book.originalPrice
    ? Math.round((1 - book.price / book.originalPrice) * 100)
    : null;

  return (
    <article
      className={cn(
        "group flex flex-col rounded-2xl overflow-hidden bg-white h-full",
        "shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1",
        className
      )}
    >
      {/* Cover - takes most of the fixed height */}
      <div className="relative aspect-[3/4] overflow-hidden flex-shrink-0">
        {book.image ? (
          <img
            src={book.image}
            alt={book.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div
            className={cn(
              "w-full h-full flex items-end p-4 bg-gradient-to-br",
              book.coverColor ?? "from-amber-500 to-orange-600"
            )}
          >
            {/* Decorative book spine lines */}
            <div className="absolute inset-0 flex flex-col justify-center items-center gap-2 px-6 opacity-80">
              <p className="text-white font-bold text-center text-sm md:text-base leading-snug line-clamp-4 drop-shadow">
                {book.title}
              </p>
              <p className="text-white/80 text-xs text-center">{book.author}</p>
            </div>
          </div>
        )}

        {/* Badge */}
        {book.badge && (
          <span
            className={cn(
              "absolute top-3 left-3 px-2.5 py-1 text-xs font-bold rounded-full shadow",
              book.accentColor ?? "bg-amber-100 text-amber-800"
            )}
          >
            {book.badge}
          </span>
        )}

        {/* Discount badge */}
        {discount && (
          <span className="absolute top-3 right-3 px-2.5 py-1 text-xs font-bold rounded-full bg-red-500 text-white shadow">
            -{discount}%
          </span>
        )}

        {/* Add to cart overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100">
          <button
            aria-label={`Add ${book.title} to cart`}
            className="flex items-center gap-2 px-4 py-2 bg-white text-gray-900 font-semibold text-sm rounded-full shadow-lg hover:bg-amber-500 hover:text-white transition-colors duration-200"
          >
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-3 md:p-4 flex flex-col gap-1 flex-1 min-h-0 overflow-hidden">
        <h3 className="font-bold text-gray-900 text-sm md:text-base leading-snug line-clamp-2 group-hover:text-amber-700 transition-colors">
          {book.title}
        </h3>
        <p className="text-gray-400 text-xs md:text-sm">{book.author}</p>

        {/* Rating */}
        {book.rating && (
          <div className="flex items-center gap-1 mt-0.5">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="text-xs text-gray-500">{book.rating.toFixed(1)}</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 mt-auto pt-2">
          <span className="font-bold text-gray-900 text-sm md:text-base">
            ₹{book.price.toLocaleString("en-IN")}
          </span>
          {book.originalPrice && (
            <span className="text-gray-400 text-xs line-through">
              ₹{book.originalPrice.toLocaleString("en-IN")}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
