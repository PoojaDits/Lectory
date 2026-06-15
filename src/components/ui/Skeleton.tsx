import { cn } from "@/utils/cn";


interface SkeletonProps {
  className?: string;
}

export default function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-gray-200",
        className
      )}
      aria-hidden="true"
    />
  );
}

// HeroSkeleton full-height hero placeholder

export function HeroSkeleton() {
  return (
    <div className="relative w-full h-[70vh] md:h-[85vh] mt-16 md:mt-20 overflow-hidden bg-gray-200 animate-pulse">
      {/* Fake content */}
      <div className="absolute inset-0 flex items-center px-6 sm:px-8 lg:px-12">
        <div className="max-w-2xl space-y-5 w-full">
          <div className="h-16 md:h-24 w-3/4 bg-gray-300 rounded-2xl" />
          <div className="h-5 w-2/3 bg-gray-300 rounded-lg" />
          <div className="h-5 w-1/2 bg-gray-300 rounded-lg" />
          <div className="flex gap-4 mt-4">
            <div className="h-12 w-40 bg-gray-300 rounded-full" />
            <div className="h-12 w-32 bg-gray-300 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

// BookCardSkeleton matches BookCard layout

export function BookCardSkeleton() {
  return (
    <div className="flex flex-col gap-3" aria-hidden="true">
      {/* Cover */}
      <div className="aspect-[3/4] w-full rounded-2xl bg-gray-200 animate-pulse" />
      {/* Title */}
      <div className="h-4 w-4/5 bg-gray-200 rounded animate-pulse" />
      {/* Author */}
      <div className="h-3 w-2/3 bg-gray-200 rounded animate-pulse" />
      {/* Price row */}
      <div className="flex items-center gap-2">
        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
        <div className="h-3 w-12 bg-gray-100 rounded animate-pulse" />
      </div>
    </div>
  );
}
