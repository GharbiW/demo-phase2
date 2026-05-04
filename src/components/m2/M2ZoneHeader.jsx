"use client";

import { cn } from "@/lib/cn";

/**
 * En-tête visuel partagé des pages M2 — fond mesh, accent marque.
 */
export function M2ZoneHeader({ eyebrow = "M2 — Hub données & coûts", title, subtitle, children, className }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-neutral-200/90",
        "bg-white/80 backdrop-blur-md shadow-sm",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-90"
        style={{
          background:
            "radial-gradient(900px 280px at 0% 0%, rgba(232, 9, 18, 0.07), transparent 55%), radial-gradient(700px 240px at 100% 100%, rgba(15, 23, 42, 0.06), transparent 50%)",
        }}
      />
      <div className="relative flex flex-col gap-3 px-5 py-5 sm:px-6 sm:py-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">{eyebrow}</p>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950">{title}</h1>
          {subtitle ? <p className="text-sm text-neutral-600 max-w-2xl leading-relaxed">{subtitle}</p> : null}
        </div>
        {children ? <div className="flex flex-wrap items-center gap-2 shrink-0">{children}</div> : null}
      </div>
    </div>
  );
}
