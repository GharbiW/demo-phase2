import { cn } from "@/lib/cn";

/**
 * PageShell — master layout for every demo page.
 *
 * Layout modes
 *  - default: white card wrapper with shadow (existing behaviour)
 *  - bare:    no card wrapper (pages manage their own surfaces)
 *
 * Props:
 *  moduleLabel string   — small uppercase label above title
 *  title       string
 *  description string
 *  actions     ReactNode — rendered in the header action slot
 *  tabs        ReactNode — rendered below the header (inside the card, before children) — use Tabs/TabsList from Tabs.jsx
 *  bare        boolean  — skip the card wrapper
 *  noPad       boolean  — remove default p-5 inside card
 *  className   string
 */
export function PageShell({
  moduleLabel,
  title,
  description,
  children,
  actions,
  tabs,
  bare = false,
  noPad = false,
  className,
}) {
  return (
    <div className={cn("px-6 py-6", className)}>
      <div className="max-w-[1400px] mx-auto">
        {/* ── Header ─────────────────────────────────────────────── */}
        <div className="flex items-start justify-between gap-6 mb-5">
          <div className="min-w-0">
            {moduleLabel ? (
              <div className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400 mb-1">
                {moduleLabel}
              </div>
            ) : null}
            <h1 className="text-xl font-semibold tracking-tight text-neutral-900 leading-snug">
              {title}
            </h1>
            {description ? (
              <p className="mt-1 text-sm text-neutral-500 max-w-2xl">{description}</p>
            ) : null}
          </div>
          {actions ? (
            <div className="flex items-center gap-2 shrink-0">{actions}</div>
          ) : null}
        </div>

        {/* ── Content ────────────────────────────────────────────── */}
        {bare ? (
          <>{children}</>
        ) : (
          <div className="rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
            {tabs ? <div className="border-b border-neutral-200">{tabs}</div> : null}
            <div className={cn(!noPad && "p-5")}>{children}</div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * SectionCard — a secondary white card for use inside bare pages.
 */
export function SectionCard({ title, description, children, className, actions, noPad }) {
  return (
    <div className={cn("rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden", className)}>
      {(title || description || actions) && (
        <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-neutral-100">
          <div>
            {title && <div className="text-sm font-semibold text-neutral-900">{title}</div>}
            {description && <div className="text-xs text-neutral-500 mt-0.5">{description}</div>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className={cn(!noPad && "p-5")}>{children}</div>
    </div>
  );
}

/**
 * KpiGrid — responsive grid for KPI tiles.
 */
export function KpiGrid({ children, cols = 4 }) {
  const colClass = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 xl:grid-cols-4",
    5: "grid-cols-2 sm:grid-cols-3 xl:grid-cols-5",
  };
  return (
    <div className={cn("grid gap-4", colClass[cols] ?? colClass[4])}>
      {children}
    </div>
  );
}

/**
 * KpiTile — single KPI card, matching Phase 1 density.
 */
export function KpiTile({
  label,
  value,
  sub,
  trend,
  icon,
  accent = false,
  onClick,
  className,
}) {
  const trendColor =
    trend === "up" ? "text-emerald-600" : trend === "down" ? "text-red-600" : "text-neutral-400";

  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-xl border bg-white px-5 py-4 transition-shadow",
        accent
          ? "border-[#E80912]/30 bg-red-50"
          : "border-neutral-200 hover:border-neutral-300",
        onClick && "cursor-pointer hover:shadow-md",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs font-medium text-neutral-500 leading-tight">{label}</span>
        {icon ? (
          <span className="text-neutral-400 mt-0.5">{icon}</span>
        ) : null}
      </div>
      <div className={cn("mt-2 text-2xl font-semibold tracking-tight", accent ? "text-[#E80912]" : "text-neutral-900")}>
        {value}
      </div>
      {sub ? (
        <div className={cn("mt-1 text-xs", trendColor)}>{sub}</div>
      ) : null}
    </div>
  );
}
