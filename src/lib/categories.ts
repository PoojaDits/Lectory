/**
 * Maps the real book `categories` tags to display metadata (label, icon name,
 * gradient, etc.) used by both the "Browse by Category" tiles on the home page
 * and the filter UI on the Browse page.
 *
 * The tags come from each MarketBook's `categories` array
 * (e.g. ["bestseller", "preorder"]) — see scripts/seed-books.mjs.
 */

export interface CategoryMeta {
  /** The tag stored on each book's `categories` array. */
  tag: string;
  label: string;
  /** lucide-react icon name (resolved in the component). */
  icon: string;
  gradient: string;
  shadow: string;
  bg: string;
  badge: string;
}

export const CATEGORY_META: CategoryMeta[] = [
  {
    tag: "bestseller",
    label: "Best Sellers",
    icon: "TrendingUp",
    gradient: "from-amber-500 to-orange-600",
    shadow: "shadow-primary-200",
    bg: "bg-primary-50",
    badge: "🔥 Best Sellers",
  },
  {
    tag: "recommended",
    label: "Recommended",
    icon: "Star",
    gradient: "from-rose-500 to-pink-600",
    shadow: "shadow-rose-200",
    bg: "bg-rose-50",
    badge: "⭐ Recommended",
  },
  {
    tag: "ai",
    label: "AI & Tech",
    icon: "Cpu",
    gradient: "from-violet-500 to-purple-600",
    shadow: "shadow-violet-200",
    bg: "bg-violet-50",
    badge: "🤖 AI & Tech",
  },
  {
    tag: "manga",
    label: "Manga & Comics",
    icon: "BookOpen",
    gradient: "from-blue-500 to-indigo-600",
    shadow: "shadow-blue-200",
    bg: "bg-blue-50",
    badge: "📖 Manga & Comics",
  },
  {
    tag: "preorder",
    label: "Pre-Order",
    icon: "Rocket",
    gradient: "from-emerald-500 to-teal-600",
    shadow: "shadow-emerald-200",
    bg: "bg-emerald-50",
    badge: "🚀 Pre-Order",
  },
];

/** Look up a category's display metadata by its tag. */
export const getCategoryMeta = (tag: string): CategoryMeta | undefined =>
  CATEGORY_META.find((c) => c.tag === tag);
