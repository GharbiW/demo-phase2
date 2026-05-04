"use client";

import { cn } from "@/lib/cn";
import { formatEuro, formatPct } from "@/components/finance/money";
import { Sparkline, demoSparkFromSeed } from "@/components/finance/Sparkline";

/**
 * Bandeau KPI finance — label, valeur principale, delta vs budget, sparkline optionnelle.
 */
export function FinanceKpiStrip({ items, className }) {
  return (
    <div
      className={cn(
        "grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5",
        className,
      )}
    >
      {items.map((item, i) => {
        const spark = item.spark ?? demoSparkFromSeed((item.label || "").length + i * 13);
        const neg = item.deltaEuro != null && item.deltaEuro < 0;
        const pos = item.deltaEuro != null && item.deltaEuro > 0;
        return (
          <div
            key={item.label}
            className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm flex flex-col gap-2 min-h-[108px]"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500 leading-tight">
                {item.label}
              </span>
              <Sparkline values={spark} width={64} height={26} />
            </div>
            <div className="font-money text-xl font-bold text-neutral-900 tabular-nums tracking-tight">
              {item.valueNode ?? formatEuro(item.valueEuro, { compact: item.compact })}
            </div>
            {item.sub && (
              <p className="text-[11px] text-neutral-500 leading-snug">{item.sub}</p>
            )}
            {item.deltaEuro != null && (
              <p
                className={cn(
                  "text-[11px] font-semibold font-money tabular-nums",
                  neg && "text-red-600",
                  pos && "text-emerald-700",
                  !neg && !pos && "text-neutral-500",
                )}
              >
                vs budget : {formatEuro(item.deltaEuro, { compact: true })}
                {item.deltaPct != null && (
                  <span className="text-neutral-400 font-normal ml-1">
                    ({formatPct(item.deltaPct, 1)})
                  </span>
                )}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
