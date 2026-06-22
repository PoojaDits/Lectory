import { ArrowRight } from "lucide-react";
import { useNewArrivals } from "@/hooks/useHomeContent";
import Skeleton from "@/components/ui/Skeleton";
import LazyImage from "../ui/LazyImage";

const HIGHLIGHTS = [
  { num: "1", title: "Weekly Updates", desc: "New titles added every Tuesday and Friday" },
  { num: "2", title: "Pre-Order Discounts", desc: "Save up to 30% when you pre-order upcoming releases" },
  { num: "3", title: "Signed Editions", desc: "Exclusive signed copies from featured authors" },
];

export default function NewArrivals() {
  const { data: newArrivals = [], isLoading } = useNewArrivals();

  return (
    <section
      id="new-arrivals"
      className="py-16 md:py-24 bg-gradient-to-b from-white to-primary-50"
    >
      <div className="max-w-7xl  px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div>
            <span className="inline-block px-4 py-1.5 bg-emerald-50 text-emerald-600 text-sm font-semibold rounded-full mb-4">
              ✨ Just In
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-5 leading-tight">
              Fresh Off the Press
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed mb-8 max-w-lg">
              Be the first to explore our latest additions. From debut authors to
              long-awaited sequels, these titles are making waves in the literary
              world.
            </p>

            <div className="space-y-4 mb-8">
              {HIGHLIGHTS.map((h) => (
                <div key={h.num} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary-600 font-bold text-sm">{h.num}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{h.title}</h4>
                    <p className="text-gray-500 text-sm">{h.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <button className="inline-flex items-center gap-2 px-8 py-3.5 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-full transition-all hover:scale-105 shadow-lg shadow-gray-900/20">
              Explore New Arrivals
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Right — Book Grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 gap-4 md:gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className={`aspect-[3/4] rounded-2xl ${i % 2 === 1 ? "mt-6" : ""}`}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:gap-6">
              {newArrivals.map((book, i) => (
                <div
                  key={book.id}
                  className={`group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 ${
                    i % 2 === 1 ? "mt-6" : ""
                  }`}
                >
                  <div className="aspect-[3/4] bg-secondary-50 p-4">
                    <div className="relative w-70% h-full">
                      <LazyImage
                        src={book.image}
                        alt={book.title}
                        objectFit="contain"
                        className="drop-shadow-lg transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <h4 className="text-white font-bold text-sm md:text-base">
                      {book.title}
                    </h4>
                    <p className="text-white/70 text-xs md:text-sm">{book.author}</p>
                    <p className="text-amber-400 font-bold mt-1">
                      ${book.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
