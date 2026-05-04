"use client";

import { cn } from "@/lib/cn";

/**
 * HealthChip — colored left-border filter chip, inspired by the Parnass planning health-tiles.
 *
 * Props:
 *  label     string        — short uppercase label
 *  value     number|string — the count / value to display
 *  color     "emerald" | "red" | "amber" | "blue" | "violet" | "orange" | "neutral"
 *  isActive  boolean       — toggled / selected state
 *  onClick   () => void
 *  tooltip   string        — optional tooltip text
 */

const ACCENT = {
  emerald: {
    bar: "bg-emerald-500",
    ring: "ring-emerald-200",
    activeBg: "bg-emerald-50 border-emerald-200",
    activeText: "text-emerald-700",
    dot: "bg-emerald-500",
  },
  red: {
    bar: "bg-red-500",
    ring: "ring-red-200",
    activeBg: "bg-red-50 border-red-200",
    activeText: "text-red-700",
    dot: "bg-red-500",
  },
  amber: {
    bar: "bg-amber-400",
    ring: "ring-amber-200",
    activeBg: "bg-amber-50 border-amber-200",
    activeText: "text-amber-700",
    dot: "bg-amber-400",
  },
  blue: {
    bar: "bg-blue-500",
    ring: "ring-blue-200",
    activeBg: "bg-blue-50 border-blue-200",
    activeText: "text-blue-700",
    dot: "bg-blue-500",
  },
  violet: {
    bar: "bg-violet-500",
    ring: "ring-violet-200",
    activeBg: "bg-violet-50 border-violet-200",
    activeText: "text-violet-700",
    dot: "bg-violet-500",
  },
  orange: {
    bar: "bg-orange-500",
    ring: "ring-orange-200",
    activeBg: "bg-orange-50 border-orange-200",
    activeText: "text-orange-700",
    dot: "bg-orange-500",
  },
  neutral: {
    bar: "bg-neutral-400",
    ring: "ring-neutral-200",
    activeBg: "bg-neutral-100 border-neutral-300",
    activeText: "text-neutral-600",
    dot: "bg-neutral-400",
  },
  pink: {
    bar: "bg-pink-500",
    ring: "ring-pink-200",
    activeBg: "bg-pink-50 border-pink-200",
    activeText: "text-pink-700",
    dot: "bg-pink-500",
  },
};

export function HealthChip({ label, value, color = "neutral", isActive = false, onClick }) {
  const a = ACCENT[color] || ACCENT.neutral;
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-0 pl-0 pr-3 h-8 rounded-md border transition-all duration-150 cursor-pointer select-none overflow-hidden focus:outline-none",
        isActive
          ? cn("border-transparent ring-1 shadow-sm", a.ring, a.activeBg)
          : "bg-white border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 shadow-sm",
      )}
    >
      <span className={cn("w-[3.5px] self-stretch rounded-l mr-2 shrink-0", a.bar)} />
      <span className={cn("text-[10px] uppercase tracking-wide font-semibold mr-1.5 shrink-0", isActive ? a.activeText : "text-neutral-500")}>
        {label}
      </span>
      <span className={cn("text-[13px] font-extrabold tabular-nums leading-none", isActive ? a.activeText : "text-neutral-800")}>
        {value}
      </span>
    </button>
  );
}

/**
 * HealthChipRow — wraps a set of chips in a flex row.
 */
export function HealthChipRow({ children, className }) {
  return (
    <div className={cn("flex items-center gap-1.5 flex-wrap", className)}>
      {children}
    </div>
  );
}
