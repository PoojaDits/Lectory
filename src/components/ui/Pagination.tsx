import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /** How many numbered buttons to show around the current page. */
  siblingCount?: number;
}

const DOTS = "...";

/** Build the page list with leading/trailing ellipses, e.g. 1 … 4 5 6 … 12 */
function getPageRange(
  currentPage: number,
  totalPages: number,
  siblingCount: number
): (number | string)[] {
  const totalNumbers = siblingCount * 2 + 5; // first, last, current, 2 dots
  if (totalPages <= totalNumbers) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSibling = Math.max(currentPage - siblingCount, 1);
  const rightSibling = Math.min(currentPage + siblingCount, totalPages);

  const showLeftDots = leftSibling > 2;
  const showRightDots = rightSibling < totalPages - 1;

  const pages: (number | string)[] = [1];
  if (showLeftDots) pages.push(DOTS);

  for (let p = leftSibling; p <= rightSibling; p++) {
    if (p !== 1 && p !== totalPages) pages.push(p);
  }

  if (showRightDots) pages.push(DOTS);
  pages.push(totalPages);

  return pages;
}

/**
 * Numbered pagination control (1 2 3 4 …) with prev/next arrows.
 */
export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageRange(currentPage, totalPages, siblingCount);

  const baseBtn =
    "flex h-10 min-w-10 items-center justify-center rounded-xl border px-3 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <nav
      className="mt-12 flex flex-wrap items-center justify-center gap-2"
      aria-label="Pagination"
    >
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(baseBtn, "border-slate-200 bg-white text-slate-700 hover:bg-slate-50")}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {pages.map((page, idx) =>
        page === DOTS ? (
          <span
            key={`dots-${idx}`}
            className="flex h-10 min-w-10 items-center justify-center px-2 text-slate-400"
          >
            {DOTS}
          </span>
        ) : (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page as number)}
            aria-current={page === currentPage ? "page" : undefined}
            className={cn(
              baseBtn,
              page === currentPage
                ? "border-amber-700 bg-amber-900 text-white shadow-sm"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            )}
          >
            {page}
          </button>
        )
      )}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(baseBtn, "border-slate-200 bg-white text-slate-700 hover:bg-slate-50")}
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}