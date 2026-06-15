import type { EntityId, Paginated } from "@/types";

/**
 * JSON Server (v1) returns numeric ids as strings on some routes.
 * Always compare ids loosely via string coercion.
 */
export const sameId = (a: EntityId | undefined, b: EntityId | undefined) =>
  a !== undefined && b !== undefined && String(a) === String(b);

/** Format a number as Indian Rupees. */
export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

/** Format an ISO date into a readable label. */
export const formatDate = (iso?: string) => {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
};

/** Client-side pagination over an already-filtered array. */
export function paginate<T>(
  items: T[],
  page: number,
  pageSize: number
): Paginated<T> {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    total,
    page: safePage,
    pageSize,
    totalPages,
  };
}

/** Generic case-insensitive sort by a string/number key. */
export function sortBy<T>(
  items: T[],
  key: keyof T,
  direction: "asc" | "desc" = "asc"
): T[] {
  const sorted = [...items].sort((a, b) => {
    const av = a[key];
    const bv = b[key];
    if (typeof av === "number" && typeof bv === "number") {
      return av - bv;
    }
    return String(av ?? "").localeCompare(String(bv ?? ""), undefined, {
      sensitivity: "base",
    });
  });
  return direction === "desc" ? sorted.reverse() : sorted;
}

/** Extract a human-friendly error message from anything thrown. */
export const getErrorMessage = (error: unknown): string =>
  error instanceof Error
    ? error.message
    : "Something went wrong. Please try again.";

/** Build a hash-free debounce helper for search inputs. */
export function debounce<A extends unknown[]>(
  fn: (...args: A) => void,
  delay = 300
) {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: A) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
