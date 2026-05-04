"use client";

import { cn } from "@/lib/cn";
import { formatEuro } from "@/components/finance/money";

/**
 * Pareto horizontal — impact € par poste (valeurs négatives = dégradation marge).
 */
export function ContributionBars({ rows, className }) {
  const max = Math.max(1, ...rows.map((r) => Math.abs(r.impactEuro)));
  return (
    <div className={cn("rounded-xl border border-neutral-200 bg-white p-4 shadow-sm", className)}>
      <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
        Contribution aux écarts
      </p>
      <p className="text-xs text-neutral-500 mb-4">
        Répartition de l’impact sur la marge (somme des écarts par poste — 30 tournées démo).
      </p>
      <div className="space-y-3">
        {rows.map((r) => {
          const w = (Math.abs(r.impactEuro) / max) * 100;
          const neg = r.impactEuro < 0;
          return (
            <div key={r.id}>
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-xs font-semibold text-neutral-800 truncate">{r.label}</span>
                <span
                  className={cn(
                    "font-money text-xs font-bold tabular-nums shrink-0",
                    neg ? "text-red-600" : "text-emerald-700",
                  )}
                >
                  {formatEuro(r.impactEuro)}
                </span>
              </div>
              <div className="h-2 rounded-full bg-neutral-100 overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-700 ease-out",
                    neg ? "bg-red-500" : "bg-emerald-500",
                  )}
                  style={{ width: `${w}%` }}
                />
              </div>
              <p className="text-[10px] text-neutral-400 mt-0.5">{r.hint}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
