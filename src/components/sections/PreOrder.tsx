import { ArrowRight } from "lucide-react";
import { useBookStore } from "@/stores/useBookStore";
import SectionHeader from "@/components/ui/SectionHeader";
import BookCarousel from "@/components/ui/BookCarousel";

export default function PreOrder() {
  const { preOrders, isLoading } = useBookStore();

  return (
    <section id="preorder" className="py-16 md:py-24 bg-white border-t border-amber-100/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <SectionHeader
            badge="🚀 Preorder"
            title="Reserve upcoming releases today"
            subtitle="Secure your copy before launch with exclusive preorder prices and early delivery."
            align="left"
            className="max-w-2xl mb-0"
          />
          <button className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-gray-900/10 transition-all hover:bg-gray-800 fancy-btn">
            View Full Preorder Collection
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {isLoading ? (
          <div className="flex gap-6 overflow-hidden">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="w-[220px] h-[380px] rounded-3xl bg-amber-100/50 animate-pulse flex-shrink-0" />
            ))}
          </div>
        ) : (
          <BookCarousel books={preOrders} />
        )}
      </div>
    </section>
  );
}
