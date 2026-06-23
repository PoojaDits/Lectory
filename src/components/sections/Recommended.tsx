import { useRecommendedBooks } from "@/hooks/useHomeContent";
import SectionHeader from "@/components/ui/SectionHeader";
import BookCarousel from "@/components/ui/BookCarousel";

export default function Recommended() {
  const { data: recommendedBooks = [], isLoading } = useRecommendedBooks();

  return (
    <section id="recommended" className="py-16 md:py-24 bg-white  border-primary-100/60px-12 md:px-16 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
        <SectionHeader
          badge="⭐ Recommended"
          title="Staff picks and reader favorites"
          subtitle="Browse books our team and community love — curated for fresh, reliable recommendations."
          align="left"
        />

        {isLoading ? (
          <div className="flex gap-6 overflow-hidden">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="w-[220px] h-[420px] rounded-3xl bg-primary-100/50 animate-pulse flex-shrink-0" />
            ))}
          </div>
        ) : (
          <BookCarousel books={recommendedBooks} />
        )}
      </div>
    </section>
  );
}
