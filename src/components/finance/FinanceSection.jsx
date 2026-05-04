"use client";

import { cn } from "@/lib/cn";

/**
 * En-tête de section cockpit (titre + sous-titre + slot droite + animation stagger).
 */
export function FinanceSection({
  title,
  subtitle,
  eyebrow,
  right,
  children,
  className,
  delayClass = "",
  noAnimation = false,
}) {
  return (
    <section className={cn(!noAnimation && "finance-reveal", delayClass, className)}>
      {(eyebrow || title || subtitle || right) && (
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-4">
          <div className="min-w-0">
            {eyebrow && (
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 mb-1">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="text-lg font-bold text-neutral-900 tracking-tight">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-xs text-neutral-500 mt-1 max-w-2xl leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
          {right && <div className="shrink-0 flex items-center gap-2">{right}</div>}
        </div>
      )}
      {children}
    </section>
  );
}
