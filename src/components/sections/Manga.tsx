import { useMangaBooks } from "@/hooks/useHomeContent";
import SectionHeader from "@/components/ui/SectionHeader";
import BookCarousel from "@/components/ui/BookCarousel";

export default function Manga() {
  const { data: mangaBooks = [], isLoading } = useMangaBooks();

  return (
    <section id="manga" className="py-16 md:py-24 section-bg border-t border-amber-100/60">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="📚 Manga"
          title="Explore the latest manga releases"
          subtitle="From action-packed adventures to heartfelt dramas, discover manga stories that keep you turning pages."
          align="left"
        />

        {isLoading ? (
          <div className="flex gap-6 overflow-hidden">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="w-[220px] h-[420px] rounded-3xl bg-amber-100/50 animate-pulse flex-shrink-0" />
            ))}
          </div>
        ) : (
          <BookCarousel books={mangaBooks} />
        )}
      </div>
    </section>
  );
}
