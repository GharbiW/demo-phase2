/**
 * Back office — onglets de navigation (M1 Commercial + M2 Data + M3 Cost Engine).
 */
export const BACKOFFICE_TABS = [
  // M1 — Commercial & Tarification
  { slug: "adv-contrats",          label: "Contrats ADV",       short: "Contrats",   href: "/m1/adv-contrats" },
  { slug: "indexation-carburant",  label: "Indexation",         short: "Index.",     href: "/m1/indexation-carburant" },
  { slug: "ca-theorique",          label: "CA théorique",       short: "CA théo.",   href: "/m1/ca-theorique" },
  { slug: "chiffrage-spot",        label: "Chiffrage Spot",     short: "Spot",       href: "/m1/chiffrage-spot" },
  // M2 — Data Cost Hub
  { slug: "m2",                    label: "Data Hub",           short: "Data",       href: "/m2" },
  // M3 — Cost Engine
  { slug: "grille-couts",          label: "Grille 13 postes",   short: "Grille",     href: "/m3/grille-couts" },
  { slug: "couts-theoriques",      label: "Coûts théoriques",   short: "Théo.",      href: "/m3/couts-theoriques" },
  { slug: "ingestion-couts-reels", label: "Coûts réels",        short: "Réels",      href: "/m3/ingestion-couts-reels" },
  { slug: "regles-allocation",     label: "Allocation",         short: "Alloc.",     href: "/m3/regles-allocation" },
  { slug: "historique-audit",      label: "Audit",              short: "Audit",      href: "/m3/historique-audit" },
];
