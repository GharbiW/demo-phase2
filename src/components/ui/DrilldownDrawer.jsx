"use client";

import { cn } from "@/lib/cn";

/**
 * DrilldownDrawer — right-side slide-in panel.
 *
 * Props:
 *  open      boolean
 *  title     string
 *  subtitle  string
 *  children  ReactNode
 *  onClose   function
 *  width     "sm" | "md" | "lg"  (default "md")
 *  footer    ReactNode — action row at the bottom
 */
export function DrilldownDrawer({ open, title, subtitle, children, onClose, width = "md", footer }) {
  if (!open) return null;

  const widthClass = {
    sm: "sm:w-[400px]",
    md: "sm:w-[520px]",
    lg: "sm:w-[680px]",
  };

  return (
    <div className="fixed inset-0 z-[80] flex">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden
      />
      <aside
        className={cn(
          "absolute right-0 top-0 h-full w-full bg-white border-l border-neutral-200 shadow-2xl flex flex-col",
          widthClass[width] ?? widthClass.md,
        )}
      >
        {/* Header */}
        <div className="h-14 px-5 border-b border-neutral-200 flex items-center justify-between gap-4 shrink-0">
          <div className="min-w-0">
            <div className="text-sm font-semibold text-neutral-900 truncate">{title}</div>
            {subtitle ? (
              <div className="text-xs text-neutral-500 truncate">{subtitle}</div>
            ) : null}
          </div>
          <button
            type="button"
            className="h-8 px-3 rounded-lg border border-neutral-200 bg-neutral-50 hover:bg-white text-sm text-neutral-700 transition-colors"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">{children}</div>

        {/* Footer */}
        {footer ? (
          <div className="shrink-0 border-t border-neutral-200 px-5 py-3 flex items-center gap-2 bg-neutral-50">
            {footer}
          </div>
        ) : null}
      </aside>
    </div>
  );
}

/**
 * DrawerSection — labeled section inside a drawer.
 */
export function DrawerSection({ title, children, className }) {
  return (
    <div className={cn("space-y-2", className)}>
      {title ? (
        <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
          {title}
        </div>
      ) : null}
      {children}
    </div>
  );
}

/**
 * DrawerRow — key/value row inside a drawer.
 */
export function DrawerRow({ label, value, highlight }) {
  return (
    <div className="flex items-start justify-between gap-4 py-1.5 border-b border-neutral-100 last:border-0">
      <span className="text-xs text-neutral-500 shrink-0">{label}</span>
      <span className={cn("text-xs font-medium text-right", highlight ? "text-[#E80912]" : "text-neutral-800")}>
        {value}
      </span>
    </div>
  );
}
