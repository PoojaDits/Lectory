import { useHeroSlides } from "@/hooks/useHomeContent";
import { useAutoSlider } from "@/hooks/useAutoSlider";
import SliderDots from "@/components/ui/SliderDots";
import SliderArrow from "@/components/ui/SliderArrow";
import { HeroSkeleton } from "@/components/ui/Skeleton";

export default function HeroSlider() {
  const { data: slides = [], isLoading } = useHeroSlides();
  const { current, goTo, next, prev } = useAutoSlider({
    totalItems: slides.length,
    interval: 5000,
  });

  if (isLoading || slides.length === 0) return <HeroSkeleton />;

  return (
    <section className="relative w-full min-h-[55vh] md:min-h-[70vh] overflow-hidden mt-16 md:mt-20">
      {slides.map((slide, i) => {
        const isActive = i === current;

        return (
          <div
            key={slide.id}
            className={`absolute inset-0 h-full w-full transition-opacity duration-700 ease-in-out ${
              isActive ? "opacity-100 z-20" : "opacity-0 pointer-events-none"
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="absolute inset-0 w-full h-full object-cover"
              loading={i === 0 ? "eager" : "lazy"}
            />
            <div className={`absolute inset-0 bg-gradient-to-r ${slide.accent}`} />
            <div className="absolute inset-0 bg-black/20" />

            <div className="relative h-full flex items-start">
              <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full py-16 sm:py-20">
                <div className="max-w-lg sm:max-w-xl lg:max-w-2xl">
                  <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white leading-tight whitespace-pre-line drop-shadow-2xl animate-fade-in-up">
                    {slide.title}
                  </h1>
                  <p 
                    className="mt-4 md:mt-6 text-sm sm:text-base lg:text-lg text-white/95 leading-relaxed max-w-xl drop-shadow-md whitespace-normal break-words animate-fade-in-up" 
                    style={{ animationDelay: '100ms', animationFillMode: 'both' }}
                  >
                    {slide.subtitle}
                  </p>
                  <div 
                    className="mt-6 md:mt-8 flex flex-col sm:flex-row gap-4 animate-fade-in-up"
                    style={{ animationDelay: '200ms', animationFillMode: 'both' }}
                  >
                    <button className="px-8 py-3.5 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-amber-500 hover:to-primary-600 text-white font-semibold rounded-full shadow-[0_8px_30px_rgba(217,119,6,0.4)] transition-all duration-300 hover:scale-105 hover:-translate-y-1">
                      {slide.cta}
                    </button>
                    <button className="px-8 py-3.5 glass-premium hover:bg-white/20 text-white font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:-translate-y-1">
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Arrows */}
      <SliderArrow direction="left" onClick={prev} />
      <SliderArrow direction="right" onClick={next} />

      {/* Dots */}
      <div className="absolute bottom-24 md:bottom-10 left-1/2 -translate-x-1/2 z-30">
        <SliderDots total={slides.length} current={current} onDotClick={goTo} />
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-primary-50 to-transparent" />
    </section>
  );
}
