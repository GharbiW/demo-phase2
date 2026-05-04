/** Données recommandations M6 — extrait depuis l’ancienne page (évite duplication lourde). */

export const RECO_DATA = [
  {
    id: "R-001",
    priority: "Critique",
    type: "Renégociation contrat",
    titre: "Chronopost — marge structurellement négative",
    analyse:
      "22 tournées sur les 30 derniers jours. Marge brute moyenne : −7%. Coûts réels dépassent systématiquement le CA facturé de 8 à 12%.",
    levier: "Augmenter le forfait contractuel de +12% ou réduire la fréquence de 5 tournées/semaine à 3.",
    impact: "−126 k€/an → 0 k€ si renégociation acceptée",
    confidence: 92,
    module: "Rentabilité",
    color: "border-red-800/60 bg-red-950/20",
    badge: "bg-red-100 text-red-800",
  },
  {
    id: "R-002",
    priority: "Critique",
    type: "Performance chauffeur",
    titre: "Dupont A. — 3 tournées déficitaires consécutives",
    analyse:
      "T-0422 (−1 630€), T-0427 (−1 920€), T-0450 (−1 300€). Surconsommation GO systématique : +18% vs théorique. Amplitude : 11,4h (au-delà du seuil).",
    levier: "Analyser les routes. Revoir l'affectation de la semi-remorque. Entretien moteur GO préventif.",
    impact: "Récupération estimée : +8 500€/mois",
    confidence: 87,
    module: "Rentabilité",
    color: "border-red-800/60 bg-red-950/20",
    badge: "bg-red-100 text-red-800",
  },
  {
    id: "R-003",
    priority: "Élevée",
    type: "Alerte préventive parc",
    titre: "AB-421-PL — seuil révision 180 000 km dépassé",
    analyse:
      "198 400 km — dépassement de 18 400 km. Probabilité de panne dans les 30 prochains jours : élevée. Coût moyen immobilisation : 6 500€.",
    levier: "Planifier la révision majeure immédiatement. Prévoir véhicule de remplacement pendant 3–4 jours.",
    impact: "Évite +6 500€ d'immobilisation + 2 tournées perdues (~15 k€ CA)",
    confidence: 94,
    module: "M3 / Rentabilité",
    color: "border-amber-800/60 bg-amber-950/20",
    badge: "bg-amber-100 text-amber-900",
  },
  {
    id: "R-004",
    priority: "Élevée",
    type: "Optimisation indexation",
    titre: "Carrefour — contrat en révision sans indexation active",
    analyse:
      "Contrat en révision depuis 31/01/2026. Aucune clause d'indexation active pendant la période de renégociation. GO a progressé de +4,2% depuis janvier 2026.",
    levier: "Activer une clause transitoire d'indexation pendant la négociation. Base : Dirham TTC M-1.",
    impact: "Récupération estimée : +18 k€ sur la période de renégociation",
    confidence: 78,
    module: "M1",
    color: "border-amber-800/60 bg-amber-950/20",
    badge: "bg-amber-100 text-amber-900",
  },
  {
    id: "R-005",
    priority: "Moyenne",
    type: "Optimisation itinéraire",
    titre: "CEVA — 4 tournées avec pieds > 80 km",
    analyse:
      "T-0425, T-0440, T-0448 — pieds et repositionnements dépassant 80 km non facturés. Impact total : ~4 200€/mois non récupérés.",
    levier:
      "Revoir la planification pour chaîner les tournées CEVA avec les tournées DHL ou Auchan (même périmètre géographique).",
    impact: "Réduction pieds estimée : −40 km/tournée → +4 200€/mois",
    confidence: 71,
    module: "Rentabilité",
    color: "border-blue-800/60 bg-blue-950/20",
    badge: "bg-blue-100 text-blue-800",
  },
];
