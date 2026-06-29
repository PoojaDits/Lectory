import { BookOpen } from "lucide-react";

/**
 * UI-10: friendly empty-state for home-page book carousels.
 *
 * Storefront sections only render books that carry the matching `categories`
 * tag AND have an active listing. When seeding/tagging is incomplete a section
 * could otherwise show just its header with a blank gap, looking broken. This
 * gives the user (and us) a clear, intentional message instead.
 */
export default function EmptySection({
  message = "No books to show here yet — check back soon.",
}: {
  message?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-primary-200 bg-white/60 px-6 py-12 text-center">
      <div className="rounded-full bg-primary-50 p-4">
        <BookOpen className="h-7 w-7 text-primary-400" />
      </div>
      <p className="mt-4 max-w-sm text-sm font-semibold text-secondary-600">
        {message}
      </p>
    </div>
  );
}
