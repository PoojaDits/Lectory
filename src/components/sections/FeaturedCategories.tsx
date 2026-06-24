import { Link } from "react-router-dom";
import {
  BookOpen,
  Cpu,
  Rocket,
  Star,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { CATEGORY_META } from "@/lib/categories";
import { useStoreBooks } from "@/hooks/useHomeContent";
import SectionHeader from "@/components/ui/SectionHeader";
import Skeleton from "@/components/ui/Skeleton";

const ICON_MAP: Record<string, LucideIcon> = {
  TrendingUp,
  Star,
  Cpu,
  BookOpen,
  Rocket,
};

export default function FeaturedCategories() {
  // Fetch all books once so we can show the *real* count per category.
  const { data: books = [], isLoading } = useStoreBooks();

  // Live count per category tag.
  const countFor = (tag: string) =>
    books.filter((b) => (b.categories ?? []).includes(tag)).length;

  return (
    <section id="categories" className="py-16 md:py-24 bg-primary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="📚 Browse by Category"
          title="Find Your Perfect Genre"
          subtitle="From page-turning bestsellers to cutting-edge AI books — pick a genre and explore the relevant titles."
        />

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 ">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-44 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 px-12 md:px-16">
            {CATEGORY_META.map((cat) => {
              const Icon = ICON_MAP[cat.icon] || BookOpen;
              const count = countFor(cat.tag);
              return (
                <Link
                  key={cat.tag}
                  to={`/browse?category=${cat.tag}`}
                  className={`group relative ${cat.bg} rounded-2xl p-6 md:p-8 text-center hover:shadow-2xl ${cat.shadow} transition-all duration-300 hover:-translate-y-2 border border-white/80 overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div
                    className={`relative inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br ${cat.gradient} shadow-lg ${cat.shadow} mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 z-10`}
                  >
                    <Icon className="w-7 h-7 md:w-8 md:h-8 text-white group-hover:animate-pulse" />
                  </div>
                  <h3 className="relative text-gray-900 font-bold text-base md:text-lg mb-1 z-10 group-hover:text-primary-900 transition-colors">
                    {cat.label}
                  </h3>
                  <p className="relative text-gray-500 text-sm z-10 group-hover:text-gray-700 transition-colors">{count} books</p>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
