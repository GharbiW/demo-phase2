import { cn } from "@/lib/cn";

const VARIANTS = {
  primary: "bg-[#E80912] hover:bg-[#c7080f] text-white border-transparent",
  secondary: "bg-neutral-900 hover:bg-neutral-800 text-white border-transparent",
  ghost: "bg-transparent hover:bg-neutral-100 text-neutral-800 border-neutral-200",
  outline: "bg-white hover:bg-neutral-50 text-neutral-800 border-neutral-200",
  danger: "bg-red-600 hover:bg-red-700 text-white border-transparent",
};

const SIZES = {
  sm: "h-8 px-3 text-xs gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-11 px-5 text-sm gap-2",
};

export function Button({
  variant = "outline",
  size = "md",
  children,
  className,
  icon,
  ...props
}) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center justify-center font-medium rounded-lg border transition-colors cursor-pointer select-none",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        VARIANTS[variant] ?? VARIANTS.outline,
        SIZES[size] ?? SIZES.md,
        className,
      )}
      {...props}
    >
      {icon ? <span className="shrink-0">{icon}</span> : null}
      {children}
    </button>
  );
}
