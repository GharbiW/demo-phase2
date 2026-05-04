"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { formatEuro } from "@/components/finance/money";
import { computeFinanceTourneeAggregate, m4Tournees } from "@/lib/demo-data";

/**
 * Bridge simplifié : CA → postes (baisses) → marge brute.
 * `steps`: [{ id, label, valueEuro, kind: 'start'|'out'|'result' }]
 */
export function BridgeWaterfall({ steps, className, compact = false, hideFooter = false }) {
  const [active, setActive] = useState(null);

  const safeSteps = Array.isArray(steps) ? steps : [];

  const maxAbs = useMemo(() => {
    if (!safeSteps.length) return 1;
    return Math.max(
      1,
      ...safeSteps.map((s) => Math.abs(s.valueEuro)),
    );
  }, [safeSteps]);

  return (
    <div className={cn("rounded-xl border border-neutral-200 bg-white p-4 shadow-sm", className)}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
            Bridge financier
          </p>
          <p className="text-xs text-neutral-500 mt-0.5">
            CA réalisé → coûts → marge brute (agrégat démo)
          </p>
        </div>
        {!compact && (
          <span className="text-[10px] text-neutral-400 font-money tabular-nums">Cliquer une barre</span>
        )}
      </div>
      <div className={cn("flex items-end justify-between gap-1 sm:gap-2", compact ? "min-h-[88px]" : "min-h-[140px]")}>
        {safeSteps.map((s) => {
          const hPct = (Math.abs(s.valueEuro) / maxAbs) * 100;
          const isStart = s.kind === "start";
          const isResult = s.kind === "result";
          const isOut = s.kind === "out";
          const selected = active === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setActive(selected ? null : s.id)}
              className={cn(
                "flex-1 flex flex-col items-center gap-1.5 min-w-0 group",
                isOut && "cursor-pointer",
              )}
            >
              <div
                className={cn(
                  "relative w-full flex flex-col justify-end rounded-md bg-neutral-50 border border-neutral-100 overflow-hidden",
                  compact ? "h-[56px]" : "h-[100px]",
                )}
              >
                <div
                  className={cn(
                    "w-full mx-auto rounded-t transition-all duration-500 ease-out",
                    isStart && "bg-neutral-800",
                    isOut && "bg-red-500/85 group-hover:bg-red-600",
                    isResult && (s.valueEuro >= 0 ? "bg-emerald-600" : "bg-red-700"),
                    selected && "ring-2 ring-offset-1 ring-neutral-900/30",
                  )}
                  style={{ height: `${Math.max(8, hPct)}%` }}
                />
              </div>
              <span
                className={cn(
                  "text-[9px] font-semibold text-center leading-tight line-clamp-2 uppercase tracking-wide text-neutral-500",
                  selected && "text-neutral-900",
                )}
              >
                {s.label}
              </span>
              <span
                className={cn(
                  "font-money text-[10px] sm:text-xs font-bold tabular-nums truncate max-w-full",
                  s.valueEuro < 0 && "text-red-600",
                  s.valueEuro > 0 && !isStart && "text-emerald-700",
                  isStart && "text-neutral-900",
                )}
              >
                {isOut ? formatEuro(s.valueEuro) : formatEuro(s.valueEuro)}
              </span>
            </button>
          );
        })}
      </div>
      {active && !hideFooter && (
        <p className="mt-3 text-[11px] text-neutral-600 border-t border-neutral-100 pt-2">
          Poste sélectionné : <strong>{safeSteps.find((x) => x.id === active)?.label}</strong>
          {" — "}impact direct sur la marge brute (démo).
        </p>
      )}
    </div>
  );
}

/** Construit les steps bridge à partir des agrégats tournées (CA → coûts réels → marge) */
export function buildTourneeBridgeSteps(agg) {
  const a =
    agg && typeof agg.ca === "number"
      ? agg
      : computeFinanceTourneeAggregate(m4Tournees);
  const ca = a.ca;
  const coutReel = a.coutReel;
  const marge = a.marge;
  return [
    { id: "ca", label: "CA réalisé", valueEuro: ca, kind: "start" },
    { id: "cout", label: "Coûts réels", valueEuro: -coutReel, kind: "out" },
    { id: "mg", label: "Marge brute", valueEuro: marge, kind: "result" },
  ];
}
