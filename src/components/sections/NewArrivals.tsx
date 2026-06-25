import { useRef } from "react";
import {
  ArrowRight,
  BadgePercent,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  PenLine,
  Sparkles,
} from "lucide-react";
import { useRecommendedBooks } from "@/hooks/useHomeContent";
import BookCard from "@/components/ui/BookCard";
import BookCarousel from "../ui/BookCarousel";

const HIGHLIGHTS = [
  {
    icon: CalendarDays,
    title: "Weekly Updates",
    desc: "New titles added every Tuesday and Friday",
  },
  {
    icon: BadgePercent,
    title: "Pre-Order Discounts",
    desc: "Save more on upcoming releases",
  },
  {
    icon: PenLine,
    title: "Signed Editions",
    desc: "Exclusive copies from featured authors",
  },
];

export default function NewArrivals() {
  const { data: books = [], isLoading } = useRecommendedBooks();
  const newArrivals = books.slice(0, 8);
  const carouselRef = useRef<HTMLDivElement | null>(null);

  const scrollToPreorder = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById("preorder")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="new-arrivals"
      className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-orange-50 py-12 md:py-20 px-4 sm:px-6 lg:px-8"
    >
      {/* Background glow effects */}
      <div className="pointer-events-none absolute -left-32 top-10 h-80 w-80 rounded-full bg-amber-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-10 h-96 w-96 rounded-full bg-emerald-200/40 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        {/* Modernized Section Header */}
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white px-4 py-1.5 text-xs font-black uppercase tracking-wider text-amber-700 shadow-sm">
            <Sparkles className="h-3.5 w-3.5" />
            Just Arrived
          </span>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl md:text-5xl">
            Fresh Off the Press
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm md:text-base leading-relaxed text-slate-600">
            Explore the newest additions to Lectory — fresh stories, trending authors, and beautiful books picked for every reader.
          </p>
        </div>

        {/* Unified Main Content Container */}
        <div className="rounded-[2rem] border border-white/80 bg-white/75 p-4 sm:p-6 lg:p-8 shadow-xl shadow-amber-100/50 backdrop-blur-xl">
          {/* Responsive Layout Grid */}
          <div className="grid gap-8 lg:grid-cols-[380px_1fr] xl:grid-cols-[420px_1fr] items-stretch">
            
            {/* Left/Top Content Dashboard */}
            <aside className="relative flex flex-col justify-between overflow-hidden rounded-[1.75rem] bg-slate-950 p-6 sm:p-8 text-white">
              <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-amber-300/10 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-emerald-300/10 blur-3xl" />

              <div className="relative z-10">
                <p className="text-xs font-black uppercase tracking-[0.25em] text-amber-400">
                  New Collection
                </p>
                <h3 className="mt-3 text-2xl sm:text-3xl font-black leading-tight">
                  Discover your next favorite book.
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">
                  From debut authors to awaited sequels, these new arrivals are carefully selected to keep your shelf exciting.
                </p>

                {/* Quick Performance Metrics Block */}
                <div className="mt-6 grid grid-cols-3 gap-3">
                  {[
                    { label: "New Books", value: `${newArrivals.length}+` },
                    { label: "Off Deals", value: "30%" },
                    { label: "Rating", value: "4.8" },
                  ].map((stat, i) => (
                    <div key={i} className="rounded-xl border border-white/5 bg-white/[0.04] p-3 text-center">
                      <p className="text-xl font-black text-amber-300">{stat.value}</p>
                      <p className="mt-0.5 text-[10px] uppercase font-bold tracking-wider text-slate-400">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* Core Feature Highlights */}
                <div className="mt-6 space-y-3">
                  {HIGHLIGHTS.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.title}
                        className="flex items-center gap-4 rounded-xl border border-white/5 bg-white/[0.03] p-3.5 transition-all hover:bg-white/[0.06]"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-300 text-slate-950 shadow-md shadow-amber-500/10">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white">{item.title}</h4>
                          <p className="mt-0.5 text-xs text-slate-400 leading-normal">{item.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Call To Action Anchor */}
              <div className="relative z-10 mt-8">
                <a
                  href="#preorder"
                  onClick={scrollToPreorder}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-amber-300 px-6 py-3 text-sm font-black text-slate-950 shadow-lg shadow-amber-500/10 transition-all hover:bg-amber-200"
                >
                  Explore New Arrivals
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </aside>
 
            {/* Right/Bottom Interactive Book Segment */}
            <div className="flex flex-col justify-center min-w-0 py-2 sm:px-2">
              <div className="mb-6">
                <h3 className="text-xl sm:text-2xl font-black text-slate-950">
                  New Arrival Books
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-slate-500">
                  ✨ Discover the Latest Page-Turners
                </p>
              </div>

              {isLoading ? (
                <div className="flex gap-4 overflow-hidden">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div
                      key={index}
                      className="h-[380px] w-[240px] shrink-0 rounded-2xl bg-slate-100/80 animate-pulse"
                    />
                  ))}
                </div>
              ) : (
                <div className="w-full overflow-visible">
                  <BookCarousel books={newArrivals} />
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
