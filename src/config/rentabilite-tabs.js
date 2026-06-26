/**
 * Module unique Rentabilité — onglets (M4 Profitability + M5 Dashboard).
 * Version simplifiée (1re approche) : 3 unités d'analyse arbitrées (Tournée · Véhicule · Chauffeur)
 * + Synthèse, KPIs, Analyse des écarts et Alertes. Par client / Semi / Sous-traitance retirés.
 */
export const RENTABILITE_TABS = [
  { slug: "synthese", label: "Synthèse", short: "Synth.", href: "/rentabilite/synthese" },
  { slug: "kpis", label: "11 KPIs", short: "KPIs", href: "/rentabilite/kpis" },
  { slug: "par-tournee", label: "Par tournée", short: "Tournées", href: "/rentabilite/par-tournee" },
  { slug: "par-vehicule", label: "Par véhicule", short: "Véhic.", href: "/rentabilite/par-vehicule" },
  { slug: "par-chauffeur", label: "Par chauffeur", short: "Chauff.", href: "/rentabilite/par-chauffeur" },
];
