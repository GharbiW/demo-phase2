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
    ],
  },
  {
    name: "M2 · Hub données & coûts",
    href: "/m2",
    icon: Database,
    sections: [{ name: "Grille 14 — données & flux", href: "/m2", icon: Grid3X3 }],
  },
  {
    name: "M3 · Cost Engine",
    href: "/m3",
    icon: Calculator,
    sections: [
      { name: "P3.1 Grille 14 postes", href: "/m3/grille-couts", icon: Grid3X3 },
      { name: "P3.2 Coûts théoriques", href: "/m3/couts-theoriques", icon: Calculator },
      { name: "P3.3 Coûts réels", href: "/m3/ingestion-couts-reels", icon: Database },
      { name: "P3.4 Allocation", href: "/m3/regles-allocation", icon: ArrowLeftRight },
      { name: "P3.5 Audit", href: "/m3/historique-audit", icon: History },
    ],
  },
  {
    name: "Rentabilité",
    href: "/rentabilite",
    icon: TrendingUp,
    sections: [],
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
