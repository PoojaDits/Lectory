import { useBookStore } from "@/stores/useBookStore";
import SectionHeader from "@/components/ui/SectionHeader";
import BookCarousel from "@/components/ui/BookCarousel";

export default function ArtificialIntelligence() {
  const { aiBooks, isLoading } = useBookStore();

  return (
    <section id="ai-books" className="py-16 md:py-24 bg-white border-t border-amber-100/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="🤖 AI Books"
          title="Top books on artificial intelligence"
          subtitle="Stay ahead in tech with the best reads on AI, machine learning, and intelligent systems."
          align="left"
        />

        {isLoading ? (
          <div className="flex gap-6 overflow-hidden">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="w-[220px] h-[420px] rounded-3xl bg-amber-100/50 animate-pulse flex-shrink-0" />
            ))}
          </div>
        ) : (
          <BookCarousel books={aiBooks} />
        )}
      </div>
    </section>
  );
}
