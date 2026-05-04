import { cn } from "@/lib/cn";

/**
 * Toolbar — matches Phase 1 search/filter/action bars.
 *
 * Props:
 *  left    ReactNode  — search inputs, filters (left-aligned)
 *  right   ReactNode  — primary action buttons (right-aligned)
 *  className
 */
export function Toolbar({ left, right, className }) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 px-5 py-3 border-b border-neutral-100 bg-white",
        className,
      )}
    >
      <div className="flex items-center gap-2 min-w-0 flex-1">{left}</div>
      {right ? <div className="flex items-center gap-2 shrink-0">{right}</div> : null}
    </div>
  );
}
