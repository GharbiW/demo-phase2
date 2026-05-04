import { cn } from "@/lib/cn";

const VARIANTS = {
  neutral: "bg-neutral-100 text-neutral-700 border-neutral-200",
  red: "bg-red-50 text-red-700 border-red-200",
  amber: "bg-amber-50 text-amber-700 border-amber-200",
  emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
  blue: "bg-blue-50 text-blue-700 border-blue-200",
};

/**
 * Badge — status pill.
 * Props:
 *  variant  "neutral" | "red" | "amber" | "emerald" | "blue"
 *  size     "sm" | "md" (default "md")
 */
export function Badge({ variant = "neutral", size = "md", children, className }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-medium whitespace-nowrap",
        size === "sm" ? "px-1.5 py-px text-[10px]" : "px-2 py-0.5 text-[11px]",
        VARIANTS[variant] ?? VARIANTS.neutral,
        className,
      )}
    >
      {children}
    </span>
  );
}
