import { cn } from "@/utils/cn";

interface SliderDotsProps {
  total: number;
  current: number;
  onDotClick: (index: number) => void;
  className?: string;
}

export default function SliderDots({
  total,
  current,
  onDotClick,
  className,
}: SliderDotsProps) {
  return (
    <div
      className={cn("flex items-center gap-2", className)}
      role="tablist"
      aria-label="Slider navigation"
    >
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          role="tab"
          aria-selected={current === i}
          aria-label={`Go to slide ${i + 1}`}
          onClick={() => onDotClick(i)}
          className={cn(
            "rounded-full transition-all duration-500",
            current === i
              ? "w-8 h-3 bg-white shadow-md shadow-white/40"
              : "w-3 h-3 bg-white/40 hover:bg-white/70"
          )}
        />
      ))}
    </div>
  );
}
