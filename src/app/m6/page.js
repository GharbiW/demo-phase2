import Link from "next/link";
import { Lock, Brain, Sparkles, TrendingUp, Zap, Map, BarChart3, ArrowRight, ChevronRight } from "lucide-react";

const AI_FEATURES = [
  {
    icon: <Brain className="w-5 h-5" />,
    title: "Recommandations automatiques",
    desc: "Détecte les tournées déficitaires récurrentes, propose des leviers (tarif, fréquence, client à renégocier).",
    href: "/m6/recommandations",
    color: "text-violet-400",
    bg: "bg-violet-900/20 border-violet-800/40",
  },
  {
    icon: <Zap className="w-5 h-5" />,
    title: "Simulations économiques",
    desc: "What-if — quel impact si le prix du GO monte de 5% ? Si je modifie le km forfait d'un contrat ?",
    href: "/m6/simulations",
    color: "text-blue-400",
    bg: "bg-blue-900/20 border-blue-800/40",
  },
  {
    icon: <Map className="w-5 h-5" />,
    title: "Optimisation d'itinéraires",
    desc: "Calcule le delta km théorique vs réel et propose des routes optimisées pour réduire les pieds.",
    href: "/m6",
    color: "text-emerald-400",
    bg: "bg-emerald-900/20 border-emerald-800/40",
  },
  {
    icon: <TrendingUp className="w-5 h-5" />,
    title: "Tarification dynamique",
    desc: "Suggère les ajustements tarifaires basés sur l'analyse des marges historiques par client et segment.",
    href: "/m6",
    color: "text-amber-400",
    bg: "bg-amber-900/20 border-amber-800/40",
  },
  {
    icon: <BarChart3 className="w-5 h-5" />,
    title: "Recommandation AS24",
    desc: "Analyse la consommation réelle et recommande les stations AS24 optimales sur les itinéraires.",
    href: "/m6",
    color: "text-rose-400",
    bg: "bg-rose-900/20 border-rose-800/40",
  },
];

const PREVIEW_DATA = [
  { type: "Recommandation", priority: "Critique", text: "Chronopost — marge −7% sur 22 tournées. Renégocier le forfait ou réviser la fréquence.", impact: "−126 k€/an" },
  { type: "Recommandation", priority: "Élevée", text: "Chauffeur Dupont A. — 3 tournées déficitaires consécutives. Analyser routes et amplitude.", impact: "−17 k€" },
  { type: "Alerte modèle", priority: "Moyenne", text: "GO +3% prévu en mai 2026. Impact sur 6 contrats sans indexation actualisée.", impact: "≈ +18 k€" },
  { type: "Optimisation", priority: "Élevée", text: "AB-421-PL dépasse 198 400 km. Révision majeure recommandée avant prochain cycle.", impact: "Risque +12 k€" },
];

export default function M6Page() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Phase 3 banner */}
      <div className="bg-gradient-to-r from-violet-900 to-violet-700 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Lock className="w-4 h-4 text-violet-200" />
          <span className="text-sm font-semibold text-white">Module 6 — Décisionnel & simulation (démo interactive)</span>
          <span className="hidden sm:inline text-xs text-violet-200">
            · Les écrans Recommandations et What-if sont jouables en démo ; le reste reste en feuille de route produit.
          </span>
        </div>
        <Link href="/" className="text-xs text-violet-200 hover:text-white flex items-center gap-1 transition-colors">
          ← Retour accueil
        </Link>
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden border-b border-neutral-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(139,92,246,0.2),_transparent_60%)]" />
        <div className="relative max-w-[1200px] mx-auto px-6 py-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-700/50 bg-violet-900/30 px-3 py-1 text-xs text-violet-300 mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            Decision Support · Intelligence Artificielle · Phase 3
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight mb-4">
            Module 6 — <span className="text-violet-400">Decision Support</span>
          </h1>
          <p className="text-lg text-neutral-400 max-w-2xl mb-8">
            L&apos;assistant stratégique IA du cockpit économique. Détecte les anomalies, propose des leviers d&apos;amélioration
            et simule des scénarios économiques pour maximiser la rentabilité d&apos;exploitation.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link href="/m6/recommandations"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-colors">
              <Brain className="w-4 h-4" />
              Voir recommandations
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/m6/simulations"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-violet-700 text-violet-300 hover:bg-violet-900/40 text-sm font-semibold transition-colors">
              <Zap className="w-4 h-4" />
              Simulateur what-if
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 py-10 space-y-10">

        {/* Features */}
        <section>
          <div className="text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-4">Fonctionnalités prévues</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {AI_FEATURES.map((f) => (
              <Link key={f.title} href={f.href}
                className={`group rounded-xl border p-5 transition-all hover:scale-[1.01] ${f.bg}`}>
                <div className={`mb-3 ${f.color}`}>{f.icon}</div>
                <div className="text-sm font-semibold text-white mb-2">{f.title}</div>
                <p className="text-xs text-neutral-400 leading-relaxed">{f.desc}</p>
                <div className={`mt-3 flex items-center gap-1 text-xs ${f.color} group-hover:gap-2 transition-all`}>
                  Voir l&apos;aperçu <ChevronRight className="w-3 h-3" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Preview data */}
        <section>
          <div className="text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-4">Aperçu — recommandations simulées</div>
          <div className="rounded-xl border border-neutral-800 bg-neutral-900 overflow-hidden">
            <div className="px-5 py-3 border-b border-neutral-800 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-violet-500" />
              <span className="text-xs text-neutral-400 font-medium">4 recommandations détectées · analyse sur 30 tournées</span>
              <div className="ml-auto text-[10px] text-emerald-400 border border-emerald-800/50 rounded-full px-2 py-0.5 font-semibold">
                Démo
              </div>
            </div>
            <div className="divide-y divide-neutral-800">
              {PREVIEW_DATA.map((r, i) => (
                <div key={i} className="px-5 py-4 flex items-start gap-4 hover:bg-neutral-800/40 transition-colors">
                  <div className={`mt-0.5 rounded px-2 py-0.5 text-[10px] font-bold uppercase shrink-0 ${r.priority === "Critique" ? "bg-red-900/60 text-red-300" : r.priority === "Élevée" ? "bg-amber-900/60 text-amber-300" : "bg-neutral-800 text-neutral-400"}`}>
                    {r.priority}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] text-violet-400 font-medium mr-2">{r.type}</span>
                    <span className="text-sm text-neutral-300">{r.text}</span>
                  </div>
                  <div className="shrink-0 text-xs font-mono text-amber-300">{r.impact}</div>
                </div>
              ))}
            </div>
            <div className="px-5 py-4 bg-violet-950/30 border-t border-violet-900/40 flex items-center gap-3">
              <Sparkles className="w-4 h-4 text-violet-300 shrink-0" />
              <p className="text-sm text-violet-200">
                Ouvrez <strong>Recommandations</strong> ou <strong>Simulations</strong> pour l&apos;expérience interactive — données mock côté client.
              </p>
            </div>
          </div>
        </section>

        {/* Prerequisites */}
        <section>
          <div className="text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-4">Prérequis Phase 2</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { title: "M2 — Hub données stable", desc: "Onze flux branchés, pipeline fiable, exceptions traitées au fil de l’eau.", status: "M2" },
              { title: "M3 — Grille coûts validée", desc: "13 postes paramétrés, hypothèses H1–H11 arbitrées, track réel alimenté.", status: "M3" },
              { title: "M5 — Historique 3 mois", desc: "Au moins 3 mois de données rentabilité pour entraîner les modèles.", status: "M5" },
            ].map((p) => (
              <div key={p.title} className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4">
                <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1">{p.status} requis</div>
                <div className="text-sm font-semibold text-white mb-1">{p.title}</div>
                <div className="text-xs text-neutral-400">{p.desc}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
