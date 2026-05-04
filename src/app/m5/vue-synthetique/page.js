"use client";

import { useState } from "react";
import { PageShell, SectionCard, KpiGrid, KpiTile } from "@/components/ui/PageShell";
import { Badge } from "@/components/ui/Badge";
import { DrilldownDrawer, DrawerSection, DrawerRow } from "@/components/ui/DrilldownDrawer";
import { m5KPIs, m5Alerts, m4Tournees, m4Clients, financeMonthlySeries, financeBudgetKpis, computeFinanceTourneeAggregate } from "@/lib/demo-data";
import { FinanceSection } from "@/components/finance/FinanceSection";
import { FinanceKpiStrip } from "@/components/finance/FinanceKpiStrip";
import { BridgeWaterfall, buildTourneeBridgeSteps } from "@/components/finance/BridgeWaterfall";
import { ForecastVsActual } from "@/components/finance/ForecastVsActual";
import { SensitivityPanel } from "@/components/finance/SensitivityPanel";
import { TrendingUp, TrendingDown, AlertTriangle, Activity, Sparkles, ArrowRight } from "lucide-react";
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
  const [selectedAlert, setSelectedAlert] = useState(null);
  const deficitaires = m4Tournees.filter((t) => t.statut === "deficit");
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
      label: "CA réalisé (portefeuille)",
      valueNode: <span className="font-money">{(caTotal / 1_000_000).toFixed(1)} M€</span>,
      deltaEuro: caTotal - caBudgetK,
      deltaPct: ((caTotal - caBudgetK) / caBudgetK) * 100,
      sub: "Somme clients actifs démo",
    },
    {
      label: "Marge brute",
      valueNode: <span className="font-money">{formatEuro(margeTotal)}</span>,
      deltaEuro: margeTotal - margeBudgetK,
      deltaPct: ((margeTotal - margeBudgetK) / margeBudgetK) * 100,
      sub: `Taux ${txMarge}%`,
    },
    {
      label: "Coûts réels (proxy)",
      valueNode: <span className="font-money">{formatEuro(caTotal - margeTotal)}</span>,
      sub: "CA − marge — lecture simplifiée",
    },
    {
      label: "Écart carburant (30 T)",
      valueNode: <span className="font-money">{formatEuro(agg.ecartCarburant)}</span>,
      sub: "Somme variance poste GO",
    },
  ];

  return (
    <PageShell
      title="P5.1 — Vue synthétique"
      subtitle="Cockpit rentabilité · 30 tournées · 10 clients · 10 chauffeurs"
      actions={
        <Link href="/m6/analyse-ecarts" className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-sm font-semibold transition-colors">
          Analyse écarts <ArrowRight className="w-4 h-4" />
        </Link>
      }
    >

      {/* AI Insight */}
      <AiInsightBanner
        label="IA — Chronopost marge structurellement négative — renégociation recommandée"
        insight="Analyse sur 4 mois consécutifs : Chronopost affiche un taux de marge négatif sur 3 mois (-2.3%, -1.8%, -3.1%). Pattern détecté : sous-estimation du coût GO nocturne. Recommandation IA Phase 3 : simuler une revalorisation tarifaire de +4.2% pour retrouver l'équilibre économique."
        confidence={82}
        action={{ label: "Simuler la renégociation", href: "/m6/simulations" }}
      />

      <div className="space-y-6 finance-reveal finance-reveal-delay-1">
        <FinanceSection
          eyebrow="Pilotage finance"
          title="Lecture exécutive — CA, marge, bridge, prévision"
          subtitle="Les montants clés pour arbitrer : écart vs budget, sensibilité carburant, trajectoire réelle vs prévision."
        />
        <FinanceKpiStrip items={financeStripItems} />
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <BridgeWaterfall steps={bridgeSteps} />
          <ForecastVsActual series={financeMonthlySeries} />
        </div>
        <SensitivityPanel />
      </div>

      {/* Ambition banner */}
      <div className="relative overflow-hidden rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-white px-5 py-4">
        <div className="absolute right-4 top-0 bottom-0 flex items-center opacity-10">
          <Sparkles className="w-24 h-24 text-emerald-600" />
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <Activity className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-0.5">Ambition Phase 2</div>
              <div className="text-sm font-semibold text-neutral-900">Delta ~600 k€/an non tracé → <span className="text-emerald-600">maintenant tracé poste par poste</span></div>
            </div>
          </div>
          <div className="sm:ml-auto flex flex-wrap gap-3">
            {[["14", "postes suivis"], ["6", "unités analyse"], ["11", "KPIs cibles"]].map(([v, l]) => (
              <div key={l} className="text-center">
                <div className="text-lg font-bold text-emerald-700">{v}</div>
                <div className="text-xs text-neutral-500">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* KPIs exécutifs (prompt) — liés période TopBar : {state.period} */}
      <KpiGrid cols={4}>
        <KpiTile
          label="CA total (k€)"
          value={`${ex.caTotalKEur.toLocaleString("fr-FR")} k€`}
          sub={`vs M-1 : ${caDeltaPct >= 0 ? "+" : ""}${caDeltaPct.toFixed(1)} % · période ${state.period}`}
          color={caDeltaPct >= 0 ? "ok" : "warn"}
        />
        <KpiTile
          label="Marge brute globale"
          value={`${ex.margeBrutePct.toFixed(1)} %`}
          sub="Portefeuille clients actifs démo"
          color={ex.margeBrutePct >= 10 ? "ok" : "warn"}
        />
        <KpiTile
          label="Taux km à vide (HLP)"
          value={`${ex.kmVidePct.toFixed(1)} %`}
          sub={kmUp ? `↑ vs ${ex.kmVidePrevPct.toFixed(1)} % M-1 — tendance rouge` : `Stable vs M-1 (${ex.kmVidePrevPct} %)`}
          color={kmUp ? "warn" : "ok"}
        />
        <KpiTile
          label="Coût moyen / km"
          value={`${ex.coutMoyenKmCents} c€`}
          sub="Coût complet chargé — agrégat démo"
        />
      </KpiGrid>
      {kmUp && (
        <div className="rounded-xl border border-red-100 bg-red-50/50 px-4 py-2">
          <p className="text-[11px] text-red-800 font-medium">Mini tendance km à vide (4 semaines)</p>
          <KmVideSparkline />
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        <SectionCard title="CA & marge nette — 12 semaines (Recharts)" className="xl:col-span-2" actions={<span className="text-xs text-neutral-400">k€</span>}>
          <ExecutiveComboChart />
        </SectionCard>

        <SectionCard title="Top / flop clients" description="Marge % sur périmètre démo">
          <div className="space-y-4">
            <div>
              <p className="text-[10px] font-bold uppercase text-emerald-700 mb-2">Top 3</p>
              <ul className="space-y-2">
                {cockpitTopClients.map((c) => (
                  <li key={c.client} className="flex justify-between text-xs border-b border-neutral-100 pb-2">
                    <span className="font-medium text-neutral-900">{c.client}</span>
                    <span className="font-mono text-emerald-700 font-semibold">+{c.margePct}%</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase text-red-700 mb-2">Flop 3</p>
              <ul className="space-y-2">
                {cockpitFlopClients.map((c) => (
                  <li key={c.client} className="flex justify-between text-xs border-b border-neutral-100 pb-2">
                    <span className="font-medium text-neutral-900">{c.client}</span>
                    <span className={`font-mono font-semibold ${c.margePct < 0 ? "text-red-600" : "text-amber-700"}`}>
                      {c.margePct}%
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </SectionCard>

        {/* KPIs with frequency labels */}
        <SectionCard title="11 KPIs cibles — fréquences de mise à jour">
          <div className="space-y-2">
            {m5KPIs.slice(0, 7).map((kpi) => (
              <div key={kpi.kpi} className="flex items-center gap-2 py-1.5 border-b border-neutral-50 last:border-0">
                <div className={`w-2 h-2 rounded-full shrink-0 ${kpi.color === "ok" ? "bg-emerald-400" : kpi.color === "warn" ? "bg-amber-400" : "bg-neutral-300"}`} />
                <span className="text-xs text-neutral-700 flex-1 font-medium">{kpi.kpi}</span>
                <Badge color="neutral" size="sm">{kpi.cadence}</Badge>
                <span className={`text-xs font-mono font-semibold ml-2 ${kpi.color === "ok" ? "text-emerald-600" : "text-amber-600"}`}>{kpi.value}</span>
              </div>
            ))}
            <Link href="/rentabilite/kpis" className="text-xs text-[#E80912] flex items-center gap-1 mt-2 hover:gap-2 transition-all">
              Voir les 11 KPIs complets <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </SectionCard>
      </div>

      {/* Client ranking */}
      <SectionCard title="Rentabilité par client — vue synthétique">
        <div className="space-y-2">
          {m4Clients.sort((a, b) => b.txMarge - a.txMarge).map((c) => (
            <div key={c.id} className={`flex items-center gap-4 rounded-lg border px-4 py-2.5 ${c.statut === "deficit" ? "border-red-200 bg-red-50/50" : "border-neutral-100 bg-white hover:border-neutral-200"} transition-colors`}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-neutral-900">{c.name}</span>
                  <Badge color={c.statut === "deficit" ? "red" : c.statut === "warn" ? "amber" : "emerald"} size="sm">
                    {c.statut === "deficit" ? "Déficitaire" : c.statut === "warn" ? "Risque" : "OK"}
                  </Badge>
                </div>
                <div className="text-xs text-neutral-400">{c.type} · {c.tournees} tournées</div>
              </div>
              <div className="text-right text-xs text-neutral-500">
                <div className="font-mono">{(c.ca / 1000000).toFixed(1)} M€ CA</div>
              </div>
              <div className="w-28 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${c.txMarge >= 12 ? "bg-emerald-500" : c.txMarge >= 0 ? "bg-amber-400" : "bg-red-500"}`}
                      style={{ width: `${Math.min(100, Math.max(0, c.txMarge + 10) * 2.5)}%` }}
                    />
                  </div>
                  <span className={`text-xs font-mono font-bold w-12 text-right ${c.txMarge >= 12 ? "text-emerald-600" : c.txMarge >= 0 ? "text-amber-600" : "text-red-600"}`}>
                    {c.txMarge}%
                  </span>
                </div>
              </div>
              {c.txMarge < 0
                ? <TrendingDown className="w-4 h-4 text-red-500 shrink-0" />
                : <TrendingUp className="w-4 h-4 text-emerald-500 shrink-0" />
              }
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Alerts */}
      <SectionCard title="Alertes actives" actions={
        <Link href="/m6/alertes" className="text-xs text-[#E80912] flex items-center gap-1 hover:gap-2 transition-all">
          Toutes les alertes <ArrowRight className="w-3 h-3" />
        </Link>
      }>
        <div className="space-y-2">
          {m5Alerts.map((a, idx) => (
            <div key={idx} className={`flex items-start gap-3 rounded-lg border px-3 py-2.5 cursor-pointer hover:shadow-sm transition-all ${a.severity === "high" ? "border-red-200 bg-red-50" : a.severity === "medium" ? "border-amber-200 bg-amber-50" : "border-neutral-200 bg-neutral-50"}`}
              onClick={() => setSelectedAlert(idx)}>
              <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${a.severity === "high" ? "text-red-500" : a.severity === "medium" ? "text-amber-500" : "text-neutral-400"}`} />
              <div className="flex-1">
                <div className="text-sm font-semibold text-neutral-900">{a.type}</div>
                <div className="text-xs text-neutral-500 leading-relaxed">{a.detail}</div>
              </div>
              <Badge color={a.severity === "high" ? "red" : a.severity === "medium" ? "amber" : "neutral"} size="sm">
                {a.severity === "high" ? "Élevé" : a.severity === "medium" ? "Moyen" : "Bas"}
              </Badge>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Selected alert drawer */}
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
