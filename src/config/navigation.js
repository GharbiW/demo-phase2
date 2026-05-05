import {
  BarChart3,
  Database,
  Calculator,
  TrendingUp,
  LayoutDashboard,
  ClipboardList,
  History,
  Grid3X3,
  Activity,
  ArrowLeftRight,
  Fuel,
  Brain,
  AlertTriangle,
  Sigma,
  Truck,
  Users,
  Car,
  Package,
  ArrowUpDown,
  PieChart,
  Tag,
  Layers,
  LineChart,
} from "lucide-react";

export const demoSidebarModules = [
  { name: "Accueil", href: "/", icon: LayoutDashboard, sections: [] },

  {
    name: "M1 · Commercial & Tarification",
    href: "/m1",
    icon: BarChart3,
    sections: [
      { name: "P1.1 Contrats / ADV", href: "/m1/adv-contrats", icon: ClipboardList },
      { name: "P1.2 Indexation carburant", href: "/m1/indexation-carburant", icon: Fuel },
      { name: "P1.3 CA théorique", href: "/m1/ca-theorique", icon: Calculator },
      { name: "P1.4 Chiffrage Spot", href: "/m1/chiffrage-spot", icon: Tag },
    ],
  },

  {
    name: "M2 · Data Cost Hub",
    href: "/m2",
    icon: Database,
    sections: [{ name: "Grille 13 — données & flux", href: "/m2", icon: Grid3X3 }],
  },

  {
    name: "M3 · Cost Engine",
    href: "/m3",
    icon: Calculator,
    sections: [
      { name: "P3.1 Grille 13 postes", href: "/m3/grille-couts", icon: Grid3X3 },
      { name: "P3.2 Coûts théoriques", href: "/m3/couts-theoriques", icon: Calculator },
      { name: "P3.3 Coûts réels", href: "/m3/ingestion-couts-reels", icon: Database },
      { name: "P3.4 Allocation", href: "/m3/regles-allocation", icon: ArrowLeftRight },
      { name: "P3.5 Audit", href: "/m3/historique-audit", icon: History },
    ],
  },

  {
    name: "M4 · Profitability Engine",
    href: "/rentabilite/par-tournee",
    icon: TrendingUp,
    sections: [
      { name: "P4.1 Par tournée", href: "/rentabilite/par-tournee", icon: Truck },
      { name: "P4.2 Par client", href: "/rentabilite/par-client", icon: ClipboardList },
      { name: "P4.3 Par chauffeur", href: "/rentabilite/par-chauffeur", icon: Users },
      { name: "P4.4 Par véhicule", href: "/rentabilite/par-vehicule", icon: Car },
      { name: "P4.5 Sous-traitance", href: "/rentabilite/sous-traitance", icon: Package },
      { name: "P4.6 Analyse des écarts", href: "/rentabilite/analyse-ecarts", icon: Sigma },
    ],
  },

  {
    name: "M5 · Dashboard Rentabilité",
    href: "/rentabilite/synthese",
    icon: Layers,
    sections: [
      { name: "P5.1 Synthèse cockpit", href: "/rentabilite/synthese", icon: PieChart },
      { name: "P5.2 KPIs détaillés", href: "/rentabilite/kpis", icon: BarChart3 },
      { name: "P5.3 Théorique vs Réel", href: "/rentabilite/theorique-reel", icon: ArrowUpDown },
      { name: "P5.4 Indexation", href: "/rentabilite/indexation", icon: Fuel },
      { name: "P5.5 Planning", href: "/rentabilite/planning", icon: LineChart },
      { name: "P5.6 Alertes", href: "/rentabilite/alertes", icon: AlertTriangle },
    ],
  },

  {
    name: "M6 · Decision Support",
    href: "/m6",
    icon: Brain,
    sections: [
      { name: "Alertes opérationnelles", href: "/m6/alertes", icon: AlertTriangle },
      { name: "Analyse des écarts", href: "/m6/analyse-ecarts", icon: Sigma },
      { name: "Recommandations IA", href: "/m6/recommandations", icon: Brain },
      { name: "Simulations économiques", href: "/m6/simulations", icon: Activity },
    ],
  },
];

export const demoSidebarBottomItems = [{ name: "Retour Parnass", href: "https://parnass.local", icon: LayoutDashboard }];
