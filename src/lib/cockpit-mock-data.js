/**
 * Données mock centralisées — démo interactive Cockpit économique (Phase 2).
 * Complète demo-data.js sans casser les exports existants.
 */

export const cockpitAgencies = [
  { id: "all", label: "Toutes agences" },
  { id: "nord", label: "Parnass Nord (Lille)" },
  { id: "sud", label: "Parnass Sud (Marseille)" },
  { id: "idf", label: "Parnass IDF (Roissy)" },
];

/** Périodes globales TopBar — valeurs alignées avec demoStore.state.period */
export const cockpitPeriodOptions = [
  { value: "M", label: "Mois en cours" },
  { value: "M-1", label: "M-1" },
  { value: "T", label: "Trimestre" },
];

export const cockpitSpotClients = [
  { id: "c1", name: "Amazon Logistics" },
  { id: "c2", name: "FedEx Express" },
  { id: "c3", name: "Carrefour Supply" },
  { id: "c4", name: "Chronopost" },
];

export const cockpitVehicleTypes = [
  { id: "SPL", label: "SPL (Semi-remorque)" },
  { id: "CM", label: "Caisse mobile (CM)" },
  { id: "VL", label: "VL / utilitaire" },
];

export const cockpitEnergyTypes = [
  { id: "GO", label: "Gasoil" },
  { id: "Gaz", label: "Gaz (GNC/GNV)" },
];

/** Prix pompe indicatif €/L ou €/kg */
export const cockpitPumpPrices = { GO: 1.52, Gaz: 1.28 };
export const cockpitPeagePerKm = 0.085;

/** Conso L/100 ou kg/100 selon énergie */
export const cockpitConsoByVehicle = {
  SPL: { GO: 28, Gaz: 30.5 },
  CM: { GO: 22, Gaz: 24 },
  VL: { GO: 12, Gaz: 13 },
};

/** Forfait chauffeur spot (€) */
export const cockpitDriverFlat = { SPL: 170, CM: 190, VL: 120 };

/** Indexation — lignes tableau prompt */
export const cockpitIndexationTableRows = [
  { id: "ix1", client: "FedEx", indice: "CNR", methode: "M-1", ponderationPct: 35, evolutionBrutePct: 4.2 },
  { id: "ix2", client: "Auchan", indice: "Dirham", methode: "M-2", ponderationPct: 20, evolutionBrutePct: 3.1 },
  { id: "ix3", client: "Carrefour", indice: "CNR", methode: "M-1", ponderationPct: 25, evolutionBrutePct: 2.8 },
  { id: "ix4", client: "DHL Supply", indice: "CNR", methode: "M-1", ponderationPct: 30, evolutionBrutePct: 4.0 },
  { id: "ix5", client: "Chronopost", indice: "Dirham", methode: "M-2", ponderationPct: 15, evolutionBrutePct: 1.9 },
  { id: "ix6", client: "CEVA", indice: "CNR", methode: "M-1", ponderationPct: 40, evolutionBrutePct: 3.5 },
];

/** 12 mois — prix pompe GO vs Gaz (€) */
export const cockpitFuelPump12m = [
  { mois: "Mai 25", go: 1.48, gaz: 1.22 },
  { mois: "Juin 25", go: 1.49, gaz: 1.23 },
  { mois: "Juil 25", go: 1.51, gaz: 1.24 },
  { mois: "Août 25", go: 1.5, gaz: 1.23 },
  { mois: "Sept 25", go: 1.52, gaz: 1.25 },
  { mois: "Oct 25", go: 1.53, gaz: 1.26 },
  { mois: "Nov 25", go: 1.54, gaz: 1.26 },
  { mois: "Déc 25", go: 1.55, gaz: 1.27 },
  { mois: "Jan 26", go: 1.51, gaz: 1.25 },
  { mois: "Fév 26", go: 1.5, gaz: 1.24 },
  { mois: "Mar 26", go: 1.51, gaz: 1.25 },
  { mois: "Avr 26", go: 1.52, gaz: 1.28 },
];

/** Monitoring API — cartes widgets */
export const cockpitApiConnectors = [
  { key: "as24", name: "Carburant (AS24)", vendor: "AS24", status: "ok", lastSyncMin: 5, volumeLabel: "1 240 transactions" },
  { key: "michelin", name: "Télématique (Michelin)", vendor: "Michelin", status: "ok", lastSyncMin: 12, volumeLabel: "86 400 pts GPS" },
  { key: "solide", name: "Tachygraphe (Solide)", vendor: "Solide", status: "warn", lastSyncMin: 180, volumeLabel: "Export partiel (nuit)" },
  { key: "silae", name: "Paie (Silae)", vendor: "Silae", status: "ok", lastSyncMin: 720, volumeLabel: "312 bulletins" },
  { key: "wincpl", name: "Matériel (WinCPL)", vendor: "WinCPL", status: "ok", lastSyncMin: 45, volumeLabel: "58 immat. synchronisées" },
];

/** Rejets qualité — action réaffectation */
export const cockpitQualityRejections = [
  {
    id: "rej-1",
    message: "Plein carburant de 400 L à 14h00 sur la carte AS24 n°884, mais aucun véhicule affecté.",
    source: "AS24",
    detectedAt: "28/04/2026 14:02",
  },
  {
    id: "rej-2",
    message: "Ticket péage A6 sans immatriculation reconnue — 12,40 € orphelin.",
    source: "Télépéage",
    detectedAt: "27/04/2026 09:18",
  },
  {
    id: "rej-3",
    message: "Bloc horaires Solides : chauffeur ID 88421 sans mapping tracteur.",
    source: "Solide",
    detectedAt: "26/04/2026 22:41",
  },
];

export const cockpitVehiclesForReassign = [
  { id: "v1", label: "AB-421-PL · TRAGO" },
  { id: "v2", label: "CD-183-PL · Volvo" },
  { id: "v3", label: "EF-092-PL · Scania" },
  { id: "v4", label: "GH-774-PL · DAF" },
];

/** Grille standards éditables — prompt */
export const cockpitCostStandardsDefaults = {
  rh: [
    { id: "rh-spl", role: "Chauffeur SPL", dailyEUR: 170 },
    { id: "rh-cm", role: "Chauffeur CM", dailyEUR: 190 },
    { id: "rh-poly", role: "Polyvalent", dailyEUR: 245 },
  ],
  materiel: [
    { id: "m-trago", label: "Tracteur TRAGO", monthlyRent: 2080, dailyEUR: 80 },
    { id: "m-frigo", label: "Remorque frigo", monthlyRent: 910, dailyEUR: 35 },
  ],
  carburantTheo: [
    { id: "f-trago", label: "TRAGO (GO)", lPer100: 28 },
    { id: "f-tragz", label: "TRAGZ (Gaz)", kgPer100: 30.5 },
  ],
};

/** Executive — série hebdo 12 semaines (3 mois) */
export const cockpitExecutiveWeekly = [
  { week: "S1", ca: 410, margeNette: 52 },
  { week: "S2", ca: 425, margeNette: 55 },
  { week: "S3", ca: 398, margeNette: 48 },
  { week: "S4", ca: 432, margeNette: 58 },
  { week: "S5", ca: 418, margeNette: 51 },
  { week: "S6", ca: 445, margeNette: 60 },
  { week: "S7", ca: 438, margeNette: 57 },
  { week: "S8", ca: 452, margeNette: 62 },
  { week: "S9", ca: 428, margeNette: 54 },
  { week: "S10", ca: 461, margeNette: 64 },
  { week: "S11", ca: 439, margeNette: 56 },
  { week: "S12", ca: 448, margeNette: 59 },
];

export const cockpitTopClients = [
  { client: "DHL Supply", margePct: 18.4, caK: 420 },
  { client: "FedEx", margePct: 17.1, caK: 380 },
  { client: "Schneider Electric", margePct: 16.2, caK: 210 },
];

export const cockpitFlopClients = [
  { client: "Chronopost", margePct: -2.1, caK: 290 },
  { client: "CEVA", margePct: 1.2, caK: 310 },
  { client: "Carrefour", margePct: 2.4, caK: 340 },
];

/** KPIs exécutifs (valeurs de base démo) */
export const cockpitExecutiveKpis = {
  caTotalKEur: 1720,
  caPrevKEur: 1655,
  margeBrutePct: 11.3,
  kmVidePct: 8.2,
  kmVidePrevPct: 7.1,
  coutMoyenKmCents: 82,
};

/** M6 insights */
export const cockpitM6Insights = [
  {
    id: "ins1",
    level: "red",
    title: "Alerte client Amazon",
    body: "Marge négative de -2 % sur les 4 dernières tournées. Action suggérée : revalorisation tarifaire de +4 % ou changement de type de véhicule.",
  },
  {
    id: "ins2",
    level: "orange",
    title: "Optimisation flotte GO",
    body: "3 camions gazole ont été utilisés sur des tournées courtes. Remplacer par des camions gaz générerait une économie estimée à 14 % sur le poste carburant.",
  },
  {
    id: "ins3",
    level: "blue",
    title: "Indexation",
    body: "Mise à jour CNR prévue semaine prochaine — impact simulé +12 k€ sur le périmètre FedEx / Auchan.",
  },
];

/** Justification carburant par id tournée (démo) */
export const cockpitTourneeFuelJustification = {
  "T-0422": "Prévu : 28 L/100 km → Réel : 34 L/100 km (bouchons A6 + détour péage).",
  "T-0427": "Prévu : 28 L/100 km → Réel : 33 L/100 km (stationnement longue durée client).",
  default: "Prévu : 28 L/100 km → Réel : 31 L/100 km (conditions trafic moyennes).",
};

export function getFuelJustification(tourneeId) {
  return cockpitTourneeFuelJustification[tourneeId] || cockpitTourneeFuelJustification.default;
}

/**
 * Indices carburant (démo) — CNR & DIREM
 * Valeurs arbitraires réalistes, utilisées pour convertir en impact €.
 */
export const cockpitFuelIndices = {
  CNR: {
    label: "CNR",
    unit: "pts",
    M: 112.4,
    "M-1": 108.1,
    "M-2": 105.6,
    ref: 101.0,
  },
  DIREM: {
    label: "DIREM",
    unit: "pts",
    M: 206.0,
    "M-1": 201.2,
    "M-2": 198.8,
    ref: 192.5,
  },
};

/**
 * Inputs “production” par tournée (démo) pour Cost Engine / Variance / What-if.
 * - kmPrev/kmReel → écart kilométrique
 * - litresReel + prixPompe → coût carburant réel
 * - heures + nuit + hs → coût salarial réel
 * - penalites + sousTraitance → coûts annexes
 */
export const cockpitTourneeProduction = {
  "T-0421": { kmPrev: 470, kmReel: 487, litresReel: 168, prixPompe: 1.52, heures: 10.2, nuit: 1.1, hs: 0.6, penalites: 0, sousTraitance: 0 },
  "T-0422": { kmPrev: 292, kmReel: 312, litresReel: 106, prixPompe: 1.54, heures: 11.4, nuit: 2.2, hs: 1.3, penalites: 140, sousTraitance: 0 },
  "T-0425": { kmPrev: 505, kmReel: 531, litresReel: 192, prixPompe: 1.51, heures: 10.8, nuit: 0.0, hs: 0.9, penalites: 0, sousTraitance: 250 },
  "T-0427": { kmPrev: 260, kmReel: 289, litresReel: 95, prixPompe: 1.53, heures: 11.1, nuit: 1.8, hs: 1.1, penalites: 160, sousTraitance: 0 },
  "T-0433": { kmPrev: 420, kmReel: 451, litresReel: 148, prixPompe: 1.52, heures: 12.0, nuit: 0.8, hs: 1.6, penalites: 120, sousTraitance: 0 },
  "T-0450": { kmPrev: 475, kmReel: 504, litresReel: 171, prixPompe: 1.52, heures: 11.2, nuit: 0.0, hs: 1.0, penalites: 0, sousTraitance: 0 },
};

export function getTourneeProduction(tourneeId) {
  return cockpitTourneeProduction[tourneeId] || null;
}

/**
 * Cost Engine — calcul “facture de production” (démo).
 * Retourne coûts théoriques et réels par poste (carburant, RH, matériel, péages, pénalités, sous-traitance).
 */
export function computeTourneeCostBreakdown(tournee, { vehicleType = "SPL", energy = "GO" } = {}) {
  if (!tournee) return null;
  const prod = getTourneeProduction(tournee.id) || {};

  const kmPrev = prod.kmPrev ?? tournee.km ?? 0;
  const kmReel = prod.kmReel ?? tournee.km ?? 0;

  const conso = cockpitConsoByVehicle[vehicleType]?.[energy === "GO" ? "GO" : "Gaz"] ?? 28;
  const pump = prod.prixPompe ?? (energy === "GO" ? cockpitPumpPrices.GO : cockpitPumpPrices.Gaz);

  const litresTheo = (kmPrev / 100) * conso;
  const fuelTheo = litresTheo * pump;

  const litresReel = prod.litresReel ?? Math.max(0, litresTheo * 1.1);
  const fuelReel = litresReel * pump;

  const peagesTheo = kmPrev * cockpitPeagePerKm;
  const peagesReel = kmReel * cockpitPeagePerKm;

  const baseDay = cockpitDriverFlat[vehicleType] ?? 170;
  const heures = prod.heures ?? 10.0;
  const nuit = prod.nuit ?? 0;
  const hs = prod.hs ?? 0;
  const nightPremium = nuit * 6.5; // €/h (démo)
  const overtimePremium = hs * 14.0; // €/h (démo)
  const rhTheo = baseDay;
  const rhReel = baseDay + nightPremium + overtimePremium;

  const materielTheo = 115; // €/tournée (démo : tracteur + semi + assurance/entretien)
  const materielReel = materielTheo + (kmReel - kmPrev) * 0.05;

  const penalites = prod.penalites ?? 0;
  const sousTraitance = prod.sousTraitance ?? 0;

  const totalTheo = fuelTheo + rhTheo + materielTheo + peagesTheo;
  const totalReel = fuelReel + rhReel + materielReel + peagesReel + penalites + sousTraitance;

  return {
    kmPrev,
    kmReel,
    energy,
    vehicleType,
    theorique: { fuel: fuelTheo, rh: rhTheo, materiel: materielTheo, peages: peagesTheo, total: totalTheo, litres: litresTheo, pump },
    reel: { fuel: fuelReel, rh: rhReel, materiel: materielReel, peages: peagesReel, penalites, sousTraitance, total: totalReel, litres: litresReel, pump, heures, nuit, hs },
    ecarts: {
      km: kmReel - kmPrev,
      fuel: fuelReel - fuelTheo,
      rh: rhReel - rhTheo,
      materiel: materielReel - materielTheo,
      peages: peagesReel - peagesTheo,
      penalites,
      sousTraitance,
      total: totalReel - totalTheo,
    },
  };
}
