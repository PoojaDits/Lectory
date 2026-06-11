import { useEffect, useMemo } from "react";
import { useSlider } from "../../hooks/useSlider";
import { useApi } from "../../hooks/useApi";
import { fetchSlides } from "../../lib/api";
import type { Slide } from "../../store/useSliderStore";

export default function HeroSlider() {
  const {
    currentIndex,
    slides,
    isAutoPlaying,
    setSlides,
    nextSlide,
    prevSlide,
    goToSlide,
    toggleAutoPlay,
    totalSlides,
  } = useSlider(5000);

  const fetcher = useMemo(() => () => fetchSlides(), []);
  const { data, loading, error } = useApi<Slide[]>(fetcher);

  useEffect(() => {
    if (data) {
      setSlides(data);
    }
  }, [data, setSlides]);

  if (loading || slides.length === 0) {
    return (
      <div className="h-[500px] bg-gray-200 animate-pulse flex items-center justify-center">
        <span className="text-gray-400">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[500px] bg-red-50 flex items-center justify-center">
        <span className="text-red-500">Failed to load hero: {error}</span>
      </div>
    );
  }

  return (
    <section className="relative overflow-hidden">
      <div className="relative h-[450px] sm:h-[520px] lg:h-[600px]">
        {slides.map((slide, idx) => (
          <div
            key={slide.id}
            className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} transition-opacity duration-700 ease-in-out ${
              idx === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <div className="absolute inset-0 opacity-10">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.2) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.15) 0%, transparent 40%)",
                }}
              />
            </div>
            <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden lg:flex gap-2 opacity-20">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className={`w-6 rounded-sm ${slide.accent}`}
                  style={{ height: `${120 + Math.random() * 80}px` }}
                />
              ))}
            </div>
            <div className="relative z-20 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
              <div className="max-w-xl">
                <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-white/20 text-white mb-4">
                  Limited Time Offer
                </span>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight mb-4">
                  {slide.title}
                </h1>
                <p className="text-base sm:text-lg text-white/80 mb-8 leading-relaxed">
                  {slide.subtitle}
                </p>
                <a
                  href={slide.link}
                  className="inline-flex items-center gap-2 px-6 py-3 sm:px-8 sm:py-3.5 bg-white text-gray-900 font-semibold rounded-full hover:bg-gray-100 transition-all hover:shadow-lg hover:-translate-y-0.5 text-sm sm:text-base"
                >
                  {slide.cta}
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={prevSlide}
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-sm transition-all"
          aria-label="Previous slide"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-sm transition-all"
          aria-label="Next slide"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
        <div className="flex items-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className={`transition-all rounded-full ${
                idx === currentIndex
                  ? "w-8 h-2.5 bg-white"
                  : "w-2.5 h-2.5 bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
        <button
          onClick={toggleAutoPlay}
          className="p-1.5 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-sm transition-all"
          aria-label={isAutoPlaying ? "Pause slideshow" : "Play slideshow"}
        >
          {isAutoPlaying ? (
            <svg
              className="w-3.5 h-3.5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg
              className="w-3.5 h-3.5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <polygon points="5,3 19,12 5,21" />
            </svg>
          )}
        </button>
        <span className="text-white/60 text-xs font-mono">
          {currentIndex + 1} / {totalSlides}
        </span>
      </div>
    </section>
  );
}
