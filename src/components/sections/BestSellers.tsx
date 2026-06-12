import { useBookStore } from "@/stores/useBookStore";
import SectionHeader from "@/components/ui/SectionHeader";
import BookCard from "@/components/ui/BookCard";
import Skeleton from "@/components/ui/Skeleton";

export default function BestSellers() {
  const { bestSellers, isLoading } = useBookStore();

  return (
    <section id="best-sellers" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="🔥 Best Sellers"
          title="Books everyone is buying right now"
          subtitle="Shop the top-selling titles across genres, carefully selected for readers who want the latest and greatest."
          align="left"
        />

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-[28rem] rounded-3xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
