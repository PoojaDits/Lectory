import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  /** Tailwind color theme, e.g. "amber" | "emerald" | "indigo". */
  tone?: string;
  hint?: string;
}

const TONES: Record<string, string> = {
  amber: "bg-primary-50 text-primary-700",
  emerald: "bg-emerald-50 text-emerald-700",
  indigo: "bg-indigo-50 text-indigo-700",
  rose: "bg-rose-50 text-rose-700",
  slate: "bg-secondary-100 text-secondary-700",
  blue: "bg-blue-50 text-blue-700",
};

export default function StatCard({
  label,
  value,
  icon: Icon,
  tone = "amber",
  hint,
}: StatCardProps) {
  return (
    <div className="rounded-3xl border border-secondary-100 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div
        className={cn(
          "inline-flex h-12 w-12 items-center justify-center rounded-2xl",
          TONES[tone] ?? TONES.amber
        )}
      >
        <Icon className="h-6 w-6" />
      </div>
      <p className="mt-4 text-sm font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-3xl font-black text-secondary-900">{value}</p>
      {hint && <p className="mt-1 text-xs font-medium text-slate-400">{hint}</p>}
    </div>
  );
}
