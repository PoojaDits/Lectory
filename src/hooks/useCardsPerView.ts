import { useState, useEffect } from "react";

const BREAKPOINTS = { sm: 640, md: 768, lg: 1024 };

export function useCardsPerView() {
  const [cardsPerView, setCardsPerView] = useState(4);

  useEffect(() => {
    function update() {
      const w = window.innerWidth;
      if (w < BREAKPOINTS.sm) setCardsPerView(1);
      else if (w < BREAKPOINTS.md) setCardsPerView(2);
      else if (w < BREAKPOINTS.lg) setCardsPerView(3);
      else setCardsPerView(4);
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return cardsPerView;
}
