import { Star, Quote } from "lucide-react";
import { useBookStore } from "@/stores/useBookStore";
import SectionHeader from "@/components/ui/SectionHeader";
import Skeleton from "@/components/ui/Skeleton";

export default function Testimonials() {
  const { testimonials, isLoading } = useBookStore();

  return (
    <section className="py-16 md:py-24 bg-white border-t border-amber-100/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="💬 Testimonials"
          badgeClass="bg-purple-50 text-purple-600"
          title="Loved by Readers"
          subtitle="Join thousands of happy readers who found their next favorite book through us."
        />

        {isLoading ? (
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="bg-white rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-amber-100 relative"
              >
                <Quote className="absolute top-6 right-6 w-8 h-8 text-amber-100" />
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star
                      key={j}
                      className="w-4 h-4 text-amber-400 fill-amber-400"
                    />
                  ))}
                </div>
                <p className="text-gray-600 leading-relaxed mb-6">{t.text}</p>
                <div className="flex items-center gap-3 pt-4 border-t border-amber-50">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center text-2xl">
                    {t.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{t.name}</h4>
                    <p className="text-gray-400 text-sm">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
