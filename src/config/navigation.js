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
    activeFor: "/rentabilite",
    icon: Layers,
    sections: [],
  },

  // ── 3. Back office ────────────────────────────────────────────────
  {
    name: "Back office",
    href: "/m1/adv-contrats",
    activeFor: ["/m1", "/m2", "/m3"],
    icon: Settings2,
    sections: [],
  },
];

export const demoSidebarBottomItems = [{ name: "Retour Parnass", href: "https://parnass.local", icon: LayoutDashboard }];
