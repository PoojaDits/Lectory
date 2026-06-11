import {
  BookOpen,
  Heart,
  Lightbulb,
  GraduationCap,
  Rocket,
  Palette,
  type LucideIcon,
} from "lucide-react";
import { useBookStore } from "@/stores/useBookStore";
import SectionHeader from "@/components/ui/SectionHeader";
import Skeleton from "@/components/ui/Skeleton";

const ICON_MAP: Record<string, LucideIcon> = {
  BookOpen,
  Heart,
  Lightbulb,
  GraduationCap,
  Rocket,
  Palette,
};

export default function FeaturedCategories() {
  const { categories, isLoading } = useBookStore();

  return (
    <section id="categories" className="py-16 md:py-24 bg-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="📚 Browse by Category"
          title="Find Your Perfect Genre"
          subtitle="From page-turning thrillers to soul-stirring poetry, we have every genre covered for every mood."
        />

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-44 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {categories.map((cat) => {
              const Icon = ICON_MAP[cat.icon] || BookOpen;
              return (
                <button
                  key={cat.id}
                  className={`group relative ${cat.bg} rounded-2xl p-6 md:p-8 text-center hover:shadow-xl ${cat.shadow} transition-all duration-300 hover:-translate-y-2 border border-white/60`}
                >
                  <div
                    className={`inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br ${cat.gradient} shadow-lg ${cat.shadow} mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-7 h-7 md:w-8 md:h-8 text-white" />
                  </div>
                  <h3 className="text-gray-900 font-bold text-base md:text-lg mb-1">
                    {cat.name}
                  </h3>
                  <p className="text-gray-400 text-sm">{cat.count} books</p>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
