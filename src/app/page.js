"use client";

import Link from "next/link";
import {
  ArrowRight, BarChart3, Truck, Database, Calculator,
  TrendingUp, Brain, Sparkles, ChevronRight, Lock, Layers, LineChart,
} from "lucide-react";
import { HomeCockpitStrip } from "@/components/finance/HomeCockpitStrip";

const MODULES = [
  {
    num: "M1",
    title: "Commercial & Tarification",
    subtitle: "Le moteur de revenu",
    href: "/m1/adv-contrats",
    icon: TrendingUp,
    color: "bg-[#E80912]",
    textColor: "text-[#E80912]",
    links: [
      { label: "Contrats ADV", href: "/m1/adv-contrats" },
      { label: "CA théorique", href: "/m1/ca-theorique" },
      { label: "Indexation carburant", href: "/m1/indexation-carburant" },
      { label: "Chiffrage Spot", href: "/m1/chiffrage-spot" },
    ],
  },
  {
    num: "M2",
    title: "Data Cost Hub",
    subtitle: "La base de vérité des coûts",
    href: "/m2",
    icon: Database,
    color: "bg-violet-600",
    textColor: "text-violet-700",
    links: [
      { label: "Sources & connecteurs", href: "/m2" },
      { label: "Pipeline ETL", href: "/m2" },
      { label: "Qualité & alertes", href: "/m2" },
      { label: "Gouvernance RACI", href: "/m2" },
    ],
  },
  {
    num: "M3",
    title: "Cost Engine",
    subtitle: "Le moteur de calcul",
    href: "/m3/grille-couts",
    icon: Calculator,
    color: "bg-amber-600",
    textColor: "text-amber-700",
    links: [
      { label: "Grille 13 postes", href: "/m3/grille-couts" },
      { label: "Coûts théoriques", href: "/m3/couts-theoriques" },
      { label: "Coûts réels", href: "/m3/ingestion-couts-reels" },
      { label: "Règles d'allocation", href: "/m3/regles-allocation" },
    ],
  },
  {
    num: "M4",
    title: "Profitability Engine",
    subtitle: "Le moteur d'analyse",
    href: "/rentabilite/par-tournee",
    icon: BarChart3,
    color: "bg-emerald-600",
    textColor: "text-emerald-700",
    links: [
      { label: "Par tournée", href: "/rentabilite/par-tournee" },
      { label: "Par client", href: "/rentabilite/par-client" },
      { label: "Par chauffeur", href: "/rentabilite/par-chauffeur" },
      { label: "Analyse des écarts", href: "/rentabilite/analyse-ecarts" },
    ],
  },
  {
    num: "M5",
    title: "Dashboard Rentabilité",
    subtitle: "Le cockpit de pilotage",
    href: "/rentabilite/synthese",
    icon: Layers,
    color: "bg-sky-600",
    textColor: "text-sky-700",
    links: [
      { label: "Synthèse cockpit", href: "/rentabilite/synthese" },
      { label: "KPIs détaillés", href: "/rentabilite/kpis" },
      { label: "Théorique vs Réel", href: "/rentabilite/theorique-reel" },
      { label: "Alertes", href: "/rentabilite/alertes" },
    ],
  },
  {
    num: "M6",
    title: "Decision Support",
    subtitle: "L'assistant stratégique",
    href: "/m6",
    icon: Brain,
    color: "bg-neutral-400",
    textColor: "text-neutral-500",
    locked: true,
    links: [
      { label: "Recommandations IA", href: "/m6/recommandations" },
      { label: "Simulations what-if", href: "/m6/simulations" },
      { label: "Analyse écarts", href: "/m6/analyse-ecarts" },
      { label: "Alertes", href: "/m6/alertes" },
    ],
  },
];

const QUICK_ACTIONS = [
  { label: "Cockpit Rentabilité", href: "/rentabilite/synthese", icon: BarChart3, badge: "Live" },
  { label: "Tournées", href: "/rentabilite/par-tournee", icon: Truck, badge: null },
  { label: "Grille Coûts", href: "/m3/grille-couts", icon: Calculator, badge: null },
  { label: "Recommandations IA", href: "/m6/recommandations", icon: Brain, badge: "IA" },
];

function ModuleCard({ module }) {
  const Icon = module.icon;

  return (
    <div className={`group rounded-2xl border bg-white shadow-sm overflow-hidden flex flex-col transition-all ${module.locked ? "opacity-80 border-neutral-200" : "border-neutral-200 hover:shadow-md hover:border-neutral-300"}`}>
      {/* Header */}
      <Link href={module.href} className="block p-5 pb-4 relative">
        {module.locked && (
          <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-neutral-100 border border-neutral-200 px-2 py-0.5 text-[10px] font-semibold text-neutral-500">
            <Lock className="w-2.5 h-2.5" />
            Phase 3
          </div>
        )}
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-xl ${module.color} text-white flex items-center justify-center shrink-0 shadow-sm`}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="min-w-0 pr-16">
            <div className="flex items-center gap-2 mb-0.5">
              <span className={`text-[10px] font-bold uppercase tracking-widest ${module.textColor}`}>{module.num}</span>
            </div>
            <div className="text-sm font-semibold text-neutral-900 leading-tight">{module.title}</div>
            <div className="text-xs text-neutral-500 mt-0.5 leading-tight">{module.subtitle}</div>
          </div>
        </div>
      </Link>

      {/* Quick links */}
      <div className="border-t border-neutral-100 mt-auto">
        {module.links.map((link, i) => (
          <Link
            key={`${link.href}-${i}`}
            href={link.href}
            className={`flex items-center justify-between px-5 py-2.5 text-xs font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 transition-colors ${i > 0 ? "border-t border-neutral-50" : ""}`}
          >
            <span>{link.label}</span>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-300 group-hover:text-neutral-400" />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-neutral-50">

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <div className="bg-neutral-950 border-b border-neutral-800">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(232,9,18,0.18),transparent_65%)]" />
          <div className="relative max-w-[1400px] mx-auto px-6 py-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-neutral-700 bg-neutral-900/60 px-3 py-1 text-xs text-neutral-400 mb-4">
                  <Sparkles className="h-3.5 w-3.5 text-[#E80912]" />
                  Phase 2 · Démo statique · 5 mai 2026
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight leading-snug">
                  Cockpit économique <span className="text-[#E80912]">Parnass</span>
                </h1>
                <p className="mt-2 text-neutral-400 text-sm max-w-lg">
                  Maîtrise de la rentabilité d&apos;exploitation — CA, coûts, marges et alertes en temps réel.
                </p>
              </div>

              {/* Quick stats */}
              <div className="flex gap-6 md:gap-8 shrink-0">
                {[["1,94 M€", "CA agrégé"], ["13", "postes de coûts"], ["6", "dimensions analyse"]].map(([v, l]) => (
                  <div key={l} className="text-center">
                    <div className="text-xl font-bold text-white tabular-nums">{v}</div>
                    <div className="text-[11px] text-neutral-500 mt-0.5">{l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick actions */}
            <div className="mt-6 flex flex-wrap gap-2">
              {QUICK_ACTIONS.map((a) => {
                const Icon = a.icon;
                return (
                  <Link
                    key={a.href}
                    href={a.href}
                    className="inline-flex items-center gap-2 h-8 px-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-200 text-xs font-medium transition-colors"
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {a.label}
                    {a.badge && (
                      <span className="ml-1 px-1.5 py-0.5 rounded-full bg-[#E80912] text-white text-[9px] font-bold leading-none">
                        {a.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-8 space-y-8">

        {/* ── Live KPI Strip ────────────────────────────────────── */}
        <HomeCockpitStrip />

        {/* ── Modules ──────────────────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-neutral-400">Navigation</div>
              <div className="text-base font-semibold text-neutral-900 mt-0.5">6 modules</div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {MODULES.map((m) => (
              <ModuleCard key={m.num} module={m} />
            ))}
          </div>
        </section>

        {/* ── Guided tour ──────────────────────────────────────── */}
        <section>
          <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-neutral-900">Parcours rapide — 5 étapes</div>
                <div className="text-xs text-neutral-500 mt-0.5">Valeur complète en 20 minutes</div>
              </div>
              <Link
                href="/rentabilite/synthese"
                className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-[#E80912] hover:opacity-90 text-white text-sm font-semibold transition-opacity"
              >
                Démarrer <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-neutral-100">
              {[
                { step: "01", label: "MR", title: "Cockpit rentabilité", sub: "Marge brute · taux % · alertes €", href: "/rentabilite/synthese", badge: "1,94 M€", badgeCls: "bg-emerald-100 text-emerald-800" },
                { step: "02", label: "MR", title: "Drill-down tournées", sub: "CA · coût réel · marge · variance", href: "/rentabilite/par-tournee", badge: "Δ −600 k€", badgeCls: "bg-red-50 text-red-700" },
                { step: "03", label: "M3", title: "Grille coûts dual-track", sub: "13 postes — théorique / réel", href: "/m3/grille-couts", badge: "+152 k€ GO", badgeCls: "bg-amber-50 text-amber-800" },
                { step: "04", label: "M2", title: "Data hub + ETL", sub: "11 sources financières connectées", href: "/m2", badge: "11 flux", badgeCls: "bg-neutral-100 text-neutral-700" },
                { step: "05", label: "M1", title: "Contrats & Indexation", sub: "CA théorique + CNR / Dirham", href: "/m1/adv-contrats", badge: "+385 k€", badgeCls: "bg-blue-50 text-blue-800" },
              ].map((s) => (
                <Link
                  key={s.step}
                  href={s.href}
                  className="group flex flex-col gap-2 p-4 hover:bg-neutral-50 transition-colors"
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="w-6 h-6 rounded-full bg-red-50 text-[#E80912] flex items-center justify-center text-[10px] font-bold shrink-0 border border-red-100">
                      {s.step}
                    </div>
                    <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">{s.label}</span>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full tabular-nums ${s.badgeCls}`}>{s.badge}</span>
                  </div>
                  <div className="text-sm font-semibold text-neutral-900 leading-tight">{s.title}</div>
                  <div className="text-xs text-neutral-500 leading-relaxed">{s.sub}</div>
                  <div className="mt-auto flex items-center gap-1 text-xs text-[#E80912] group-hover:gap-2 transition-all font-medium">
                    Ouvrir <ArrowRight className="h-3 w-3" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
