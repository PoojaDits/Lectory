import { useEffect, useId, useRef } from "react";
import { AlertTriangle, X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Accessible confirmation modal — drop-in replacement for
 * `window.confirm(...)` / `window.alert(...)` that matches the rest of
 * the Lectory UI instead of using a raw browser dialog.
 *
 * Features:
 *   - `role="dialog"` + `aria-modal="true"` for screen readers
 *   - `aria-labelledby` / `aria-describedby` wired to the title/description
 *   - Auto-focuses the Cancel button on open (safe default for destructive
 *     confirmations — Enter won't accidentally trigger the destructive action)
 *   - Closes on Escape
 *   - Closes on backdrop click (disabled while pending)
 *   - Locks body scroll while open
 *   - Visual variants for neutral ("primary") and destructive ("danger") tones
 *   - `isPending` disables both buttons and shows a spinner on the confirm
 *     button so the user sees work in progress
 */
export type ConfirmDialogTone = "danger" | "primary";

export interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: ConfirmDialogTone;
  /** Disable buttons + show spinner. Use while async work is in flight. */
  isPending?: boolean;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  tone = "primary",
  isPending = false,
}: ConfirmDialogProps) {
  const titleId = useId();
  const descId = useId();
  const cancelRef = useRef<HTMLButtonElement>(null);

  // Focus the Cancel button on open (safer default for destructive
  // confirmations) and wire up Escape-to-close.
  useEffect(() => {
    if (!open) return;
    cancelRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isPending) {
        e.stopPropagation();
        onClose();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, isPending, onClose]);

  // Lock body scroll while the modal is open.
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  if (!open) return null;

  const isDanger = tone === "danger";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-secondary-900/50 p-4 backdrop-blur-sm animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={description ? descId : undefined}
      onClick={isPending ? undefined : onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-secondary-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4">
          {isDanger && (
            <span
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-100 text-rose-700"
              aria-hidden="true"
            >
              <AlertTriangle className="h-6 w-6" />
            </span>
          )}
          <div className="min-w-0 flex-1">
            <h2
              id={titleId}
              className="text-lg font-extrabold text-secondary-900"
            >
              {title}
            </h2>
            {description && (
              <div
                id={descId}
                className="mt-2 text-sm text-secondary-600"
              >
                {description}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            aria-label="Close dialog"
            className="rounded-full p-1 text-secondary-400 transition hover:bg-secondary-100 hover:text-secondary-700 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2">
          <button
            ref={cancelRef}
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="rounded-full border border-secondary-200 bg-white px-4 py-2 text-sm font-bold text-secondary-700 transition hover:bg-secondary-50 disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-bold text-white shadow-sm transition disabled:cursor-not-allowed disabled:opacity-50",
              isDanger
                ? "bg-rose-600 hover:bg-rose-700"
                : "bg-primary-900 hover:bg-primary-800",
            )}
          >
            {isPending && (
              <span
                aria-hidden="true"
                className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-white/40 border-t-white"
              />
            )}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
