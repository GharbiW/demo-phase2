"use client";

import { useState } from "react";
import { PageShell, SectionCard, KpiGrid, KpiTile } from "@/components/ui/PageShell";
import { Badge } from "@/components/ui/Badge";
import { m5KPIs, m4Tournees, m4Clients, financeMonthlySeries, financeBudgetKpis, computeFinanceTourneeAggregate } from "@/lib/demo-data";
import { FinanceKpiStrip } from "@/components/finance/FinanceKpiStrip";
import { BridgeWaterfall, buildTourneeBridgeSteps } from "@/components/finance/BridgeWaterfall";
import { ForecastVsActual } from "@/components/finance/ForecastVsActual";
import { SensitivityPanel } from "@/components/finance/SensitivityPanel";
import { ArrowRight, ChevronDown } from "lucide-react";
import { AiInsightBanner } from "@/components/ui/AiInsightBanner";
import Link from "next/link";
import { formatEuro } from "@/components/finance/money";
import { useDemoStore } from "@/stores/demoStore";
import {
  cockpitExecutiveKpis,
  cockpitTopClients,
  cockpitFlopClients,
} from "@/lib/cockpit-mock-data";
import { ExecutiveComboChart } from "@/components/cockpit/ExecutiveComboChart";
import { KmVideSparkline } from "@/components/cockpit/KmVideSparkline";

export default function VueSynthetiquePage() {
  const { state } = useDemoStore();
  const [showSensitivity, setShowSensitivity] = useState(false);

  const ex = cockpitExecutiveKpis;
  const caDeltaPct = ((ex.caTotalKEur - ex.caPrevKEur) / ex.caPrevKEur) * 100;
  const kmUp = ex.kmVidePct > ex.kmVidePrevPct;

  const caTotal = m4Clients.reduce((s, c) => s + c.ca, 0);
  const margeTotal = m4Clients.reduce((s, c) => s + c.marge, 0);
  const txMarge = ((margeTotal / caTotal) * 100).toFixed(1);

  const agg = computeFinanceTourneeAggregate(m4Tournees);
  const bridgeSteps = buildTourneeBridgeSteps(agg);
  const margeBudgetK = financeBudgetKpis.margeBruteBudgetK * 1000;
  const caBudgetK = financeBudgetKpis.caMensuelBudgetK * 1000;

  const financeStripItems = [
    {
      label: "CA réalisé",
      valueNode: <span className="font-money">{(caTotal / 1_000_000).toFixed(1)} M€</span>,
      deltaEuro: caTotal - caBudgetK,
      deltaPct: ((caTotal - caBudgetK) / caBudgetK) * 100,
      sub: "vs budget",
    },
    {
      label: "Marge brute",
      valueNode: <span className="font-money">{formatEuro(margeTotal)}</span>,
      deltaEuro: margeTotal - margeBudgetK,
      deltaPct: ((margeTotal - margeBudgetK) / margeBudgetK) * 100,
      sub: `Taux ${txMarge}%`,
    },
    {
      label: "Coûts réels",
      valueNode: <span className="font-money">{formatEuro(caTotal - margeTotal)}</span>,
      sub: "CA − marge",
    },
    {
      label: "Écart carburant",
      valueNode: <span className="font-money">{formatEuro(agg.ecartCarburant)}</span>,
      sub: "Variance GO — 30 tournées",
    },
  ];

  return (
    <PageShell
      moduleLabel="Rentabilité"
      title="Vue synthétique"
      description={`Cockpit rentabilité · 30 tournées · ${m4Clients.length} clients · période ${state.period}`}
      bare
    >
      <div className="space-y-8">

        {/* ── 1. Hero KPIs ─────────────────────────────────────────── */}
        <KpiGrid cols={4}>
          <KpiTile
            label="CA total"
            value={`${ex.caTotalKEur.toLocaleString("fr-FR")} k€`}
            sub={`vs M-1 : ${caDeltaPct >= 0 ? "+" : ""}${caDeltaPct.toFixed(1)}%`}
            color={caDeltaPct >= 0 ? "ok" : "warn"}
            trend={caDeltaPct >= 0 ? "up" : "down"}
          />
          <KpiTile
            label="Marge brute"
            value={`${ex.margeBrutePct.toFixed(1)}%`}
            sub="Taux portefeuille clients"
            color={ex.margeBrutePct >= 10 ? "ok" : "warn"}
            trend={ex.margeBrutePct >= 10 ? "up" : "down"}
          />
          <KpiTile
            label="Taux km à vide"
            value={`${ex.kmVidePct.toFixed(1)}%`}
            sub={kmUp ? `↑ vs ${ex.kmVidePrevPct.toFixed(1)}% M-1` : `Stable vs M-1`}
            color={kmUp ? "warn" : "ok"}
            trend={kmUp ? "down" : "up"}
          />
          <KpiTile
            label="Coût moyen / km"
            value={`${ex.coutMoyenKmCents} c€`}
            sub="Coût complet chargé"
          />
        </KpiGrid>

        {/* km à vide sparkline (only when alert) */}
        {kmUp && (
          <div className="rounded-xl border border-amber-200 bg-amber-50/40 px-4 py-3">
            <p className="text-xs font-semibold text-amber-800 mb-2">Tendance km à vide — 4 semaines</p>
            <KmVideSparkline />
          </div>
        )}

        {/* ── 2. AI Insight ────────────────────────────────────────── */}
        <AiInsightBanner
          label="IA — Chronopost marge structurellement négative — renégociation recommandée"
          insight="Analyse sur 4 mois consécutifs : Chronopost affiche un taux de marge négatif sur 3 mois (-2.3%, -1.8%, -3.1%). Pattern détecté : sous-estimation du coût GO nocturne. Recommandation IA Phase 3 : simuler une revalorisation tarifaire de +4.2% pour retrouver l'équilibre économique."
          confidence={82}
        />

        {/* ── 3. Finance KPI strip ─────────────────────────────────── */}
        <FinanceKpiStrip items={financeStripItems} />

        {/* ── 4. Chart + Top/Flop clients ──────────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <SectionCard
            title="CA & marge nette — 12 semaines"
            className="xl:col-span-2"
            actions={<span className="text-xs text-neutral-400">k€</span>}
          >
            <ExecutiveComboChart />
          </SectionCard>

          <SectionCard title="Top / Flop clients" description="Taux de marge %">
            <div className="space-y-5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 mb-3">Top 3</p>
                <ul className="space-y-2.5">
                  {cockpitTopClients.map((c) => (
                    <li key={c.client} className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-700 text-[10px] font-bold flex items-center justify-center shrink-0">
                          {c.client[0]}
                        </div>
                        <span className="text-xs font-medium text-neutral-800 truncate">{c.client}</span>
                      </div>
                      <span className="font-mono text-xs font-bold text-emerald-600 shrink-0">+{c.margePct}%</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border-t border-neutral-100 pt-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-red-700 mb-3">Flop 3</p>
                <ul className="space-y-2.5">
                  {cockpitFlopClients.map((c) => (
                    <li key={c.client} className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-6 h-6 rounded-md bg-red-50 text-red-700 text-[10px] font-bold flex items-center justify-center shrink-0">
                          {c.client[0]}
                        </div>
                        <span className="text-xs font-medium text-neutral-800 truncate">{c.client}</span>
                      </div>
                      <span className={`font-mono text-xs font-bold shrink-0 ${c.margePct < 0 ? "text-red-600" : "text-amber-700"}`}>
                        {c.margePct}%
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </SectionCard>
        </div>

        {/* ── 5. Bridge + Forecast ─────────────────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <BridgeWaterfall steps={bridgeSteps} />
          <ForecastVsActual series={financeMonthlySeries} />
        </div>

        {/* ── 6. 11 KPIs ───────────────────────────────────────────── */}
        <SectionCard
            title="11 KPIs cibles"
            description="Fréquences de mise à jour"
            actions={
              <Link href="/rentabilite/kpis" className="text-xs text-[#E80912] flex items-center gap-1 hover:gap-2 transition-all font-semibold">
                Voir tout <ArrowRight className="w-3 h-3" />
              </Link>
            }
          >
            <div className="space-y-1">
              {m5KPIs.slice(0, 7).map((kpi) => (
                <div key={kpi.kpi} className="flex items-center gap-2.5 py-2 border-b border-neutral-50 last:border-0">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${kpi.color === "ok" ? "bg-emerald-400" : kpi.color === "warn" ? "bg-amber-400" : "bg-neutral-300"}`} />
                  <span className="text-xs text-neutral-700 flex-1 font-medium leading-tight">{kpi.kpi}</span>
                  <Badge variant="neutral" size="sm">{kpi.cadence}</Badge>
                  <span className={`text-xs font-mono font-semibold w-20 text-right shrink-0 ${kpi.color === "ok" ? "text-emerald-600" : "text-amber-600"}`}>
                    {kpi.value}
                  </span>
                </div>
              ))}
            </div>
          </SectionCard>

        {/* ── 7. Sensitivity (collapsible) ─────────────────────────── */}
        <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden">
          <button
            type="button"
            onClick={() => setShowSensitivity((v) => !v)}
            className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-neutral-50 transition-colors"
          >
            <div>
              <p className="text-sm font-semibold text-neutral-900">Analyse de sensibilité</p>
              <p className="text-xs text-neutral-500 mt-0.5">Impact carburant, RH, taux utilisation sur la marge</p>
            </div>
            <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform shrink-0 ${showSensitivity ? "rotate-180" : ""}`} />
          </button>
          {showSensitivity && (
            <div className="border-t border-neutral-100 p-5">
              <SensitivityPanel />
            </div>
          )}
        </div>

      </div>
    </PageShell>
  );
}
