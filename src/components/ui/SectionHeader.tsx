import { cn } from "@/utils/cn";

interface SectionHeaderProps {
  badge?: string;
  badgeClass?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
  className?: string;
}

export default function SectionHeader({
  badge,
  badgeClass,
  title,
  subtitle,
  align = "center",
  className,
}: SectionHeaderProps) {
  const alignClass = {
    left: "items-start text-left",
    center: "items-center text-center",
    right: "items-end text-right",
  }[align];

  return (
    <div className={cn("flex flex-col gap-3 mb-10 md:mb-14", alignClass, className)}>
      {badge && (
        <span
          className={cn(
            "inline-block px-4 py-1.5 border text-sm font-semibold rounded-full",
            badgeClass ?? "bg-primary-50 text-primary-700 border border-primary-200"
          )}
        >
          {badge}
        </span>
      )}
      <h2 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-gray-500 text-base md:text-lg leading-relaxed max-w-2xl">
          {subtitle}
        </p>
      )}
    </div>
  );
}
