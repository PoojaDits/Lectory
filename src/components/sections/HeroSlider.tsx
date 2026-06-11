import { useHeroStore } from "@/stores/useHeroStore";
import { useAutoSlider } from "@/hooks/useAutoSlider";
import SliderDots from "@/components/ui/SliderDots";
import SliderArrow from "@/components/ui/SliderArrow";
import { HeroSkeleton } from "@/components/ui/Skeleton";

export default function HeroSlider() {
  const { slides, isLoading } = useHeroStore();
  const { current, goTo, next, prev } = useAutoSlider({
    totalItems: slides.length,
    interval: 5000,
  });

  if (isLoading || slides.length === 0) return <HeroSkeleton />;

  return (
    <section className="relative w-full h-[70vh] md:h-[85vh] overflow-hidden mt-16 md:mt-20">
      {/* Track */}
      <div
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide, i) => (
          <div key={slide.id} className="relative w-full h-full flex-shrink-0">
            <img
              src={slide.image}
              alt={slide.title}
              className="absolute inset-0 w-full h-full object-cover"
              loading={i === 0 ? "eager" : "lazy"}
            />
            <div className={`absolute inset-0 bg-gradient-to-r ${slide.accent}`} />
            <div className="absolute inset-0 bg-black/20" />

            <div className="relative h-full flex items-center">
              <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full">
                <div className="max-w-2xl">
                  <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight whitespace-pre-line drop-shadow-lg">
                    {slide.title}
                  </h1>
                  <p className="mt-4 md:mt-6 text-base sm:text-lg lg:text-xl text-white/90 leading-relaxed max-w-lg drop-shadow">
                    {slide.subtitle}
                  </p>
                  <div className="mt-6 md:mt-8 flex flex-wrap gap-4">
                    <button className="px-8 py-3.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-full shadow-lg shadow-amber-600/30 transition-all hover:scale-105 hover:shadow-xl">
                      {slide.cta}
                    </button>
                    <button className="px-8 py-3.5 bg-white/15 hover:bg-white/25 text-white font-semibold rounded-full backdrop-blur-sm border border-white/30 transition-all hover:scale-105">
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Arrows */}
      <SliderArrow direction="left" onClick={prev} />
      <SliderArrow direction="right" onClick={next} />

      {/* Dots */}
      <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2">
        <SliderDots total={slides.length} current={current} onDotClick={goTo} />
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-amber-50 to-transparent" />
    </section>
  );
}
