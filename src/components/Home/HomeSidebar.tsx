import { RotateCcw, Star, X } from "lucide-react";
import {
  PRICE_BOUNDS,
  useHasActiveFilters,
  useHomeFilters,
  type BookFormat,
  type Language,
} from "@/stores/useHomeFilters";
import { cn } from "@/utils/cn";

const FORMATS: { id: BookFormat; label: string; desc: string }[] = [
  { id: "pocket", label: "Pocket", desc: "Under 200 pages" },
  { id: "paperback", label: "Paperback", desc: "200–400 pages" },
  { id: "hardcover", label: "Hardcover", desc: "Over 400 pages" },
];

const LANGUAGES: { id: Language; label: string }[] = [
  { id: "english", label: "English" },
  { id: "hindi", label: "Hindi" },
  { id: "spanish", label: "Spanish" },
];

const RATINGS = [
  { value: 0, label: "Any" },
  { value: 3, label: "3+" },
  { value: 4, label: "4+" },
  { value: 4.5, label: "4.5+" },
];

interface HomeSidebarProps {
  /** When provided, a small close button is rendered (used inside the mobile drawer). */
  onClose?: () => void;
  className?: string;
}

/**
 * Filter sidebar for the home page. Shown persistently on desktop
 * (inside a sticky panel) and inside a slide-in drawer on mobile.
 * All controls are bound to the `useHomeFilters` Zustand store, so
 * every home-page section re-filters when any input changes.
 */
export default function HomeSidebar({
  onClose,
  className,
}: HomeSidebarProps) {
  const filters = useHomeFilters();
  const hasActive = useHasActiveFilters();

  return (
    <div className={cn("space-y-6", className)}>
      <header className="flex items-center justify-between">
        <h3 className="text-lg font-extrabold tracking-tight text-gray-900">
          Filters
        </h3>
        <div className="flex items-center gap-1">
          {hasActive && (
            <button
              type="button"
              onClick={filters.reset}
              className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold text-amber-700 transition hover:bg-amber-50"
            >
              <RotateCcw className="h-3 w-3" />
              Reset
            </button>
          )}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-1.5 text-gray-500 transition hover:bg-gray-100"
              aria-label="Close filters"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </header>

      {/* Price */}
      <FilterGroup title="Price">
        <div className="flex items-center gap-2">
          <NumberField
            label="Min price"
            value={filters.priceMin}
            min={PRICE_BOUNDS.min}
            max={PRICE_BOUNDS.max}
            onChange={filters.setPriceMin}
          />
          <span className="text-gray-400">–</span>
          <NumberField
            label="Max price"
            value={filters.priceMax}
            min={PRICE_BOUNDS.min}
            max={PRICE_BOUNDS.max}
            onChange={filters.setPriceMax}
          />
        </div>
        <p className="mt-1.5 px-1 text-[10px] text-gray-400">
          Range ₹{PRICE_BOUNDS.min}–₹{PRICE_BOUNDS.max}
        </p>
      </FilterGroup>

      {/* Rating */}
      <FilterGroup title="Rating">
        <div className="space-y-1">
          {RATINGS.map((r) => (
            <label
              key={r.value}
              className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 transition hover:bg-amber-50"
            >
              <input
                type="radio"
                name="min-rating"
                checked={filters.minRating === r.value}
                onChange={() => filters.setMinRating(r.value)}
                className="h-4 w-4 cursor-pointer accent-amber-700"
              />
              <span className="flex items-center gap-1.5 text-sm font-semibold text-gray-700">
                {r.value > 0 && (
                  <span className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "h-3.5 w-3.5",
                          i < Math.floor(r.value)
                            ? "fill-amber-400 text-amber-400"
                            : "text-gray-300"
                        )}
                      />
                    ))}
                  </span>
                )}
                {r.label}
              </span>
            </label>
          ))}
        </div>
      </FilterGroup>

      {/* Format */}
      <FilterGroup title="Format">
        <div className="space-y-1">
          {FORMATS.map((f) => (
            <label
              key={f.id}
              className="flex cursor-pointer items-start gap-2 rounded-lg px-2 py-1.5 transition hover:bg-amber-50"
            >
              <input
                type="checkbox"
                checked={filters.formats.includes(f.id)}
                onChange={() => filters.toggleFormat(f.id)}
                className="mt-0.5 h-4 w-4 cursor-pointer accent-amber-700"
              />
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-700">{f.label}</p>
                <p className="text-[11px] text-gray-400">{f.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </FilterGroup>

      {/* Language */}
      <FilterGroup title="Language">
        <div className="space-y-1">
          {LANGUAGES.map((l) => (
            <label
              key={l.id}
              className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 transition hover:bg-amber-50"
            >
              <input
                type="checkbox"
                checked={filters.languages.includes(l.id)}
                onChange={() => filters.toggleLanguage(l.id)}
                className="h-4 w-4 cursor-pointer accent-amber-700"
              />
              <span className="text-sm font-semibold text-gray-700">
                {l.label}
              </span>
            </label>
          ))}
        </div>
      </FilterGroup>
    </div>
  );
}

function FilterGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h4 className="mb-2 text-[11px] font-extrabold uppercase tracking-wider text-gray-500">
        {title}
      </h4>
      {children}
    </section>
  );
}

function NumberField({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (n: number) => void;
}) {
  return (
    <label className="flex-1">
      <span className="sr-only">{label}</span>
      <div className="flex items-center rounded-lg border border-amber-200 bg-white px-2 py-1.5 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-100">
        <span className="text-xs font-bold text-gray-400">₹</span>
        <input
          type="number"
          min={min}
          max={max}
          value={value}
          onChange={(e) => {
            const next = e.target.value === "" ? min : Number(e.target.value);
            if (!Number.isNaN(next)) onChange(next);
          }}
          className="w-full bg-transparent text-sm font-semibold text-gray-900 outline-none"
        />
      </div>
    </label>
  );
}
