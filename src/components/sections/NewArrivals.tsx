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
  // Use real marketplace books so cards match Best Sellers / Recommended etc.
  const { data: books = [], isLoading } = useRecommendedBooks();
  const newArrivals = books.slice(0, 8);

  const carouselRef = useRef<HTMLDivElement | null>(null);

  const scrollBooks = (direction: "left" | "right") => {
    carouselRef.current?.scrollBy({
      left: direction === "left" ? -320 : 320,
      behavior: "smooth",
    });
  };

  const scrollToPreorder = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById("preorder")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="new-arrivals"
      className="relative overflow-hidden bg-gradient-to-br from-[#fff8e7] via-white to-emerald-50 py-16 md:py-24 md:px-16"
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute -left-32 top-10 h-80 w-80 rounded-full bg-amber-200/60 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-10 h-96 w-96 rounded-full bg-emerald-200/60 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white px-4 py-2 text-sm font-black text-amber-700 shadow-sm">
            <Sparkles className="h-4 w-4" />
            Just Arrived
          </span>

          <h2 className="mt-5 text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
            Fresh Off the Press
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600 md:text-lg">
            Explore the newest additions to Lectory — fresh stories, trending
            authors, and beautiful books picked for every kind of reader.
          </p>
        </div>

        {/* Main wrapper */}
        <div className="rounded-[2rem] border border-white/80 bg-white/75 p-4 shadow-2xl shadow-amber-100/60 backdrop-blur-xl md:p-6 lg:p-8">
          <div className="grid gap-8 lg:grid-cols-[360px_1fr] xl:grid-cols-[390px_1fr]">
            {/* Left info panel */}
            <aside className="relative overflow-hidden rounded-[1.75rem] bg-slate-950 p-6 text-white md:p-8">
              <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-amber-300/20 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-emerald-300/20 blur-3xl" />

              <div className="relative">
                <p className="text-sm font-black uppercase tracking-[0.28em] text-amber-300">
                  New Collection
                </p>

                <h3 className="mt-4 text-3xl font-black leading-tight md:text-4xl">
                  Discover your next favorite book.
                </h3>

                <p className="mt-4 text-sm leading-relaxed text-slate-300 md:text-base">
                  From debut authors to awaited sequels, these new arrivals are
                  carefully selected to keep your bookshelf exciting.
                </p>

                <div className="mt-7 grid grid-cols-3 gap-3">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-3 text-center">
                    <p className="text-2xl font-black text-amber-300">
                      {newArrivals.length}+
                    </p>
                    <p className="mt-1 text-xs text-slate-400">New Books</p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-3 text-center">
                    <p className="text-2xl font-black text-amber-300">30%</p>
                    <p className="mt-1 text-xs text-slate-400">Off Deals</p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-3 text-center">
                    <p className="text-2xl font-black text-amber-300">4.8</p>
                    <p className="mt-1 text-xs text-slate-400">Rating</p>
                  </div>
                </div>

                <div className="mt-7 space-y-3">
                  {HIGHLIGHTS.map((item) => {
                    const Icon = item.icon;

                    return (
                      <div
                        key={item.title}
                        className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.06] p-4 transition-all duration-300 hover:bg-white/[0.1]"
                      >
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-300 text-slate-950 shadow-lg shadow-amber-500/20">
                          <Icon className="h-5 w-5" />
                        </div>

                        <div>
                          <h4 className="font-bold text-white">{item.title}</h4>
                          <p className="mt-1 text-sm leading-relaxed text-slate-400">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <a
                  href="#preorder"
                  onClick={scrollToPreorder}
                  className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-amber-300 px-6 py-3.5 font-black text-slate-950 shadow-xl shadow-amber-500/20 transition-all duration-300 hover:-translate-y-1 hover:bg-amber-200"
                >
                  Explore New Arrivals
                  <ArrowRight className="h-5 w-5" />
                </a>
              </div>
            </aside>

            {/* Right book carousel only */}
            <div className="min-w-0">
              <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                  <h3 className="mt-3 text-2xl font-black text-slate-950 md:text-3xl">
                    New Arrival Books
                  </h3>

                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-500">
                    Use the arrows or swipe to browse all newly added books.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => scrollBooks("left")}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-900 shadow-sm transition-all hover:bg-slate-950 hover:text-white"
                    aria-label="Previous books"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => scrollBooks("right")}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-900 shadow-sm transition-all hover:bg-slate-950 hover:text-white"
                    aria-label="Next books"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {isLoading ? (
                <div className="flex gap-5 overflow-hidden">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div
                      key={index}
                      className="h-[420px] w-[260px] shrink-0 rounded-[1.5rem] bg-slate-100 animate-pulse"
                    />
                  ))}
                </div>
              ) : (
                <div
                  ref={carouselRef}
                  className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                >
                  {newArrivals.map((book) => (
                    <div
                      key={String(book.id)}
                      className="w-[245px] shrink-0 snap-start sm:w-[270px] lg:w-[285px]"
                    >
                      <div className="h-[420px]">
                        <BookCard book={book} className="h-full" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <p className="mt-2 text-center text-xs font-medium text-slate-400">
                Swipe horizontally or use arrows to see more books.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
