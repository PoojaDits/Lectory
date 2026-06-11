import { useEffect } from "react";
import { useBookStore } from "@/stores/useBookStore";
import { useAutoSlider } from "@/hooks/useAutoSlider";
import { useCardsPerView } from "@/hooks/useCardsPerView";
import BookCard from "@/components/ui/BookCard";
import SliderArrow from "@/components/ui/SliderArrow";
import { BookCardSkeleton } from "@/components/ui/Skeleton";

export default function Bestsellers() {
  const { bestsellers, isLoading } = useBookStore();
  const cardsPerView = useCardsPerView();
  const totalPages = Math.ceil(bestsellers.length / cardsPerView);

  const { current, goTo, next, prev, pause, resume } = useAutoSlider({
    totalItems: totalPages,
    interval: 4000,
  });

  // Reset to first page when cards-per-view changes
  useEffect(() => {
    if (current >= totalPages && totalPages > 0) goTo(0);
  }, [cardsPerView, totalPages, current, goTo]);

  const cardWidth = 100 / cardsPerView;
  const translateX = current * cardsPerView * cardWidth;

  return (
    <section id="bestsellers" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 md:mb-14">
          <div>
            <span className="inline-block px-4 py-1.5 bg-red-50 text-red-600 text-sm font-semibold rounded-full mb-4">
              🔥 Trending Now
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3">
              Bestselling Books
            </h2>
            <p className="text-gray-500 text-lg max-w-lg">
              The most loved books of the season, curated by our expert readers.
            </p>
          </div>

          <div className="flex items-center gap-3 mt-6 md:mt-0">
            <SliderArrow direction="left" onClick={prev} variant="outline" />
            <SliderArrow direction="right" onClick={next} variant="outline" />
            <button className="hidden sm:inline-flex ml-2 px-6 py-3 border-2 border-amber-600 text-amber-700 hover:bg-amber-600 hover:text-white font-semibold rounded-full transition-all">
              View All →
            </button>
          </div>
        </div>

        {/* Slider Track */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <BookCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div
            className="relative overflow-hidden"
            onMouseEnter={pause}
            onMouseLeave={resume}
          >
            <div
              className="flex transition-transform ease-in-out"
              style={{
                transform: `translateX(-${translateX}%)`,
                transitionDuration: "600ms",
              }}
            >
              {bestsellers.map((book) => (
                <div
                  key={book.id}
                  className="flex-shrink-0 px-2 md:px-3"
                  style={{ width: `${cardWidth}%` }}
                >
                  <BookCard book={book} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dots */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Page ${i + 1}`}
              className={`rounded-full transition-all duration-500 ${
                current === i
                  ? "w-10 h-3 bg-amber-500 shadow-md shadow-amber-300/50"
                  : "w-3 h-3 bg-gray-200 hover:bg-gray-300"
              }`}
            />
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="sm:hidden flex justify-center mt-8">
          <button className="px-6 py-3 border-2 border-amber-600 text-amber-700 hover:bg-amber-600 hover:text-white font-semibold rounded-full transition-all">
            View All Bestsellers →
          </button>
        </div>
      </div>
    </section>
  );
}
