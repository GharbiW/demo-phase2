"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { formatEuro, formatPct } from "@/components/finance/money";
import { BridgeWaterfall, buildTourneeBridgeSteps } from "@/components/finance/BridgeWaterfall";
import { financeBudgetKpis, computeFinanceTourneeAggregate, m4Tournees } from "@/lib/demo-data";

/**
 * Bandeau d’accroche finance sur la home (chiffres + mini bridge).
 */
export function HomeCockpitStrip({ className }) {
  const agg = computeFinanceTourneeAggregate(m4Tournees);
  const caK = agg.ca / 1000;
  const margeK = agg.marge / 1000;
  const tx = (agg.marge / agg.ca) * 100;
  const budgetGapK = margeK - financeBudgetKpis.margeBruteBudgetK;

  const miniSteps = buildTourneeBridgeSteps(agg);

  return (
    <div className={cn("finance-reveal finance-reveal-delay-1", className)}>
      <div className="rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-neutral-100 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">
              Cockpit rentabilité · agrégat démo (30 tournées)
            </p>
            <h2 className="text-lg font-bold text-neutral-900 mt-1 tracking-tight">
              Mesurer la marge réelle, expliquer l’écart, arbitrer en €
            </h2>
          </div>
          <Link
            href="/rentabilite/synthese"
            className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-sm font-semibold shrink-0"
          >
            Ouvrir le cockpit <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid lg:grid-cols-[1fr_minmax(260px,320px)] gap-0 lg:divide-x divide-neutral-100">
          <div className="p-5 grid sm:grid-cols-3 gap-4">
            <div className="rounded-lg border border-neutral-100 bg-neutral-50/80 p-4">
              <p className="text-[10px] font-semibold uppercase text-neutral-500">CA réalisé</p>
              <p className="font-money text-2xl font-bold text-neutral-900 tabular-nums mt-1">
                {caK.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} k€
              </p>
              <p className="text-[11px] text-neutral-500 mt-2">Somme des 30 tournées analysées</p>
            </div>
            <div className="rounded-lg border border-neutral-100 bg-neutral-50/80 p-4">
              <p className="text-[10px] font-semibold uppercase text-neutral-500">Marge brute</p>
              <p className="font-money text-2xl font-bold text-neutral-900 tabular-nums mt-1">
                {formatEuro(agg.marge, { compact: true })}
              </p>
              <p className="text-[11px] text-emerald-800 mt-2 font-semibold tabular-nums">
                {formatPct(tx, 1)} du CA
              </p>
            </div>
            <div className="rounded-lg border border-neutral-100 bg-neutral-50/80 p-4">
              <p className="text-[10px] font-semibold uppercase text-neutral-500">Écart vs budget marge</p>
              <p
                className={cn(
                  "font-money text-2xl font-bold tabular-nums mt-1",
                  budgetGapK < 0 ? "text-red-600" : "text-emerald-700",
                )}
              >
                {budgetGapK >= 0 ? "+" : ""}
                {budgetGapK.toFixed(1)} k€
              </p>
              <p className="text-[11px] text-neutral-500 mt-2">
                Budget cible {financeBudgetKpis.margeBruteBudgetK} k€ / mois
              </p>
            </div>
          </div>
          <div className="p-4 lg:p-5 bg-neutral-50/50">
            <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-2">
              Mini bridge
            </p>
            <BridgeWaterfall
              steps={miniSteps}
              compact
              hideFooter
              className="border-0 shadow-none bg-transparent p-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
