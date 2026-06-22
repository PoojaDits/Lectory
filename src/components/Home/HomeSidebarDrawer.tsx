import { useEffect } from "react";
import { createPortal } from "react-dom";
import HomeSidebar from "./HomeSidebar";
import { useHomeUI } from "@/stores/useHomeUI";

/**
 * Slide-in drawer wrapping the home filter sidebar. Rendered via
 * a portal so it can sit above the navbar and any other z-index
 * concerns. Only used on mobile (desktop renders the sidebar inline).
 */
export default function HomeSidebarDrawer() {
  const open = useHomeUI((s) => s.filterDrawerOpen);
  const close = useHomeUI((s) => s.closeFilterDrawer);

  // Lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[60] lg:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Filter books"
    >
      <button
        type="button"
        aria-label="Close filters"
        className="absolute inset-0 cursor-default bg-secondary-900/60 backdrop-blur-sm"
        onClick={close}
      />
      <div className="absolute inset-y-0 left-0 flex w-[85vw] max-w-sm flex-col overflow-hidden bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-primary-100 bg-white/95 px-5 py-3 backdrop-blur">
          <h3 className="text-base font-extrabold text-gray-900">Filters</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          <HomeSidebar onClose={close} />
        </div>
        <div className="sticky bottom-0 border-t border-primary-100 bg-white/95 p-4 backdrop-blur">
          <button
            type="button"
            onClick={close}
            className="w-full rounded-full bg-primary-900 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-primary-800"
          >
            Show results
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
