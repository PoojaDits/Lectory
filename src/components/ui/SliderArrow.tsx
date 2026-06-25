import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/utils/cn";

interface SliderArrowProps {
  direction: "left" | "right";
  onClick: () => void;
  variant?: "default" | "outline";
  className?: string;
}

export default function SliderArrow({
  direction,
  onClick,
  variant = "default",
  className,
}: SliderArrowProps) {
  const Icon = direction === "left" ? ChevronLeft : ChevronRight;

  if (variant === "outline") {
    return (
      <button
        onClick={onClick}
        aria-label={direction === "left" ? "Previous" : "Next"}
        className={cn(
          "inline-flex items-center justify-center w-10 h-10 rounded-full",
          "border-2 border-gray-200 bg-white text-gray-600",
          "hover:border-amber-500 hover:text-primary-600 hover:shadow-md",
          "transition-all duration-200 hover:scale-110 active:scale-95",
          className
        )}
      >
        <Icon className="w-5 h-5" />
      </button>
    );
  }

  // default — absolute-positioned over slider
  return (
    <button
      onClick={onClick}
      aria-label={direction === "left" ? "Previous" : "Next"}
      className={cn(
        "absolute top-1/2 -translate-y-1/2 z-30",
        direction === "left" ? "left-2 sm:left-4 md:left-6 lg:left-10" : "right-2 sm:right-4 md:right-6 lg:right-10",
        "flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 md:w-14 md:h-14",
        "rounded-full bg-white/15 backdrop-blur-md border border-white/25",
        "text-white hover:bg-white/30 hover:scale-110",
        "transition-all duration-200 active:scale-95 shadow-lg",
        className
      )}
    >
      <Icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 drop-shadow" />
    </button>
  );
}
