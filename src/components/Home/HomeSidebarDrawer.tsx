import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import HomeSidebar from "./HomeSidebar";
import { useHomeUI } from "@/stores/useHomeUI";

/**
 * Slide-in drawer wrapping the home filter sidebar. Rendered via
 * a portal so it can sit above the navbar and any other z-index
 * concerns. Includes buttery smooth enter/exit GPU animations.
 */
export default function HomeSidebarDrawer() {
  const open = useHomeUI((s) => s.filterDrawerOpen);
  const close = useHomeUI((s) => s.closeFilterDrawer);

  const [renderDrawer, setRenderDrawer] = useState(false);

  useEffect(() => {
    if (open) {
      setRenderDrawer(true);
      return;
    }
    const timer = window.setTimeout(() => setRenderDrawer(false), 300);
    return () => window.clearTimeout(timer);
  }, [open]);

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

  if (!renderDrawer) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[60] lg:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Filter books"
    >
      {/* Animated Backdrop */}
      <button
        type="button"
        aria-label="Close filters"
        className={`absolute inset-0 cursor-default bg-secondary-900/60 backdrop-blur-xs transition-opacity ${
          open
            ? "animate-in fade-in-0 duration-300 ease-out"
            : "animate-out fade-out-0 duration-300 ease-in"
        }`}
        onClick={close}
      />

      {/* Animated Sidebar Drawer Panel */}
      <div
        className={`absolute inset-y-0 left-0 flex w-[88vw] max-w-sm flex-col overflow-hidden bg-white shadow-2xl transition-transform ${
          open
            ? "animate-in slide-in-from-left duration-300 ease-out"
            : "animate-out slide-out-to-left duration-300 ease-in"
        }`}
      >
        <div className="flex-1 overflow-y-auto p-5 [scrollbar-width:thin]">
          <HomeSidebar onClose={close} />
        </div>
        
        <div className="sticky bottom-0 border-t border-primary-100 bg-white/95 p-4 backdrop-blur shadow-lg">
          <button
            type="button"
            onClick={close}
            className="w-full rounded-full bg-primary-900 px-4 py-3.5 text-sm font-black tracking-wide text-white shadow-md transition hover:bg-primary-800 active:scale-[0.99]"
          >
            Show Filtered Results
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
