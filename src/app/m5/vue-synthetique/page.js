"use client";

import { useState } from "react";
import { PageShell, SectionCard, KpiGrid, KpiTile } from "@/components/ui/PageShell";
import { Badge } from "@/components/ui/Badge";
import { DrilldownDrawer, DrawerSection, DrawerRow } from "@/components/ui/DrilldownDrawer";
import { m5KPIs, m5Alerts, m4Tournees, m4Clients, financeMonthlySeries, financeBudgetKpis, computeFinanceTourneeAggregate } from "@/lib/demo-data";
import { FinanceKpiStrip } from "@/components/finance/FinanceKpiStrip";
import { BridgeWaterfall, buildTourneeBridgeSteps } from "@/components/finance/BridgeWaterfall";
import { ForecastVsActual } from "@/components/finance/ForecastVsActual";
import { SensitivityPanel } from "@/components/finance/SensitivityPanel";
import { TrendingUp, TrendingDown, AlertTriangle, ArrowRight, ChevronDown } from "lucide-react";
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

const MAX_ALERTS_VISIBLE = 4;

export default function VueSynthetiquePage() {
  const { state } = useDemoStore();
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [showAllAlerts, setShowAllAlerts] = useState(false);
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

  const visibleAlerts = showAllAlerts ? m5Alerts : m5Alerts.slice(0, MAX_ALERTS_VISIBLE);
  const sortedClients = [...m4Clients].sort((a, b) => b.txMarge - a.txMarge);

  return (
    <PageShell
      moduleLabel="M5 — Dashboard Rentabilité"
      title="Vue synthétique"
      description={`Cockpit rentabilité · 30 tournées · ${m4Clients.length} clients · période ${state.period}`}
      actions={
        <Link
          href="/m6/analyse-ecarts"
          className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-sm font-semibold transition-colors"
        >
          Analyse écarts <ArrowRight className="w-4 h-4" />
        </Link>
      }
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
          action={{ label: "Simuler la renégociation", href: "/m6/simulations" }}
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

        {/* ── 6. Client ranking + 11 KPIs ──────────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          <SectionCard title="Rentabilité par client" className="xl:col-span-2">
            <div className="space-y-1.5">
              {sortedClients.map((c) => (
                <div
                  key={c.id}
                  className={`flex items-center gap-4 rounded-lg border px-4 py-2.5 transition-colors ${
                    c.statut === "deficit"
                      ? "border-red-200 bg-red-50/40"
                      : c.statut === "warn"
                      ? "border-amber-100 bg-amber-50/30"
                      : "border-neutral-100 bg-white hover:bg-neutral-50"
                  }`}
                >
                  <div className="w-7 h-7 rounded-lg bg-neutral-100 text-neutral-700 text-[11px] font-bold flex items-center justify-center shrink-0">
                    {c.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-neutral-900 truncate">{c.name}</span>
                      <Badge
                        variant={c.statut === "deficit" ? "red" : c.statut === "warn" ? "amber" : "emerald"}
                        size="sm"
                      >
                        {c.statut === "deficit" ? "Déficitaire" : c.statut === "warn" ? "Risque" : "OK"}
                      </Badge>
                    </div>
                    <div className="text-[11px] text-neutral-400">{c.type} · {c.tournees} tournées</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-mono text-xs font-semibold text-neutral-700">{(c.ca / 1_000_000).toFixed(1)} M€</div>
                    <div className="text-[10px] text-neutral-400">CA</div>
                  </div>
                  <div className="w-32 shrink-0">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${c.txMarge >= 12 ? "bg-emerald-500" : c.txMarge >= 0 ? "bg-amber-400" : "bg-red-500"}`}
                          style={{ width: `${Math.min(100, Math.max(0, c.txMarge + 10) * 2.5)}%` }}
                        />
                      </div>
                      <span className={`text-xs font-mono font-bold w-10 text-right shrink-0 ${c.txMarge >= 12 ? "text-emerald-600" : c.txMarge >= 0 ? "text-amber-600" : "text-red-600"}`}>
                        {c.txMarge}%
                      </span>
                    </div>
                  </div>
                  {c.txMarge < 0
                    ? <TrendingDown className="w-4 h-4 text-red-400 shrink-0" />
                    : <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0" />
                  }
                </div>
              ))}
            </div>
          </SectionCard>

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
        </div>

        {/* ── 7. Alerts ────────────────────────────────────────────── */}
        <SectionCard
          title="Alertes actives"
          description={`${m5Alerts.length} alertes — ${m5Alerts.filter((a) => a.severity === "high").length} élevées`}
          actions={
            <Link href="/m6/alertes" className="text-xs text-[#E80912] flex items-center gap-1 hover:gap-2 transition-all font-semibold">
              Toutes <ArrowRight className="w-3 h-3" />
            </Link>
          }
        >
          <div className="space-y-2">
            {visibleAlerts.map((a, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-3 rounded-lg border px-3 py-2.5 cursor-pointer hover:shadow-sm transition-all ${
                  a.severity === "high"
                    ? "border-red-200 bg-red-50/60"
                    : a.severity === "medium"
                    ? "border-amber-200 bg-amber-50/60"
                    : "border-neutral-200 bg-neutral-50"
                }`}
                onClick={() => setSelectedAlert(idx)}
              >
                <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${a.severity === "high" ? "text-red-500" : a.severity === "medium" ? "text-amber-500" : "text-neutral-400"}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-neutral-900">{a.type}</div>
                  <div className="text-[11px] text-neutral-500 leading-relaxed mt-0.5 line-clamp-1">{a.detail}</div>
                </div>
                <Badge variant={a.severity === "high" ? "red" : a.severity === "medium" ? "amber" : "neutral"} size="sm">
                  {a.severity === "high" ? "Élevé" : a.severity === "medium" ? "Moyen" : "Bas"}
                </Badge>
              </div>
            ))}
          </div>
          {m5Alerts.length > MAX_ALERTS_VISIBLE && (
            <button
              type="button"
              onClick={() => setShowAllAlerts((v) => !v)}
              className="mt-3 flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-700 font-medium transition-colors"
            >
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showAllAlerts ? "rotate-180" : ""}`} />
              {showAllAlerts ? "Réduire" : `Voir les ${m5Alerts.length - MAX_ALERTS_VISIBLE} autres alertes`}
            </button>
          )}
        </SectionCard>

        {/* ── 8. Sensitivity (collapsible) ─────────────────────────── */}
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

      {/* Alert detail drawer */}
      {selectedAlert !== null && (
        <DrilldownDrawer
          open={selectedAlert !== null}
          onClose={() => setSelectedAlert(null)}
          title={m5Alerts[selectedAlert]?.type}
          subtitle="Détail de l'alerte"
        >
          <DrawerSection title="Alerte">
            <DrawerRow label="Type" value={m5Alerts[selectedAlert]?.type} />
            <DrawerRow label="Sévérité" value={m5Alerts[selectedAlert]?.severity} />
            <DrawerRow label="Détail" value={m5Alerts[selectedAlert]?.detail} />
          </DrawerSection>
        </DrilldownDrawer>
      )}
    </PageShell>
  );
}
