"use client";

import Link from "next/link";
import {
  ArrowRight, BarChart3, Truck, Database, Calculator,
  TrendingUp, Sparkles, ChevronRight, Layers, Sigma,
  Users, Car, AlertTriangle, PieChart, Settings2,
} from "lucide-react";
import { HomeCockpitStrip } from "@/components/finance/HomeCockpitStrip";

// ── Rentabilité — module principal ────────────────────────────────
const RENTABILITE = {
  title: "Rentabilité",
  subtitle: "Le cockpit de pilotage opérationnel",
  description: "Suivi en temps réel de la marge par tournée, véhicule et chauffeur — avec alertes, KPIs et analyse des écarts.",
  href: "/rentabilite/synthese",
  icon: Layers,
  links: [
    { label: "Vue synthétique", href: "/rentabilite/synthese", icon: PieChart },
    { label: "Par tournée", href: "/rentabilite/par-tournee", icon: Truck },
    { label: "Par véhicule", href: "/rentabilite/par-vehicule", icon: Car },
    { label: "Par chauffeur", href: "/rentabilite/par-chauffeur", icon: Users },
    { label: "Alertes", href: "/rentabilite/alertes", icon: AlertTriangle },
    { label: "Analyse des écarts", href: "/rentabilite/analyse-ecarts", icon: Sigma },
  ],
};

// ── Back office — infrastructure ──────────────────────────────────
const BACK_OFFICE = [
  {
    title: "Commercial & Tarification",
    subtitle: "Contrats, indexation, CA théorique",
    href: "/m1/adv-contrats",
    icon: BarChart3,
    links: [
      { label: "Contrats ADV", href: "/m1/adv-contrats" },
      { label: "CA théorique", href: "/m1/ca-theorique" },
      { label: "Indexation carburant", href: "/m1/indexation-carburant" },
    ],
  },
  {
    title: "Data Cost Hub",
    subtitle: "Sources, connecteurs, qualité",
    href: "/m2",
    icon: Database,
    links: [
      { label: "Grille 13 — données & flux", href: "/m2" },
    ],
  },
  {
    title: "Cost Engine",
    subtitle: "Grille coûts, théorique vs réel",
    href: "/m3/grille-couts",
    icon: Calculator,
    links: [
      { label: "Grille 13 postes", href: "/m3/grille-couts" },
      { label: "Coûts théoriques", href: "/m3/couts-theoriques" },
      { label: "Coûts réels", href: "/m3/ingestion-couts-reels" },
    ],
  },
];

export default function HomePage() {
  const RentaIcon = RENTABILITE.icon;

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
                  Phase 2 · Démo · Juin 2026
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight leading-snug">
                  Cockpit économique <span className="text-[#E80912]">Parnass</span>
                </h1>
                <p className="mt-2 text-neutral-400 text-sm max-w-lg">
                  Maîtrise de la rentabilité d&apos;exploitation — CA, coûts, marges et alertes en temps réel.
                </p>
              </div>

              <div className="flex gap-6 md:gap-8 shrink-0">
                {[["1,94 M€", "CA agrégé"], ["13", "postes de coûts"], ["3", "axes analyse"]].map(([v, l]) => (
                  <div key={l} className="text-center">
                    <div className="text-xl font-bold text-white tabular-nums">{v}</div>
                    <div className="text-[11px] text-neutral-500 mt-0.5">{l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Single CTA */}
            <div className="mt-6">
              <Link
                href="/rentabilite/synthese"
                className="inline-flex items-center gap-2 h-10 px-5 rounded-lg bg-[#E80912] hover:bg-[#c7080f] text-white text-sm font-semibold transition-colors shadow-lg"
              >
                <Layers className="w-4 h-4" />
                Accéder à la Rentabilité
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-8 space-y-8">

        {/* ── Live KPI Strip ────────────────────────────────────── */}
        <HomeCockpitStrip />

        {/* ── Rentabilité — module principal ────────────────────── */}
        <section>
          <div className="rounded-2xl border-2 border-neutral-900 bg-white shadow-sm overflow-hidden">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center gap-4 px-6 py-5 bg-neutral-950">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#E80912] text-white flex items-center justify-center shrink-0 shadow-md">
                  <RentaIcon className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white tracking-tight">{RENTABILITE.title}</h2>
                  <p className="text-sm text-neutral-400 mt-0.5">{RENTABILITE.description}</p>
                </div>
              </div>
              <div className="md:ml-auto">
                <Link
                  href={RENTABILITE.href}
                  className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-[#E80912] hover:bg-[#c7080f] text-white text-sm font-semibold transition-colors"
                >
                  Ouvrir le dashboard <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Quick links grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-x divide-neutral-100">
              {RENTABILITE.links.map((link) => {
                const LinkIcon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="group flex flex-col gap-2 p-4 hover:bg-neutral-50 transition-colors border-t border-neutral-100"
                  >
                    <div className="w-8 h-8 rounded-lg bg-neutral-100 group-hover:bg-neutral-200 text-neutral-600 flex items-center justify-center transition-colors">
                      <LinkIcon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold text-neutral-800 leading-tight">{link.label}</span>
                    <ArrowRight className="w-3 h-3 text-neutral-300 group-hover:text-neutral-500 transition-colors" />
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Back office ───────────────────────────────────────── */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-7 h-7 rounded-lg bg-neutral-200 flex items-center justify-center">
              <Settings2 className="w-3.5 h-3.5 text-neutral-500" />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-neutral-400">Infrastructure</div>
              <div className="text-sm font-semibold text-neutral-700">Back office — alimente le dashboard rentabilité</div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {BACK_OFFICE.map((m) => {
              const Icon = m.icon;
              return (
                <div key={m.title} className="group rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden hover:shadow-md hover:border-neutral-300 transition-all">
                  <Link href={m.href} className="flex items-center gap-3 px-4 py-3.5 border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-neutral-100 text-neutral-600 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-neutral-900 truncate">{m.title}</div>
                      <div className="text-xs text-neutral-400 truncate mt-0.5">{m.subtitle}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-neutral-300 shrink-0 ml-auto" />
                  </Link>
                  <div>
                    {m.links.map((link, i) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`flex items-center justify-between px-4 py-2 text-xs font-medium text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 transition-colors ${i > 0 ? "border-t border-neutral-50" : ""}`}
                      >
                        <span>{link.label}</span>
                        <ChevronRight className="w-3 h-3 text-neutral-200" />
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Parcours rapide ──────────────────────────────────── */}
        <section>
          <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-neutral-900">Parcours démo — 5 étapes</div>
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
                { step: "01", title: "Cockpit rentabilité", sub: "Marge brute · taux % · alertes €", href: "/rentabilite/synthese", badge: "1,94 M€", badgeCls: "bg-emerald-100 text-emerald-800" },
                { step: "02", title: "Drill-down tournées", sub: "CA · coût réel · marge · variance", href: "/rentabilite/par-tournee", badge: "Δ −600 k€", badgeCls: "bg-red-50 text-red-700" },
                { step: "03", title: "Grille coûts dual-track", sub: "13 postes — théorique / réel", href: "/m3/grille-couts", badge: "+152 k€ GO", badgeCls: "bg-amber-50 text-amber-800" },
                { step: "04", title: "Data hub + ETL", sub: "11 sources financières connectées", href: "/m2", badge: "11 flux", badgeCls: "bg-neutral-100 text-neutral-700" },
                { step: "05", title: "Contrats & Indexation", sub: "CA théorique + CNR / DIREM", href: "/m1/adv-contrats", badge: "+385 k€", badgeCls: "bg-blue-50 text-blue-800" },
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
