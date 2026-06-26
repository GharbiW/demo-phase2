import {
  BarChart3,
  Database,
  Calculator,
  TrendingUp,
  LayoutDashboard,
  ClipboardList,
  History,
  Grid3X3,
  ArrowLeftRight,
  Fuel,
  AlertTriangle,
  Sigma,
  Truck,
  Users,
  Car,
  PieChart,
  Tag,
  Layers,
  Settings2,
} from "lucide-react";

export const demoSidebarModules = [
  // ── 1. Accueil ────────────────────────────────────────────────────
  { name: "Accueil", href: "/", icon: LayoutDashboard, sections: [] },

  // ── 2. Rentabilité ────────────────────────────────────────────────
  {
    name: "Rentabilité",
    href: "/rentabilite/synthese",
    icon: Layers,
    sections: [
      { name: "Vue synthétique", href: "/rentabilite/synthese", icon: PieChart },
      { name: "KPIs détaillés", href: "/rentabilite/kpis", icon: BarChart3 },
      { name: "Alertes", href: "/rentabilite/alertes", icon: AlertTriangle },
      { name: "Par tournée", href: "/rentabilite/par-tournee", icon: Truck },
      { name: "Par véhicule", href: "/rentabilite/par-vehicule", icon: Car },
      { name: "Par chauffeur", href: "/rentabilite/par-chauffeur", icon: Users },
      { name: "Analyse des écarts", href: "/rentabilite/analyse-ecarts", icon: Sigma },
    ],
  },

  // ── 3. Back office (M1 + M2 + M3 regroupés) ──────────────────────
  {
    name: "Back office",
    href: "/m1/adv-contrats",
    icon: Settings2,
    sections: [
      // M1 — Commercial & Tarification
      { name: "Contrats / ADV", href: "/m1/adv-contrats", icon: ClipboardList },
      { name: "Indexation carburant", href: "/m1/indexation-carburant", icon: Fuel },
      { name: "CA théorique", href: "/m1/ca-theorique", icon: Calculator },
      { name: "Chiffrage Spot", href: "/m1/chiffrage-spot", icon: Tag },
      // M2 — Data Cost Hub
      { name: "Grille 13 — données & flux", href: "/m2", icon: Grid3X3 },
      // M3 — Cost Engine
      { name: "Grille 13 postes", href: "/m3/grille-couts", icon: Grid3X3 },
      { name: "Coûts théoriques", href: "/m3/couts-theoriques", icon: Calculator },
      { name: "Coûts réels", href: "/m3/ingestion-couts-reels", icon: Database },
      { name: "Allocation", href: "/m3/regles-allocation", icon: ArrowLeftRight },
      { name: "Audit", href: "/m3/historique-audit", icon: History },
    ],
  },
];

export const demoSidebarBottomItems = [{ name: "Retour Parnass", href: "https://parnass.local", icon: LayoutDashboard }];
