import { usePreOrders } from "@/hooks/useHomeContent";
import SectionHeader from "@/components/ui/SectionHeader";
import BookCarousel from "@/components/ui/BookCarousel";
export default function PreOrder() {
  const { data: preOrders = [], isLoading } = usePreOrders();
  return (
    <section id="preorder" className="py-16 md:py-24 bg-white border-t border-primary-100/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <SectionHeader
            badge="🚀 Preorder"
            title="Reserve upcoming releases today"
            subtitle="Secure your copy before launch with exclusive preorder prices and early delivery."
            align="left"
            className="max-w-2xl mb-0"
          />
        </div>
        {isLoading ? (
          <div className="flex gap-6 overflow-hidden">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="w-[220px] h-[380px] rounded-3xl bg-primary-100/50 animate-pulse flex-shrink-0" />
            ))}
          </div>
        ) : (
          <BookCarousel books={preOrders} />
        )}
      </div>
    </section>
  );
}
