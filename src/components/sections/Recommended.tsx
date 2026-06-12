import { useBookStore } from "@/stores/useBookStore";
import SectionHeader from "@/components/ui/SectionHeader";
import BookCard from "@/components/ui/BookCard";
import Skeleton from "@/components/ui/Skeleton";

export default function Recommended() {
  const { recommendedBooks, isLoading } = useBookStore();

  return (
    <section id="recommended" className="py-16 md:py-24 bg-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="⭐ Recommended"
          title="Staff picks and reader favorites"
          subtitle="Browse books our team and community love — curated for fresh, reliable recommendations."
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
            {recommendedBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
