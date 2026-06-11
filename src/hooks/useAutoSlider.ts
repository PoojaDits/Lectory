import { useState, useEffect, useCallback } from "react";

interface UseAutoSliderOptions {
  totalItems: number;
  interval?: number;
  autoPlay?: boolean;
}

export function useAutoSlider({
  totalItems,
  interval = 5000,
  autoPlay = true,
}: UseAutoSliderOptions) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goTo = useCallback(
    (index: number) => {
      if (isTransitioning || totalItems === 0) return;
      setIsTransitioning(true);
      setCurrent(index);
      setTimeout(() => setIsTransitioning(false), 700);
    },
    [isTransitioning, totalItems]
  );

  const next = useCallback(() => {
    if (totalItems === 0) return;
    goTo((current + 1) % totalItems);
  }, [current, totalItems, goTo]);

  const prev = useCallback(() => {
    if (totalItems === 0) return;
    goTo((current - 1 + totalItems) % totalItems);
  }, [current, totalItems, goTo]);

  const pause = useCallback(() => setIsPaused(true), []);
  const resume = useCallback(() => setIsPaused(false), []);

  useEffect(() => {
    if (!autoPlay || isPaused || totalItems === 0) return;
    const timer = setInterval(next, interval);
    return () => clearInterval(timer);
  }, [next, interval, autoPlay, isPaused, totalItems]);

  return { current, goTo, next, prev, pause, resume, isPaused };
}
