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
      {/* Backdrop — covers full viewport including topbar */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
        onClick={onClose}
        aria-hidden
      />
      {/* Panel — starts below the topbar (3.5rem = 56px) */}
      <aside
        className={cn(
          "absolute right-0 w-full bg-white border-l border-neutral-200 shadow-2xl flex flex-col",
          "top-14 h-[calc(100vh-3.5rem)]",
          widthClass[width] ?? widthClass.md,
        )}
      >
        {/* Header */}
        <div className="h-14 px-5 border-b border-neutral-200 flex items-center justify-between gap-4 shrink-0 bg-white">
          <div className="min-w-0">
            <div className="text-sm font-semibold text-neutral-900 truncate">{title}</div>
            {subtitle ? (
              <div className="text-xs text-neutral-500 truncate">{subtitle}</div>
            ) : null}
          </div>
          <button
            type="button"
            className="h-8 w-8 rounded-lg border border-neutral-200 bg-neutral-50 hover:bg-white text-neutral-500 hover:text-neutral-900 transition-colors flex items-center justify-center text-sm font-medium"
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
        <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 pb-1">
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

/**
 * DrawerChart — standardised chart container inside a drawer.
 * Adds label, consistent height, background and border.
 */
export function DrawerChart({ title, children, height = 180 }) {
  return (
    <div className="rounded-xl border border-neutral-100 bg-neutral-50/80 overflow-hidden">
      {title && (
        <div className="px-3 pt-3 pb-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">{title}</p>
        </div>
      )}
      <div style={{ height }} className="w-full px-1 pb-2">
        {children}
      </div>
    </div>
  );
}
