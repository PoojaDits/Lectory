import { useEffect, useRef, useCallback } from "react";
import { useSliderStore } from "../store/useSliderStore";

export function useSlider(autoplayInterval = 5000) {
  const {
    currentIndex,
    slides,
    isAutoPlaying,
    nextSlide,
    prevSlide,
    goToSlide,
    toggleAutoPlay,
    setSlides,
  } = useSliderStore();

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Pause autoplay when user interacts, resume after a delay
  const pauseAutoPlay = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const resumeAutoPlay = useCallback(() => {
    if (isAutoPlaying && slides.length > 1) {
      pauseAutoPlay();
      intervalRef.current = setInterval(nextSlide, autoplayInterval);
    }
  }, [isAutoPlaying, slides.length, autoplayInterval, nextSlide, pauseAutoPlay]);

  // Set up autoplay
  useEffect(() => {
    resumeAutoPlay();
    return () => pauseAutoPlay();
  }, [resumeAutoPlay, pauseAutoPlay]);

  const handleNext = useCallback(() => {
    pauseAutoPlay();
    nextSlide();
    resumeAutoPlay();
  }, [nextSlide, pauseAutoPlay, resumeAutoPlay]);

  const handlePrev = useCallback(() => {
    pauseAutoPlay();
    prevSlide();
    resumeAutoPlay();
  }, [prevSlide, pauseAutoPlay, resumeAutoPlay]);

  const handleGoTo = useCallback(
    (index: number) => {
      pauseAutoPlay();
      goToSlide(index);
      resumeAutoPlay();
    },
    [goToSlide, pauseAutoPlay, resumeAutoPlay]
  );

  return {
    currentIndex,
    slides,
    isAutoPlaying,
    setSlides,
    nextSlide: handleNext,
    prevSlide: handlePrev,
    goToSlide: handleGoTo,
    toggleAutoPlay,
    totalSlides: slides.length,
  };
}
