import Link from "next/link";
import { ArrowRight, Lock, CheckCircle2, AlertTriangle, Sparkles, BarChart3, Truck, Database, Calculator, TrendingUp, Brain, Layers } from "lucide-react";
import { HomeCockpitStrip } from "@/components/finance/HomeCockpitStrip";

const MODULES = [
  {
    num: "M1",
    title: "Commercial & Tarification",
    subtitle: "Le moteur de revenu",
    desc: "Calcule le CA théorique, intègre les grilles tarifaires et l'indexation carburant (CNR / Dirham).",
    href: "/m1/adv-contrats",
    icon: <TrendingUp className="w-5 h-5" />,
    color: "bg-[#E80912]",
    features: ["Indexation CNR / Dirham", "Paramétrage par prestation", "CA théorique automatique"],
    locked: false,
  },
  {
    num: "M2",
    title: "Hub données & coûts",
    subtitle: "Ingestion des flux transport",
    desc: "AS24, Engie, télématique, paie, indices, garage : fichiers et API normalisés vers la grille de coûts.",
    href: "/m2",
    icon: <Database className="w-5 h-5" />,
    color: "bg-neutral-800",
    features: ["Grille 14 onglets", "Paie Factorial + P1 pour le reste", "ETL & qualité repliables", "Gouvernance RACI"],
    locked: false,
  },
  {
    num: "M3",
    title: "Cost Engine",
    subtitle: "Le moteur de calcul",
    desc: "Transforme les données en coûts financiers. Grille 14 postes, dual-track théorique vs réel, allocation par unité.",
    href: "/m3/grille-couts",
    icon: <Calculator className="w-5 h-5" />,
    color: "bg-neutral-800",
    features: ["Grille 14 postes", "Théorique vs Réel", "Imputation pieds", "Agrégation 15j WE"],
    locked: false,
  },
  {
    num: "MR",
    title: "Rentabilité",
    subtitle: "Cockpit + analyses",
    desc: "Un seul module : synthèse, KPIs, drill-down par tournée / client / chauffeur / véhicule, sous-traitance, semi-remorques.",
    href: "/rentabilite/synthese",
    icon: <BarChart3 className="w-5 h-5" />,
    color: "bg-neutral-800",
    features: ["Navigation par onglets", "11 KPIs", "6 unités d’analyse", "Drill-down par dimension"],
    locked: false,
  },
  {
    num: "M6",
    title: "Decision Support",
    subtitle: "L'assistant stratégique — IA",
    desc: "Alertes opérationnelles, analyse des écarts par poste, recommandations IA et simulations what-if.",
    href: "/m6",
    icon: <Brain className="w-5 h-5" />,
    color: "bg-neutral-700",
    features: ["Alertes opérationnelles", "Analyse des écarts", "Recommandations IA", "Simulations what-if"],
    locked: false,
  },
];

const DECISIONS = [
  { num: "01", title: "Deux tracks fondamentaux", desc: "Théorique vs Réel comme colonne vertébrale — Triplet Théorique / Réel / Écart." },
  { num: "02", title: "Six unités d'analyse", desc: "Chauffeur · Tracteur · Semi-remorque · Tournée · Trajet · Client/Contrat." },
  { num: "03", title: "Trois types de blocs planning", desc: "Pied 🔵 · Optimisation 🔴 · HPL 🟠 — calcul automatique km entre prestations." },
  { num: "04", title: "Méthode salariale forfait jour", desc: "Base ~165€/j SPL incluant charges et congés. Diviseur jours à arbitrer (H1)." },
  { num: "05", title: "Accès rentabilités restreint", desc: "Mathieu + Zoubir + Raphaela : complet. Laurent + Samu : superviseur. Conception : codes couleurs." },
];

const STEPS = [
  { step: "01", module: "Rentabilité", title: "Cockpit rentabilité", desc: "Marge brute, taux %, écart vs budget, alertes €", href: "/rentabilite/synthese", icon: <BarChart3 className="w-4 h-4" />, impact: "Pilotage 1,94 M€", impactClass: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  { step: "02", module: "Rentabilité", title: "Drilldown tournées", desc: "CA, coût réel, marge, variance carburant/RH/…", href: "/rentabilite/par-tournee", icon: <Truck className="w-4 h-4" />, impact: "Δ −600 k€/an tracé", impactClass: "bg-red-50 text-red-800 border-red-200" },
  { step: "03", module: "M3", title: "Grille coûts dual-track", desc: "14 postes — réconciliation théorique / réelle", href: "/m3/grille-couts", icon: <Calculator className="w-4 h-4" />, impact: "+152 k€ delta GO", impactClass: "bg-amber-50 text-amber-900 border-amber-200" },
  { step: "04", module: "M2", title: "Data hub + ETL", desc: "Sources financières — qualité € prête pour M3/M4", href: "/m2", icon: <Database className="w-4 h-4" />, impact: "11 flux €", impactClass: "bg-neutral-100 text-neutral-800 border-neutral-200" },
  { step: "05", module: "M1", title: "Contrats & Indexation", desc: "CA théorique contractuel + indexation CNR/Dirham", href: "/m1/adv-contrats", icon: <TrendingUp className="w-4 h-4" />, impact: "+385 k€ index.", impactClass: "bg-blue-50 text-blue-900 border-blue-200" },
];

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-neutral-50">

      {/* ── Hero ──────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-neutral-950 border-b border-neutral-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(232,9,18,0.15),transparent_70%)]" />
        <div className="relative max-w-[1400px] mx-auto px-6 py-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-700 bg-neutral-900/60 px-3 py-1 text-xs text-neutral-400 mb-6">
            <Sparkles className="h-3.5 w-3.5 text-[color:var(--color-parnass-red)]" />
            Discovery terminée · 5 mai 2026 · Scope validé
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight max-w-3xl">
            De Parnass 360 au <span className="text-[color:var(--color-parnass-red)]">Cockpit économique</span> du transport
          </h1>
          <p className="mt-4 text-neutral-400 max-w-2xl text-base">
            Phase 2 — 5 modules interdépendants pour maîtriser la rentabilité d&apos;exploitation de bout en bout.
          </p>

          {/* Today vs Tomorrow */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
            <div className="rounded-xl border border-red-900/40 bg-red-950/20 p-5">
              <div className="text-xs font-bold uppercase tracking-widest text-red-400 mb-3">Aujourd&apos;hui · Parnass 360</div>
              <ul className="space-y-2">
                {["Organisation des tournées, planification", "Lecture économique partielle et manuelle", "Delta marge ~600 k€/an entre prévision et réel — non tracé", "Analyses Excel mensuelles reconstructives"].map((t) => (
                  <li key={t} className="flex items-start gap-2 text-sm text-neutral-400">
                    <span className="text-red-500 mt-0.5">✕</span>{t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-emerald-800/40 bg-emerald-950/20 p-5">
              <div className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-3">Demain · Cockpit économique</div>
              <ul className="space-y-2">
                {["Maîtrise totale de la rentabilité d'exploitation", "Lecture théorique vs réel — ventilation poste par poste", "Delta tracé et expliqué en temps réel", "Alertes automatiques · drill-down · IA décisionnelle (Ph.3)"].map((t) => (
                  <li key={t} className="flex items-start gap-2 text-sm text-neutral-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />{t}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Stats strip */}
          <div className="mt-8 flex flex-wrap gap-6">
            {[["14", "postes de coûts"], ["6", "unités d'analyse"], ["11", "KPIs cibles"], ["5", "vues dashboard"], ["11", "sources data"], ["10", "jalons roadmap"]].map(([v, l]) => (
              <div key={l} className="text-center">
                <div className="text-2xl font-bold text-white">{v}</div>
                <div className="text-xs text-neutral-500 mt-0.5">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-8 space-y-10">

        <HomeCockpitStrip />

        {/* ── 5 blocs modèle économique + priorisation data ───── */}
        <section className="rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-1">Spine produit · Specs Phase 2</div>
              <h2 className="text-lg font-bold text-neutral-900">Les 5 blocs du modèle économique</h2>
              <p className="text-sm text-neutral-500 mt-1 max-w-2xl">
                Grille de coûts → Rentabilité théorique → Rentabilité réelle → Analyse théo / réel → Sous-traitance. Triplet{" "}
                <strong>Théorique / Réel / Écart</strong> comme fil conducteur M3 → Rentabilité.
              </p>
            </div>
            <div className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-700 text-sm font-semibold shrink-0">
              Modèle économique intégré aux modules
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-neutral-100">
            <div className="p-6">
              <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-3">Ordre de branchement des sources (teaser)</div>
              <ul className="space-y-3 text-sm text-neutral-700">
                <li className="flex gap-2">
                  <span className="text-[color:var(--color-parnass-red)] font-bold">1.</span>
                  <span><strong>Carburant AS24 / Engie</strong> — ordre de grandeur <strong>~385 k€ / an</strong> d&apos;indexation sur le périmètre carburant (démo).</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[color:var(--color-parnass-red)] font-bold">2.</span>
                  <span><strong>Paie Factorial / Silae</strong> — <strong>~325 k€ / mois</strong> sur les bulletins consolidés (fixtures Architecture Data).</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[color:var(--color-parnass-red)] font-bold">3.</span>
                  <span><strong>Télématique</strong> puis indices <strong>CNR / Dirham</strong>, factures garage et <strong>PTV</strong> — priorisation détaillée sur le hub M2 (grille 14).</span>
                </li>
              </ul>
              <Link href="/m2" className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-[color:var(--color-parnass-red)] hover:underline">
                Ouvrir le hub M2 (grille 14 + flux) <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="p-6 bg-neutral-50/80">
              <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-3">Liens rapides specs → démo</div>
              <div className="flex flex-col gap-2 text-sm">
                <Link href="/m2" className="text-neutral-800 hover:text-[color:var(--color-parnass-red)]">Hub M2 — historisation & pipeline</Link>
                <Link href="/m3/grille-couts" className="text-neutral-800 hover:text-[color:var(--color-parnass-red)]">Grille 14 postes — Cost Atlas</Link>
                <Link href="/rentabilite/semi-remorque" className="text-neutral-800 hover:text-[color:var(--color-parnass-red)]">Semi-remorques déclaratifs (phase test)</Link>
                <Link href="/m6/analyse-ecarts" className="text-neutral-800 hover:text-[color:var(--color-parnass-red)]">Analyse des écarts (M6)</Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── 6 Modules ─────────────────────────────────────── */}
        <section>
          <div className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-4">Périmètre produit — 5 modules</div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {MODULES.map((m) => (
              <Link key={m.num} href={m.href}
                className={`group relative rounded-xl border bg-white p-5 transition-all hover:shadow-lg ${m.locked ? "opacity-90 border-neutral-300 bg-neutral-50/80" : "border-neutral-200 hover:border-neutral-300"}`}
              >
                {m.locked && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-neutral-200 border border-neutral-300 px-2 py-0.5 text-[10px] font-semibold text-neutral-800">
                    <Lock className="w-3 h-3" />Phase 3
                  </div>
                )}
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-9 h-9 rounded-lg ${m.color} text-white flex items-center justify-center shrink-0`}>
                    {m.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">{m.num}</span>
                    </div>
                    <div className="text-sm font-semibold text-neutral-900">{m.title}</div>
                    <div className="text-xs text-neutral-500 italic">{m.subtitle}</div>
                  </div>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed mb-3">{m.desc}</p>
                  <div className="flex flex-wrap gap-1.5">
                  {m.features.map((f) => (
                    <span key={f} className={`rounded-full px-2 py-0.5 text-[10px] font-medium border ${m.locked ? "bg-neutral-100 text-neutral-600 border-neutral-200" : "bg-neutral-100 text-neutral-600 border-neutral-200"}`}>{f}</span>
                  ))}
                </div>
                <div className={`mt-3 flex items-center gap-1 text-xs font-medium group-hover:gap-2 transition-all ${m.locked ? "text-neutral-600" : "text-[color:var(--color-parnass-red)]"}`}>
                  {m.locked ? "Voir l'aperçu Phase 3" : "Explorer le module"}
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Guided demo path ──────────────────────────────── */}
        <section>
          <div className="rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-neutral-900">Parcours démo guidé — 5 étapes</div>
                <div className="text-xs text-neutral-500 mt-0.5">Suivez ce chemin pour montrer la valeur complète en 20 minutes</div>
              </div>
              <Link href="/rentabilite/synthese" className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-[color:var(--color-parnass-red)] hover:opacity-90 text-white text-sm font-semibold transition-opacity">
                Démarrer <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-neutral-100">
              {STEPS.map((s) => (
                <Link key={s.step} href={s.href} className="group flex flex-col gap-2 p-4 hover:bg-neutral-50 transition-colors">
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="w-6 h-6 rounded-full bg-red-50 text-[color:var(--color-parnass-red)] flex items-center justify-center text-[10px] font-bold shrink-0 border border-red-100">{s.step}</div>
                    <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">{s.module}</span>
                    {s.impact && (
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border font-money tabular-nums ${s.impactClass}`}>
                        {s.impact}
                      </span>
                    )}
                  </div>
                  <div className="text-sm font-semibold text-neutral-900">{s.title}</div>
                  <div className="text-xs text-neutral-500 leading-relaxed">{s.desc}</div>
                  <div className="mt-auto flex items-center gap-1 text-xs text-[color:var(--color-parnass-red)] group-hover:gap-2 transition-all">Ouvrir <ArrowRight className="h-3 w-3" /></div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── 5 Décisions structurantes ──────────────────────── */}
        <section>
          <div className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-4">5 Décisions structurantes — Discovery Phase 2</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {DECISIONS.map((d) => (
              <div key={d.num} className="rounded-xl border border-neutral-200 bg-white p-4">
                <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Décision {d.num}</div>
                <div className="text-sm font-semibold text-neutral-900 mb-1">{d.title}</div>
                <div className="text-xs text-neutral-500 leading-relaxed">{d.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Sections transverses supprimées (pas de pages doc) */}

        {/* ── Demo note ───────────────────────────────────────── */}
        <div className="rounded-xl border border-blue-200 bg-blue-50 px-5 py-4 flex items-start gap-3">
          <Sparkles className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
          <p className="text-sm text-blue-800">
            <strong>Démo statique</strong> — Toutes les données sont simulées. Les sauvegardes (fake save) déclenchent des toasts et persistent en localStorage.
            Modifiez les hypothèses M3 ou l&apos;indexation M1 pour voir les KPIs M5 se recalculer en temps réel.
            Utilisez <strong>Reset démo</strong> dans la TopBar pour réinitialiser.
          </p>
        </div>

      </div>
    </div>
  );
}
