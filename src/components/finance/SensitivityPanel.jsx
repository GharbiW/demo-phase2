"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { formatEuro, formatPct } from "@/components/finance/money";
import { financeBudgetKpis, computeFinanceTourneeAggregate, m4Tournees } from "@/lib/demo-data";

/**
 * What-if démo : ajuste GO €/L, km moyen, objectif marge — recalcul local (heuristique).
 */
export function SensitivityPanel({ className }) {
  const base = computeFinanceTourneeAggregate(m4Tournees);
  const [go, setGo] = useState(1.42);
  const [kmAdj, setKmAdj] = useState(100); // % autour du km moyen
  const [margeCible, setMargeCible] = useState(financeBudgetKpis.margePctBudget);

  const sim = useMemo(() => {
    const ca = base.ca;
    const kmFactor = kmAdj / 100;
    const fuelStress = (go - 1.42) * 42000 * kmFactor;
    const ciblePressure = (margeCible - financeBudgetKpis.margePctBudget) * 8500;
    const margeSim = base.marge - fuelStress - ciblePressure;
    const tx = (margeSim / ca) * 100;
    const gapBudget = margeSim / 1000 - financeBudgetKpis.margeBruteBudgetK;
    return { margeSim, tx, gapBudget };
  }, [base, go, kmAdj, margeCible]);

  return (
    <div className={cn("rounded-xl border border-neutral-200 bg-white p-4 shadow-sm", className)}>
      <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
        Sensibilité (what-if)
      </p>
      <p className="text-xs text-neutral-500 mt-0.5 mb-4">
        Simuler l’effet d’une hausse GO, d’un décalage kilométrique et d’un objectif de marge — chiffres indicatifs (démo).
      </p>
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block space-y-1.5">
          <span className="text-[11px] font-semibold text-neutral-700">GO € / L (+ stress carburant)</span>
          <input
            type="range"
            min="1.25"
            max="1.75"
            step="0.01"
            value={go}
            onChange={(e) => setGo(Number(e.target.value))}
            className="w-full accent-neutral-900"
          />
          <span className="font-money text-xs text-neutral-600 tabular-nums">{go.toFixed(2)} €/L</span>
        </label>
        <label className="block space-y-1.5">
          <span className="text-[11px] font-semibold text-neutral-700">Volume km (stress)</span>
          <input
            type="range"
            min="92"
            max="112"
            step="1"
            value={kmAdj}
            onChange={(e) => setKmAdj(Number(e.target.value))}
            className="w-full accent-neutral-900"
          />
          <span className="font-money text-xs text-neutral-600 tabular-nums">{kmAdj} % du référentiel</span>
        </label>
        <label className="block space-y-1.5">
          <span className="text-[11px] font-semibold text-neutral-700">Objectif marge %</span>
          <input
            type="range"
            min="9"
            max="15"
            step="0.2"
            value={margeCible}
            onChange={(e) => setMargeCible(Number(e.target.value))}
            className="w-full accent-neutral-900"
          />
          <span className="font-money text-xs text-neutral-600 tabular-nums">{margeCible.toFixed(1)} %</span>
        </label>
      </div>
      <div className="mt-4 grid sm:grid-cols-3 gap-3 rounded-lg bg-neutral-50 border border-neutral-100 p-3">
        <div>
          <p className="text-[10px] text-neutral-500 uppercase font-semibold">Marge simulée</p>
          <p className="font-money text-lg font-bold text-neutral-900 tabular-nums">{formatEuro(sim.margeSim)}</p>
        </div>
        <div>
          <p className="text-[10px] text-neutral-500 uppercase font-semibold">Taux marge</p>
          <p className="font-money text-lg font-bold text-neutral-900 tabular-nums">{formatPct(sim.tx, 1)}</p>
        </div>
        <div>
          <p className="text-[10px] text-neutral-500 uppercase font-semibold">Écart vs budget cible</p>
          <p
            className={cn(
              "font-money text-lg font-bold tabular-nums",
              sim.gapBudget < 0 ? "text-red-600" : "text-emerald-700",
            )}
          >
            {sim.gapBudget >= 0 ? "+" : ""}
            {sim.gapBudget.toFixed(1)} k€
          </p>
        </div>
      </div>
    </div>
  );
}
