import { useBestSellers } from "@/hooks/useHomeContent";
import SectionHeader from "@/components/ui/SectionHeader";
import BookCarousel from "@/components/ui/BookCarousel";

export default function BestSellers() {
  const { data: bestSellers = [], isLoading } = useBestSellers();

  return (
    <section id="best-sellers" className="py-16 md:py-24 section-bg border-t border-primary-100/60 md:px-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="🔥 Best Sellers"
          title="Books everyone is buying right now"
          subtitle="Shop the top-selling titles across genres, carefully selected for readers who want the latest and greatest."
          align="left"
        />

        {isLoading ? (
          <div className="flex gap-6 overflow-hidden">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="w-[220px] h-[420px] rounded-3xl bg-primary-100/50 animate-pulse flex-shrink-0" />
            ))}
          </div>
        ) : (
          <BookCarousel books={bestSellers} />
        )}
      </div>
    </section>
  );
}
