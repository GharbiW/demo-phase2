// ─────────────────────────────────────────────────────────────────
//  PARNASS PHASE 2 — DEMO DATA  (fake data, no backend)
// ─────────────────────────────────────────────────────────────────

export const demoMeta = {
  lastUpdatedLabel: "05 mai 2026 (Discovery terminée — scope validé)",
  scopeLabel: "Phase 2 — Démo statique (30+ pages)",
  caAnnuelTotal: "17,2 M€",
  deltanonTrace: "~600 k€/an",
};

// ─── M1 — CONTRACTS ──────────────────────────────────────────────

export const m1Contracts = [
  {
    id: "C-001",
    client: "FedEx",
    type: "National express",
    statut: "Actif",
    dateDebut: "01/01/2024",
    dateFin: "31/12/2026",
    caAnnuel: 5800000,
    complexite: "Élevée",
    particularite: "Indexation par prestation — import CSV prévu (173 lignes de règles)",
    indexation: {
      indice_reference: 174.88,
      base_indice: "CNR GO PRO M-1",
      type_carburant: "GO",
      mode_temporel: "M_MOINS_1",
      type_ponderation: "CONSO_X_KM",
      ponderation_valeur: 28.0,
      km_contractuels: 420000,
      mode_facturation_igo: "PIED_DE_FACTURE",
      niveau_application: "SPECIFIQUE_PRESTATION",
      date_debut: "01/01/2026",
      date_fin: "31/12/2026",
    },
  },
  {
    id: "C-002",
    client: "Auchan",
    type: "Distribution GMS",
    statut: "Actif",
    dateDebut: "01/03/2023",
    dateFin: "28/02/2027",
    caAnnuel: 2900000,
    complexite: "Modérée",
    particularite: "Formule M-1 moins TCPE — en attente confirmation (H5)",
    indexation: {
      indice_reference: 174.88,
      base_indice: "PMM DIREM M-1",
      type_carburant: "GO",
      mode_temporel: "M_MOINS_1",
      type_ponderation: "POURCENT_FORFAIT",
      ponderation_valeur: 0.32,
      km_contractuels: null,
      mode_facturation_igo: "VARIATION_TK",
      niveau_application: "HERITE_CONTRAT",
      date_debut: "01/01/2026",
      date_fin: "31/12/2026",
    },
  },
  {
    id: "C-003",
    client: "CEVA",
    type: "Logistique 3PL",
    statut: "Actif",
    dateDebut: "01/06/2024",
    dateFin: "31/05/2027",
    caAnnuel: 3900000,
    complexite: "Élevée",
    particularite: "Formule à définir — négociation en cours",
    indexation: {
      indice_reference: 174.88,
      base_indice: "CNR GO PRO M-1",
      type_carburant: "GO",
      mode_temporel: "M_MOINS_1",
      type_ponderation: "POURCENT_FORFAIT",
      ponderation_valeur: 0.30,
      km_contractuels: null,
      mode_facturation_igo: "PIED_DE_FACTURE",
      niveau_application: "HERITE_CONTRAT",
      date_debut: "01/06/2024",
      date_fin: "31/05/2027",
    },
  },
  {
    id: "C-004",
    client: "Chronopost",
    type: "Messagerie express",
    statut: "Actif",
    dateDebut: "01/01/2025",
    dateFin: "31/12/2025",
    caAnnuel: 1800000,
    complexite: "Modérée",
    particularite: "Traitement standard avec cas spécifiques documentés",
    indexation: {
      indice_reference: 168.42,
      base_indice: "CNR GO PRO M-1",
      type_carburant: "GO",
      mode_temporel: "M_MOINS_1",
      type_ponderation: "POURCENT_FORFAIT",
      ponderation_valeur: 0.28,
      km_contractuels: null,
      mode_facturation_igo: "SUR_KM",
      niveau_application: "HERITE_CONTRAT",
      date_debut: "01/01/2025",
      date_fin: "31/12/2025",
    },
  },
  {
    id: "C-005",
    client: "DHL Supply",
    type: "Contrat cadre",
    statut: "Actif",
    dateDebut: "15/09/2024",
    dateFin: "14/09/2027",
    caAnnuel: 4600000,
    complexite: "Élevée",
    particularite: "Multi-formule avec péages inclus — Dirham + CNR GO",
    indexation: {
      indice_reference: 1.8930,
      base_indice: "Dirham TTC M-1",
      type_carburant: "GNL",
      mode_temporel: "M_MOINS_1",
      type_ponderation: "CONSO_X_KM",
      ponderation_valeur: 31.2,
      km_contractuels: 380000,
      mode_facturation_igo: "PIED_DE_FACTURE",
      niveau_application: "HERITE_CONTRAT",
      date_debut: "01/01/2026",
      date_fin: "31/12/2026",
    },
  },
  {
    id: "C-006",
    client: "Carrefour",
    type: "Distribution GMS",
    statut: "En révision",
    dateDebut: "01/02/2022",
    dateFin: "31/01/2026",
    caAnnuel: 1200000,
    complexite: "Faible",
    particularite: "Renouvellement en négociation — CNC GNC",
    indexation: {
      indice_reference: 1.2187,
      base_indice: "CNR GNV M-1",
      type_carburant: "GNC",
      mode_temporel: "M_MOINS_1",
      type_ponderation: "POURCENT_FORFAIT",
      ponderation_valeur: 0.35,
      km_contractuels: null,
      mode_facturation_igo: "SUR_KM",
      niveau_application: "HERITE_CONTRAT",
      date_debut: "01/02/2022",
      date_fin: "31/01/2026",
    },
  },
  {
    id: "C-007",
    client: "Leroy Merlin",
    type: "Transport spécialisé",
    statut: "Actif",
    dateDebut: "01/04/2025",
    dateFin: "31/03/2027",
    caAnnuel: 980000,
    complexite: "Modérée",
    particularite: "Marchandises volumineuses — tarif au m3",
    indexation: {
      indice_reference: 174.88,
      base_indice: "CNR GO PRO M-1",
      type_carburant: "GO",
      mode_temporel: "M_MOINS_1",
      type_ponderation: "POURCENT_FORFAIT",
      ponderation_valeur: 0.29,
      km_contractuels: null,
      mode_facturation_igo: "VARIATION_TK",
      niveau_application: "HERITE_CONTRAT",
      date_debut: "01/04/2025",
      date_fin: "31/03/2027",
    },
  },
  {
    id: "C-008",
    client: "Schneider Electric",
    type: "Industrie — B2B",
    statut: "Actif",
    dateDebut: "01/07/2024",
    dateFin: "30/06/2026",
    caAnnuel: 720000,
    complexite: "Élevée",
    particularite: "Températures dirigées — camions frigo — Fioul frigo inclus",
    indexation: {
      indice_reference: 0.7812,
      base_indice: "FIOUL lourd M-1",
      type_carburant: "FIOUL_FRIGO",
      mode_temporel: "M_MOINS_1",
      type_ponderation: "CONSO_X_KM",
      ponderation_valeur: 2.0,
      km_contractuels: 85000,
      mode_facturation_igo: "SUR_KM",
      niveau_application: "HERITE_CONTRAT",
      date_debut: "01/07/2024",
      date_fin: "30/06/2026",
    },
  },
];

// ─── M1 — INDEXATION FIELDS (spec table) ─────────────────────────

export const m1FuelIndexationFields = [
  { key: "indice_reference", type: "Décimal", example: "1,2187 (CNR) ou 174,88 (Dirham)" },
  { key: "base_indice", type: "Texte", example: "CNR GO PRO M-1 · PMM DIREM M-1 · CNR GNV M-1/100" },
  { key: "type_carburant", type: "Enum", example: "GO · GNC · GNV · GNL · BIO_GNC · GNR · FIOUL_FRIGO" },
  { key: "mode_temporel", type: "Enum", example: "M_MOINS_1 · M_MOINS_2 · M" },
  { key: "type_ponderation", type: "Enum", example: "POURCENT_FORFAIT · CONSO_X_KM" },
  { key: "ponderation_valeur", type: "Décimal", example: "0→1 (%) ou L/100km si CONSO" },
  { key: "km_contractuels", type: "Décimal (nullable)", example: "Référence km pour CONSO_X_KM" },
  { key: "mode_facturation_igo", type: "Enum", example: "PIED_DE_FACTURE · SUR_KM · VARIATION_TK" },
  { key: "niveau_application", type: "Enum", example: "HERITE_CONTRAT · SPECIFIQUE_PRESTATION" },
  { key: "date_debut", type: "Date", example: "Période de validité" },
  { key: "date_fin", type: "Date", example: "Période de validité" },
];

export const m1TheoreticalCA = {
  formula: "CA Théorique = Σ prestations contrat ADV (avec éclatement sur trajets si besoin)",
  decomposition: ["Effet volume", "Effet prix", "Effet indexation"],
  sampleRows: [
    { contrat: "FedEx — National", caTheorique: "5 800 000 €", caReel: "5 684 000 €", indexation: "+ 385 000 €", delta: "- 116 000 €" },
    { contrat: "DHL Supply — Cadre", caTheorique: "4 600 000 €", caReel: "4 416 000 €", indexation: "+ 62 000 €", delta: "- 184 000 €" },
  ],
};

// ─── M2 — SOURCES ─────────────────────────────────────────────────

export const m2Sources = [
  { name: "ADV / Contrats", statut: "Existant", frequence: "À la signature", priorite: "Critique", note: "CA théorique, prestations, règles tarifaires, paramétrage indexation" },
  { name: "Exploitation (module)", statut: "Existant", frequence: "Quotidien", priorite: "Critique", note: "Prestations réalisées, CA réel, affectations véhicules/chauffeurs" },
  { name: "AS24", statut: "À connecter", frequence: "Mensuel", priorite: "Critique", note: "Carburant réel par immatriculation + péages — impact 385 k€/an" },
  { name: "Engie", statut: "CSV à normaliser", frequence: "Mensuel", priorite: "Critique", note: "Carburant GNC/GNL/BIO GNC — virgules sur quantités à normaliser" },
  { name: "Masternaut / Michelin", statut: "À connecter", frequence: "Hebdo/Mensuel", priorite: "Critique", note: "Km réels, conso, géoloc, jauge carburant, amplitude" },
  { name: "Factorial / Silae", statut: "À connecter", frequence: "Mensuel (M-1)", priorite: "Critique", note: "149 bulletins paie · 324 751€ sur 76 bulletins en mars 2026" },
  { name: "Solides (Tacho)", statut: "Synchro irrégulière", frequence: "Continue (~7 nuits)", priorite: "Élevée", note: "Amplitude, TDS, conduite, repos — synchro défaut 7 nuits, partiel fréquent" },
  { name: "PTV", statut: "À évaluer", frequence: "À la conception", priorite: "Élevée", note: "Km théoriques, temps, repositionnements — évaluation API en cours" },
  { name: "Factures garage", statut: "Manuel", frequence: "Mensuel", priorite: "Élevée", note: "Entretien réel, casse, pneumatiques, remplacements — structuration avant automatisation" },
  { name: "CNR", statut: "À intégrer", frequence: "Mensuel", priorite: "Moyenne", note: "Indices historiques (jusqu'à déc. 2025) — 173 lignes de règles FedEx" },
  { name: "Dirham (Ministère)", statut: "À intégrer", frequence: "Mensuel", priorite: "Moyenne", note: "Prix pompe TTC depuis janv. 2026 — bascule depuis CNR" },
];

export const m2EtlSteps = [
  { step: "① Ingestion", label: "Connecteurs API (AS24, Factorial, Masternaut) + import CSV automatisé (Engie, Dirham, Factures)", status: "ok" },
  { step: "② Validation", label: "Contrôles intégrité, champs obligatoires, plages valeurs — file d'exceptions si anomalie", status: "ok" },
  { step: "③ Normalisation", label: "Virgules → points (Engie), standardisation immatriculations, formats dates", status: "warn" },
  { step: "④ Mapping", label: "Correspondance entités externes ↔ référentiels internes (véhicules, chauffeurs, clients)", status: "ok" },
  { step: "⑤ Dédoublonnage", label: "Transactions dupliquées (plein AS24 × 2) — règle : conserver la plus récente", status: "ok" },
  { step: "⑥ Logs & alertes", label: "Traçabilité complète + alertes anomalies critiques (véhicule coût=0, plein >2× moyenne)", status: "warn" },
];

/** Ordre d’activation des flux — chiffrage indicatif mensuel (k€), démo */
export const m2ConnectionPriorities = [
  { order: 1, titre: "AS24 / Engie (carburant)", priorite: "Critique", impactMensuelK: 32, statut: "En cours", risque: "Engie : décimales virgule" },
  { order: 2, titre: "Factorial / Silae (paie)", priorite: "Critique", impactMensuelK: 271, statut: "En cours", risque: "Mapping conducteur" },
  { order: 3, titre: "Masternaut / Solides", priorite: "Critique", impactMensuelK: 0, statut: "À brancher", risque: "Export Solides partiel" },
  { order: 4, titre: "CNR / Dirham (indices)", priorite: "Moyenne", impactMensuelK: 18, statut: "En cours", risque: "Bascule série janv. 26" },
  { order: 5, titre: "Factures garage", priorite: "Élevée", impactMensuelK: 24, statut: "Manuel", risque: "PDF hétérogènes" },
  { order: 6, titre: "PTV", priorite: "Élevée", impactMensuelK: 0, statut: "À évaluer", risque: "Contrat API" },
];

/**
 * Exemples de lignes telles qu’arrivent des systèmes sources (démo UI).
 * Clés = libellés exacts de `m2Sources[].name`.
 */
export const m2SourceIngestSamples = {
  "AS24": {
    lastIngest: "2026-04-28 06:12",
    columns: ["transaction_id", "immat", "date_service", "produit", "montant_ttc", "litres", "pays"],
    rows: [
      { transaction_id: "AS24-88421", immat: "AB-421-PL", date_service: "2026-04-27", produit: "GO_EURO95", montant_ttc: 1247.89, litres: 412.3, pays: "FR" },
      { transaction_id: "AS24-88422", immat: "EF-092-PL", date_service: "2026-04-27", produit: "GNC", montant_ttc: 986.12, litres: 0, pays: "FR" },
      { transaction_id: "AS24-88423", immat: "AB-421-PL", date_service: "2026-04-26", produit: "PEAGE", montant_ttc: 84.2, litres: 0, pays: "FR" },
    ],
  },
  Engie: {
    lastIngest: "2026-04-26 09:00",
    columns: ["ligne_csv", "brut"],
    rows: [
      { ligne_csv: 1, brut: "202604;EF-092-PL;GNC;\"128,5\";\"1,1429\";147,02" },
      { ligne_csv: 2, brut: "202604;MN-447-PL;GNC;\"95,2\";\"1,1390\";108,43" },
    ],
    footnote: "Champ litres avec virgule — à normaliser en point avant agrégation.",
  },
  "Masternaut / Michelin": {
    lastIngest: "2026-04-28 04:00",
    columns: ["vehicle_uid", "immat", "odometer_km", "fuel_l_100", "ts_utc"],
    rows: [
      { vehicle_uid: "MN-447-PL", immat: "MN-447-PL", odometer_km: 98540, fuel_l_100: 30.8, ts_utc: "2026-04-28T02:00:00Z" },
      { vehicle_uid: "GH-774-PL", immat: "GH-774-PL", odometer_km: 89210, fuel_l_100: 29.9, ts_utc: "2026-04-28T02:00:00Z" },
    ],
  },
  "Factorial / Silae": {
    lastIngest: "2026-04-25 (M-1)",
    columns: ["bulletin_id", "matricule", "nom", "brut_mensuel", "charges_patronales", "jours_travailles"],
    rows: [
      { bulletin_id: "SIL-202604-881", matricule: "8841", nom: "Martin D.", brut_mensuel: 3842.1, charges_patronales: 1921.05, jours_travailles: 21 },
      { bulletin_id: "SIL-202604-882", matricule: "8842", nom: "Dupont A.", brut_mensuel: 3620.0, charges_patronales: 1810.0, jours_travailles: 19 },
    ],
  },
  "Solides (Tacho)": {
    lastIngest: "2026-04-10 (export partiel)",
    columns: ["driver_card", "vehicle", "activity", "duration_min", "date_local"],
    rows: [
      { driver_card: "FR******901", vehicle: "CD-183-PL", activity: "DRIVING", duration_min: 284, date_local: "2026-04-09" },
      { driver_card: "FR******902", vehicle: "CD-183-PL", activity: "REST", duration_min: 45, date_local: "2026-04-09" },
    ],
  },
  "ADV / Contrats": {
    lastIngest: "2026-04-01",
    columns: ["contrat_id", "client", "prestation_code", "tarif_ht_km", "date_debut", "indexation_auto"],
    rows: [
      { contrat_id: "CTR-FDX-2025", client: "FedEx", prestation_code: "LD_FR_EXP", tarif_ht_km: 1.42, date_debut: "2025-06-01", indexation_auto: true },
    ],
  },
  "Exploitation (module)": {
    lastIngest: "2026-04-28 07:14",
    columns: ["prestation_id", "tournee_id", "client", "km_reel", "ca_ht", "date_realisation"],
    rows: [
      { prestation_id: "PR-99281", tournee_id: "T-0447", client: "FedEx", km_reel: 664, ca_ht: 11500, date_realisation: "2026-04-28" },
      { prestation_id: "PR-99282", tournee_id: "T-0448", client: "CEVA", km_reel: 395, ca_ht: 6800, date_realisation: "2026-04-28" },
    ],
  },
  CNR: {
    lastIngest: "2026-04-01",
    columns: ["mois", "indice_go", "indice_gnc", "source"],
    rows: [
      { mois: "2026-03", indice_go: 1.084, indice_gnc: 1.062, source: "CNR" },
    ],
  },
  "Dirham (Ministère)": {
    lastIngest: "2026-04-01",
    columns: ["mois", "prix_pompe_go_ttc", "prix_pompe_gnc_ttc"],
    rows: [
      { mois: "2026-04", prix_pompe_go_ttc: 1.952, prix_pompe_gnc_ttc: 1.421 },
    ],
  },
  PTV: {
    lastIngest: "—",
    columns: ["tour_id", "km_theorique", "duree_min", "fenetre_depart"],
    rows: [
      { tour_id: "SIM-001", km_theorique: 512, duree_min: 660, fenetre_depart: "06:00-08:00" },
    ],
  },
  "Factures garage": {
    lastIngest: "2026-04-18",
    columns: ["facture_no", "immat", "montant_ht", "poste", "fournisseur"],
    rows: [
      { facture_no: "FG-2026-1182", immat: "AB-421-PL", montant_ht: 1240, poste: "PNEUS", fournisseur: "Euromaster Lyon" },
    ],
  },
};

/**
 * M2 — Source of truth (records)
 * Données complètes (démo) affichées dans le hub backoffice.
 * IMPORTANT: les clés doivent matcher `m2Sources[].name` exactement.
 */
export const m2SourceRecords = {
  "Factorial / Silae": [
    { matricule: "E-0142", nom: "Dupont", prenom: "Alexandre", poste: "Conducteur SPL", contrat: "CDI", salaire_brut: 2780, primes: 220, charges: 1210, salaire_net: 2140, jours_travailles: 21, periode: "Mars 2026" },
    { matricule: "E-0151", nom: "Bernard", prenom: "Pierre", poste: "Conducteur SPL", contrat: "CDI", salaire_brut: 2840, primes: 180, charges: 1245, salaire_net: 2170, jours_travailles: 20, periode: "Mars 2026" },
    { matricule: "E-0129", nom: "Morel", prenom: "Yanis", poste: "Conducteur CM", contrat: "CDI", salaire_brut: 2960, primes: 260, charges: 1310, salaire_net: 2280, jours_travailles: 22, periode: "Mars 2026" },
    { matricule: "E-0172", nom: "Leroy", prenom: "Inès", poste: "Conducteur VL", contrat: "CDD", salaire_brut: 2060, primes: 95, charges: 870, salaire_net: 1650, jours_travailles: 19, periode: "Mars 2026" },
    { matricule: "E-0107", nom: "Roussel", prenom: "Mehdi", poste: "Conducteur SPL", contrat: "CDI", salaire_brut: 2890, primes: 210, charges: 1275, salaire_net: 2210, jours_travailles: 21, periode: "Mars 2026" },
    { matricule: "E-0184", nom: "Martin", prenom: "Sarah", poste: "Exploitant", contrat: "CDI", salaire_brut: 3120, primes: 0, charges: 1390, salaire_net: 2400, jours_travailles: 22, periode: "Mars 2026" },
    { matricule: "E-0190", nom: "Nguyen", prenom: "Linh", poste: "RH / Paie", contrat: "CDI", salaire_brut: 3380, primes: 0, charges: 1505, salaire_net: 2580, jours_travailles: 22, periode: "Mars 2026" },
    { matricule: "E-0118", nom: "Petit", prenom: "Lucas", poste: "Conducteur SPL", contrat: "CDI", salaire_brut: 2710, primes: 160, charges: 1185, salaire_net: 2080, jours_travailles: 20, periode: "Mars 2026" },
    { matricule: "E-0168", nom: "Garnier", prenom: "Chloé", poste: "Conducteur CM", contrat: "CDI", salaire_brut: 3010, primes: 240, charges: 1335, salaire_net: 2315, jours_travailles: 22, periode: "Mars 2026" },
    { matricule: "E-0201", nom: "Diallo", prenom: "Moussa", poste: "Conducteur SPL", contrat: "CDI", salaire_brut: 2870, primes: 190, charges: 1255, salaire_net: 2190, jours_travailles: 21, periode: "Mars 2026" },
    { matricule: "E-0206", nom: "Ribeiro", prenom: "Ana", poste: "Comptable", contrat: "CDI", salaire_brut: 3260, primes: 0, charges: 1450, salaire_net: 2500, jours_travailles: 22, periode: "Mars 2026" },
    { matricule: "E-0210", nom: "Lopez", prenom: "Carlos", poste: "Conducteur VL", contrat: "CDD", salaire_brut: 1980, primes: 85, charges: 835, salaire_net: 1590, jours_travailles: 18, periode: "Mars 2026" },
  ],

  AS24: [
    { date: "2026-04-02", immat: "AB-421-PL", chauffeur: "Dupont A.", station: "AS24 Lille", litres: 412, prix_litre: 1.54, total_ttc: 634.48, type_energie: "GO", categorie: "Plein" },
    { date: "2026-04-03", immat: "IJ-556-PL", chauffeur: "Bernard P.", station: "AS24 Reims", litres: 386, prix_litre: 1.53, total_ttc: 590.58, type_energie: "GO", categorie: "Plein" },
    { date: "2026-04-05", immat: "CM-902-ZZ", chauffeur: "Morel Y.", station: "AS24 Lyon", litres: 274, prix_litre: 1.55, total_ttc: 424.7, type_energie: "GO", categorie: "Plein" },
    { date: "2026-04-06", immat: "VL-221-KP", chauffeur: "Leroy I.", station: "AS24 Paris", litres: 62, prix_litre: 1.61, total_ttc: 99.82, type_energie: "GO", categorie: "Plein" },
    { date: "2026-04-06", immat: "AB-421-PL", chauffeur: "Dupont A.", station: "AS24 Lille", litres: 95, prix_litre: 1.54, total_ttc: 146.3, type_energie: "GO", categorie: "Complément" },
    { date: "2026-04-07", immat: "SR-03", chauffeur: "—", station: "AS24 Portail péage", litres: null, prix_litre: null, total_ttc: 128.9, type_energie: "—", categorie: "Péage" },
    { date: "2026-04-10", immat: "IJ-556-PL", chauffeur: "Bernard P.", station: "AS24 Dijon", litres: 355, prix_litre: 1.52, total_ttc: 539.6, type_energie: "GO", categorie: "Plein" },
    { date: "2026-04-12", immat: "AB-421-PL", chauffeur: "Dupont A.", station: "AS24 Amiens", litres: 402, prix_litre: 1.53, total_ttc: 615.06, type_energie: "GO", categorie: "Plein" },
    { date: "2026-04-13", immat: "CM-902-ZZ", chauffeur: "Garnier C.", station: "AS24 Metz", litres: 288, prix_litre: 1.56, total_ttc: 449.28, type_energie: "GO", categorie: "Plein" },
    { date: "2026-04-14", immat: "SR-02", chauffeur: "—", station: "AS24 Portail péage", litres: null, prix_litre: null, total_ttc: 97.4, type_energie: "—", categorie: "Péage" },
  ],

  Engie: [
    { date: "2026-04-02", immat: "AB-421-PL", heures_frigo: 9.6, litres_frigo: 19.2, prix_litre: 1.32, total_ttc: 25.34, site: "Dépôt Lille" },
    { date: "2026-04-03", immat: "IJ-556-PL", heures_frigo: 7.8, litres_frigo: 15.6, prix_litre: 1.31, total_ttc: 20.44, site: "Dépôt Reims" },
    { date: "2026-04-05", immat: "CM-902-ZZ", heures_frigo: 11.2, litres_frigo: 22.4, prix_litre: 1.33, total_ttc: 29.79, site: "Dépôt Lyon" },
    { date: "2026-04-06", immat: "AB-421-PL", heures_frigo: 8.9, litres_frigo: 17.8, prix_litre: 1.32, total_ttc: 23.5, site: "Dépôt Lille" },
    { date: "2026-04-08", immat: "IJ-556-PL", heures_frigo: 10.5, litres_frigo: 21.0, prix_litre: 1.31, total_ttc: 27.51, site: "Dépôt Reims" },
    { date: "2026-04-10", immat: "AB-421-PL", heures_frigo: 9.1, litres_frigo: 18.2, prix_litre: 1.32, total_ttc: 24.02, site: "Dépôt Lille" },
    { date: "2026-04-12", immat: "CM-902-ZZ", heures_frigo: 6.4, litres_frigo: 12.8, prix_litre: 1.33, total_ttc: 17.02, site: "Dépôt Lyon" },
    { date: "2026-04-13", immat: "IJ-556-PL", heures_frigo: 8.2, litres_frigo: 16.4, prix_litre: 1.31, total_ttc: 21.48, site: "Dépôt Reims" },
  ],

  "Masternaut / Michelin": [
    { date: "2026-04-01", immat: "AB-421-PL", chauffeur: "Dupont A.", km_planifie: 512, km_reel: 544, km_vide: 62, eco_score: 71, vitesse_moy: 78 },
    { date: "2026-04-02", immat: "IJ-556-PL", chauffeur: "Bernard P.", km_planifie: 466, km_reel: 479, km_vide: 44, eco_score: 75, vitesse_moy: 74 },
    { date: "2026-04-03", immat: "CM-902-ZZ", chauffeur: "Morel Y.", km_planifie: 388, km_reel: 421, km_vide: 58, eco_score: 69, vitesse_moy: 71 },
    { date: "2026-04-04", immat: "AB-421-PL", chauffeur: "Dupont A.", km_planifie: 505, km_reel: 561, km_vide: 84, eco_score: 66, vitesse_moy: 76 },
    { date: "2026-04-05", immat: "VL-221-KP", chauffeur: "Leroy I.", km_planifie: 138, km_reel: 152, km_vide: 19, eco_score: 82, vitesse_moy: 54 },
    { date: "2026-04-06", immat: "IJ-556-PL", chauffeur: "Bernard P.", km_planifie: 472, km_reel: 501, km_vide: 61, eco_score: 70, vitesse_moy: 73 },
    { date: "2026-04-07", immat: "CM-902-ZZ", chauffeur: "Garnier C.", km_planifie: 402, km_reel: 433, km_vide: 66, eco_score: 68, vitesse_moy: 69 },
    { date: "2026-04-08", immat: "AB-421-PL", chauffeur: "Dupont A.", km_planifie: 496, km_reel: 538, km_vide: 73, eco_score: 67, vitesse_moy: 77 },
  ],

  "Solides (Tacho)": [
    { date: "2026-04-01", chauffeur: "Dupont A.", matricule: "E-0142", heures_conduite: 8.6, heures_travail: 10.4, heures_repos: 11.2, distance_km: 544, infractions: 0 },
    { date: "2026-04-02", chauffeur: "Bernard P.", matricule: "E-0151", heures_conduite: 8.1, heures_travail: 10.0, heures_repos: 11.5, distance_km: 479, infractions: 0 },
    { date: "2026-04-03", chauffeur: "Morel Y.", matricule: "E-0129", heures_conduite: 7.8, heures_travail: 9.6, heures_repos: 11.0, distance_km: 421, infractions: 1 },
    { date: "2026-04-04", chauffeur: "Dupont A.", matricule: "E-0142", heures_conduite: 9.2, heures_travail: 11.3, heures_repos: 10.6, distance_km: 561, infractions: 0 },
    { date: "2026-04-05", chauffeur: "Leroy I.", matricule: "E-0172", heures_conduite: 4.6, heures_travail: 6.2, heures_repos: 12.4, distance_km: 152, infractions: 0 },
    { date: "2026-04-06", chauffeur: "Bernard P.", matricule: "E-0151", heures_conduite: 8.4, heures_travail: 10.6, heures_repos: 11.1, distance_km: 501, infractions: 0 },
    { date: "2026-04-07", chauffeur: "Garnier C.", matricule: "E-0168", heures_conduite: 7.7, heures_travail: 9.8, heures_repos: 11.3, distance_km: 433, infractions: 0 },
  ],

  "Factures garage": [
    { date: "2026-04-03", immat: "AB-421-PL", type_intervention: "Révision 180k", kilometrage: 198400, cout_ht: 1480, tva: 296, cout_ttc: 1776, prestataire: "Euromaster Lille", reference: "FG-2026-1182" },
    { date: "2026-04-05", immat: "IJ-556-PL", type_intervention: "Pneus AV", kilometrage: 221600, cout_ht: 820, tva: 164, cout_ttc: 984, prestataire: "Euromaster Reims", reference: "FG-2026-1191" },
    { date: "2026-04-07", immat: "CM-902-ZZ", type_intervention: "Freins", kilometrage: 174200, cout_ht: 640, tva: 128, cout_ttc: 768, prestataire: "Garage Rhône", reference: "FG-2026-1204" },
    { date: "2026-04-10", immat: "VL-221-KP", type_intervention: "Vidange", kilometrage: 83200, cout_ht: 110, tva: 22, cout_ttc: 132, prestataire: "Garage IDF", reference: "FG-2026-1212" },
    { date: "2026-04-12", immat: "AB-421-PL", type_intervention: "Pneus AR", kilometrage: 199300, cout_ht: 920, tva: 184, cout_ttc: 1104, prestataire: "Euromaster Amiens", reference: "FG-2026-1220" },
    { date: "2026-04-14", immat: "IJ-556-PL", type_intervention: "Capteur NOx", kilometrage: 222100, cout_ht: 430, tva: 86, cout_ttc: 516, prestataire: "Garage Est", reference: "FG-2026-1231" },
  ],

  "ADV / Contrats": m1Contracts.map((c) => ({
    id: c.id,
    client: c.client,
    type: c.type,
    statut: c.statut,
    date_debut: c.dateDebut,
    date_fin: c.dateFin,
    ca_annuel: c.caAnnuel,
    particularite: c.particularite,
    base_indice: c.indexation?.base_indice,
  })),

  "Exploitation (module)": [
    { date: "2026-04-01", tournee_id: "T-0421", chauffeur: "Dupont A.", client: "FedEx", km_planifie: 512, km_reel: 544, statut: "exécutée", immat: "AB-421-PL" },
    { date: "2026-04-02", tournee_id: "T-0422", chauffeur: "Bernard P.", client: "Chronopost", km_planifie: 466, km_reel: 479, statut: "exécutée", immat: "IJ-556-PL" },
    { date: "2026-04-03", tournee_id: "T-0423", chauffeur: "Morel Y.", client: "Carrefour", km_planifie: 388, km_reel: 421, statut: "exécutée", immat: "CM-902-ZZ" },
    { date: "2026-04-04", tournee_id: "T-0424", chauffeur: "Dupont A.", client: "DHL Supply", km_planifie: 505, km_reel: 561, statut: "exécutée", immat: "AB-421-PL" },
    { date: "2026-04-05", tournee_id: "T-0425", chauffeur: "Leroy I.", client: "Auchan", km_planifie: 138, km_reel: 152, statut: "exécutée", immat: "VL-221-KP" },
    { date: "2026-04-06", tournee_id: "T-0426", chauffeur: "Bernard P.", client: "CEVA", km_planifie: 472, km_reel: 501, statut: "exécutée", immat: "IJ-556-PL" },
    { date: "2026-04-07", tournee_id: "T-0427", chauffeur: "Garnier C.", client: "FedEx", km_planifie: 402, km_reel: 433, statut: "exécutée", immat: "CM-902-ZZ" },
    { date: "2026-04-08", tournee_id: "T-0428", chauffeur: "Dupont A.", client: "Carrefour", km_planifie: 496, km_reel: 538, statut: "exécutée", immat: "AB-421-PL" },
  ],

  PTV: [
    { origine: "Roissy CDG", destination: "Lille", km_theorique: 221, peage_theo: 31.8, duree_min: 165, nb_routes: 3 },
    { origine: "Roissy CDG", destination: "Reims", km_theorique: 151, peage_theo: 19.6, duree_min: 110, nb_routes: 2 },
    { origine: "Paris", destination: "Lyon", km_theorique: 465, peage_theo: 46.2, duree_min: 295, nb_routes: 4 },
    { origine: "Lille", destination: "Amiens", km_theorique: 124, peage_theo: 8.4, duree_min: 92, nb_routes: 2 },
    { origine: "Metz", destination: "Dijon", km_theorique: 267, peage_theo: 22.1, duree_min: 190, nb_routes: 3 },
    { origine: "Reims", destination: "Paris", km_theorique: 144, peage_theo: 16.9, duree_min: 105, nb_routes: 2 },
  ],

  CNR: [
    { mois: "Mai 25", indice: 166.1, variation_m: 0.8, variation_ref: -2.2 },
    { mois: "Juin 25", indice: 167.4, variation_m: 0.8, variation_ref: -1.4 },
    { mois: "Juil. 25", indice: 168.2, variation_m: 0.5, variation_ref: -0.9 },
    { mois: "Août 25", indice: 169.6, variation_m: 0.8, variation_ref: -0.1 },
    { mois: "Sept. 25", indice: 171.3, variation_m: 1.0, variation_ref: 0.9 },
    { mois: "Oct. 25", indice: 172.8, variation_m: 0.9, variation_ref: 1.8 },
    { mois: "Nov. 25", indice: 173.9, variation_m: 0.6, variation_ref: 2.4 },
    { mois: "Déc. 25", indice: 174.9, variation_m: 0.6, variation_ref: 3.0 },
    { mois: "Janv. 26", indice: 175.4, variation_m: 0.3, variation_ref: 3.3 },
    { mois: "Fév. 26", indice: 174.6, variation_m: -0.5, variation_ref: 2.8 },
    { mois: "Mars 26", indice: 175.9, variation_m: 0.7, variation_ref: 3.6 },
    { mois: "Avr. 26", indice: 176.4, variation_m: 0.3, variation_ref: 3.9 },
  ],

  "Dirham (Ministère)": [
    { mois: "Mai 25", prix_go_ht: 1.28, prix_gnc_ht: 1.05, variation_m: 0.6 },
    { mois: "Juin 25", prix_go_ht: 1.29, prix_gnc_ht: 1.06, variation_m: 0.8 },
    { mois: "Juil. 25", prix_go_ht: 1.31, prix_gnc_ht: 1.08, variation_m: 1.2 },
    { mois: "Août 25", prix_go_ht: 1.30, prix_gnc_ht: 1.07, variation_m: -0.7 },
    { mois: "Sept. 25", prix_go_ht: 1.33, prix_gnc_ht: 1.09, variation_m: 2.1 },
    { mois: "Oct. 25", prix_go_ht: 1.34, prix_gnc_ht: 1.10, variation_m: 0.8 },
    { mois: "Nov. 25", prix_go_ht: 1.35, prix_gnc_ht: 1.11, variation_m: 0.7 },
    { mois: "Déc. 25", prix_go_ht: 1.37, prix_gnc_ht: 1.13, variation_m: 1.4 },
    { mois: "Janv. 26", prix_go_ht: 1.38, prix_gnc_ht: 1.14, variation_m: 0.7 },
    { mois: "Fév. 26", prix_go_ht: 1.36, prix_gnc_ht: 1.12, variation_m: -1.4 },
    { mois: "Mars 26", prix_go_ht: 1.39, prix_gnc_ht: 1.15, variation_m: 2.2 },
    { mois: "Avr. 26", prix_go_ht: 1.40, prix_gnc_ht: 1.16, variation_m: 0.7 },
  ],
};

/** Connecteurs : statut + lien vers échantillon `m2SourceIngestSamples` */
export const m2ConnectorsDemo = [
  { key: "as24", name: "AS24 (GO + péages)", protocol: "REST OAuth2", status: "pending", freq: "Mensuel", owner: "Raphaela", sampleRef: "AS24" },
  { key: "engie", name: "Engie (GNC / CSV)", protocol: "CSV mensuel", status: "in_progress", freq: "Mensuel", owner: "Raphaela", sampleRef: "Engie" },
  { key: "masternaut", name: "Masternaut / Michelin", protocol: "API + webhooks", status: "pending", freq: "Hebdo", owner: "IT", sampleRef: "Masternaut / Michelin" },
  { key: "factorial", name: "Factorial / Silae", protocol: "REST", status: "pending", freq: "Mensuel M-1", owner: "Mathieu (RH)", sampleRef: "Factorial / Silae" },
  { key: "solides", name: "Solides (Tacho)", protocol: "Export nocturne", status: "partial", freq: "7 nuits", owner: "IT", sampleRef: "Solides (Tacho)" },
  { key: "cnr", name: "CNR (indices)", protocol: "Flux mensuel", status: "pending", freq: "Mensuel", owner: "Raphaela", sampleRef: "CNR" },
  { key: "dirham", name: "Dirham (Ministère)", protocol: "CSV / page", status: "pending", freq: "Mensuel", owner: "Raphaela", sampleRef: "Dirham (Ministère)" },
  { key: "adv", name: "ADV (contrats)", protocol: "Base Parnass", status: "active", freq: "À la volée", owner: "Commerce", sampleRef: "ADV / Contrats" },
  { key: "exploitation", name: "Exploitation (prestations)", protocol: "Base Parnass", status: "active", freq: "Temps réel", owner: "Exploitation", sampleRef: "Exploitation (module)" },
  { key: "ptv", name: "PTV", protocol: "REST (éval.)", status: "pending", freq: "À la demande", owner: "IT", sampleRef: "PTV" },
  { key: "garage", name: "Factures garage", protocol: "CSV / saisie", status: "partial", freq: "Mensuel", owner: "Garage", sampleRef: "Factures garage" },
];

/** Historisation 12 mois — scope M2 (volume fictif de lignes ingérées / mois) */
export const m2HistorizationMonthlyVolume = [
  { month: "Mai 25", lignes: 1920000 }, { month: "Juin 25", lignes: 1980000 }, { month: "Juil. 25", lignes: 2050000 },
  { month: "Août 25", lignes: 2010000 }, { month: "Sept. 25", lignes: 2080000 }, { month: "Oct. 25", lignes: 2140000 },
  { month: "Nov. 25", lignes: 2100000 }, { month: "Déc. 25", lignes: 2180000 }, { month: "Janv. 26", lignes: 2210000 },
  { month: "Fév. 26", lignes: 2190000 }, { month: "Mars 26", lignes: 2240000 }, { month: "Avr. 26", lignes: 2280000 },
];

export const m2HistorizationPolicy = {
  retentionMonths: 12,
  label: "Fenêtre rolling 12 mois",
  sla: "Brut conservé J+1 après clôture M-1",
  principe: "Priorité aux lots complets ; exceptions traitées fichier par fichier.",
};

/** Impact € moyen mensuel par type de bloc planning (démo — Finance vs Conception) */
export const planningBlockEuroImpact = [
  { codeKey: "pied", emoji: "🔵", label: "Pied / Repositionnement", conception: "Code seul (pas de €)", financeEuro: 18400, financeLabel: "~18 k€ / mois coût km non refacturé client", detail: "Imputé tournée — charge GO + temps conducteur" },
  { codeKey: "opt", emoji: "🔴", label: "Optimisation", conception: "Code seul", financeEuro: 9600, financeLabel: "~9,6 k€ / mois temps non vendu (ordre de grandeur)", detail: "Trou planification — potentiel marge si ressaisi" },
  { codeKey: "hpl", emoji: "🟠", label: "HPL", conception: "Code seul", financeEuro: 14200, financeLabel: "~14 k€ / mois surcoût plage", detail: "Départs / arrivées HPL — pénalités et surtemps" },
];

/** Semi-remorques déclaratifs — phase test scope Phase 2 */
export const m4SemiRemorquesDemo = [
  { id: "SR-01", immat: "AA-883-GZ", mode: "Mutualisé", affectationPct: 78, tournees: 16, conflit: false, clients: "FedEx · DHL", loyerMensuel: 720 },
  { id: "SR-02", immat: "BB-102-XK", mode: "Dédié FedEx", affectationPct: 100, tournees: 22, conflit: false, clients: "FedEx", loyerMensuel: 700 },
  { id: "SR-03", immat: "CC-441-MN", mode: "Mutualisé", affectationPct: 52, tournees: 9, conflit: true, clients: "CEVA · Auchan", loyerMensuel: 705 },
  { id: "SR-04", immat: "DD-229-PL", mode: "Mutualisé", affectationPct: 65, tournees: 12, conflit: false, clients: "Chronopost · Leroy Merlin", loyerMensuel: 698 },
  { id: "SR-05", immat: "EE-550-QR", mode: "Dédié CEVA", affectationPct: 100, tournees: 11, conflit: false, clients: "CEVA", loyerMensuel: 715 },
];

/** P&L sous-traitance — 5e bloc modèle économique (données partagées M4/M5) */
export const m4SousTraitancePrestataires = [
  { id: "ST-01", prestataire: "Trans Express Sud", type: "Longue distance", tournees: 12, caFacture: 58000, coutAchat: 47000, marge: 11000, txMarge: 19.0, statut: "ok", clientRef: "FedEx" },
  { id: "ST-02", prestataire: "Logistique Rapide", type: "Messagerie locale", tournees: 8, caFacture: 29000, coutAchat: 31000, marge: -2000, txMarge: -6.9, statut: "deficit", clientRef: "Carrefour" },
  { id: "ST-03", prestataire: "Nord Transport", type: "Distribution", tournees: 15, caFacture: 72000, coutAchat: 59000, marge: 13000, txMarge: 18.1, statut: "ok", clientRef: "Auchan" },
  { id: "ST-04", prestataire: "EcoTrans GNC", type: "Longue distance GNC", tournees: 9, caFacture: 51000, coutAchat: 44000, marge: 7000, txMarge: 13.7, statut: "ok", clientRef: "Geodis" },
  { id: "ST-05", prestataire: "Sud Express Link", type: "National express", tournees: 6, caFacture: 38000, coutAchat: 32000, marge: 6000, txMarge: 15.8, statut: "ok", clientRef: "Chronopost" },
];

/** Matrice specs → écran démo (checklist produit) */
export const specDemoCoverageMatrix = [
  { id: "S1", specRef: "5 blocs modèle économique", ecranDemo: "/rentabilite/synthese", module: "Rentabilité", statut: "OK" },
  { id: "S2", specRef: "Priorisation flux + échantillons connecteurs", ecranDemo: "/m2", module: "M2", statut: "OK" },
  { id: "S3", specRef: "Historique 12 mois + pipeline", ecranDemo: "/m2", module: "M2", statut: "OK" },
  { id: "S4", specRef: "Semi-remorques déclaratifs", ecranDemo: "/rentabilite/semi-remorque", module: "Rentabilité", statut: "OK" },
  { id: "S5", specRef: "Planning + impact €", ecranDemo: "/rentabilite/synthese", module: "Rentabilité", statut: "OK" },
  { id: "S6", specRef: "Théorique / Réel", ecranDemo: "/m3/grille-couts", module: "M3", statut: "OK" },
  { id: "S7", specRef: "Sous-traitance", ecranDemo: "/rentabilite/sous-traitance", module: "Rentabilité", statut: "OK" },
  { id: "S8", specRef: "11 sources + ETL", ecranDemo: "/m2", module: "M2", statut: "OK" },
  { id: "S9", specRef: "Unités d’analyse (drill-down)", ecranDemo: "/rentabilite/par-tournee …", module: "Rentabilité", statut: "OK" },
];

/** Lignes comparatif Théorique vs Réel (démo) */
export const m5TheoriqueVsReelSpecRows = [
  { id: "def", critere: "Définition", theorique: "Performance attendue avant exécution", reel: "Performance observée après exécution", ecart: "—", responsable: "—" },
  { id: "ca", critere: "CA", theorique: "Somme prestations contrat (ADV)", reel: "Somme prestations réalisées (Exploitation) + indexation", ecart: "Δ volume / prix / indexation (M4)", responsable: "Commerce / Exploitation" },
  { id: "chg", critere: "Charges", theorique: "Grille 14 postes + hypothèses M3", reel: "Paie, carburant AS24/Engie, péages, télématique, garage", ecart: "Voir grille coûts & analyse écarts", responsable: "Raphaela / Mathieu" },
  { id: "idx", critere: "Indexation carburant", theorique: "Vue hors indexation possible (conception)", reel: "Intégrée obligatoirement au réel", ecart: "CNR → Dirham · FedEx par prestation", responsable: "Raphaela" },
  { id: "aff", critere: "Affichage vues", theorique: "Colonne « Théorique » + indicateurs conception", reel: "Colonne « Réel » + ligne d'écart + unités d'œuvre", ecart: "Module Rentabilité (onglets)", responsable: "Finance" },
];

export const m2Risks = {
  bloquants: [
    "Absence d'outil de gestion de parc centralisé — incohérences Avia Location / NAS Transport",
    "Décorrélation conception / exploitation — planning non rétro-alimenté → CA non associable sans import manuel",
  ],
  eleves: [
    "CSV Engie non normalisé — virgules sur quantités, immatriculations non standardisées",
    "Solides/Tacho irréguliers — synchro défaut 7 nuits, exports partiels fréquents (ex. 10/04/2026)",
    "Attribution casse conducteur — plusieurs conducteurs successifs sur un même véhicule",
    "Aspiration involontaire de véhicules tiers — filtre compte/flotte obligatoire",
  ],
  moderes: [
    "Saisie longue FedEx — indexation par prestation (173 lignes), import CSV nécessaire",
    "Pics de coûts entretien kilométrage — seuils révision majeurs (180 000 km)",
    "Complexité agrégation chauffeur 15 jours — alternances week-end (H2)",
    "Bascule CNR → Dirham — rupture série janvier 2026, contrats à migrer individuellement",
  ],
};

export const m2Governance = [
  { domaine: "CA théorique / contrats", source: "ADV", owner: "Laurent (Commerce)", frequence: "À la signature" },
  { domaine: "CA réel / prestations réalisées", source: "Module exploitation", owner: "Exploitation", frequence: "Quotidien" },
  { domaine: "Coûts RH réels", source: "Factorial / Silae", owner: "Mathieu (RH/Paie)", frequence: "Mensuel (M-1)" },
  { domaine: "Carburant réel", source: "AS24 / Engie", owner: "Raphaela", frequence: "Mensuel (M-1)" },
  { domaine: "Kilométrage / amplitude", source: "Masternaut / Solides", owner: "Exploitation + IT", frequence: "Hebdomadaire" },
  { domaine: "Indices carburant", source: "CNR / Dirham / AS24 / Engie", owner: "Raphaela", frequence: "Mensuel" },
  { domaine: "Grille de coûts (théorique)", source: "Parnass (saisie)", owner: "Raphaela + Finance", frequence: "Trimestriel (révision)" },
  { domaine: "Paramétrage indexation", source: "Parnass (saisie)", owner: "Raphaela + Commerce", frequence: "Au fil de l'eau" },
  { domaine: "Inventaire parc", source: "Parnass (Ludivine)", owner: "Ludivine", frequence: "Mensuel" },
];

// ─── M3 — COST GRID (dual-track) ──────────────────────────────────

export const m3CostGrid = [
  { type: "Fixe", poste: "Loyers tracteurs", methode: "Facture globale ÷ nb véhicules", source: "Avia Location", frequence: "Annuel + vérif. mensuelle", coutTheoMensuel: 48000, coutReelMensuel: 50200, dateEffet: "01/01/2026" },
  { type: "Fixe", poste: "Loyers semi-remorques", methode: "Forfait par semi (~700€/u)", source: "Facture locateur", frequence: "Annuel", coutTheoMensuel: 14000, coutReelMensuel: 14700, dateEffet: "01/01/2026" },
  { type: "Semi-var.", poste: "Entretien & maintenance", methode: "Forfait annuel ÷ 12", source: "Factures garage", frequence: "Mensuel", coutTheoMensuel: 22000, coutReelMensuel: 24800, dateEffet: "01/01/2026" },
  { type: "Variable", poste: "Pneumatiques", methode: "Coût/km × km théoriques", source: "Factures garage", frequence: "Mensuel", coutTheoMensuel: 8500, coutReelMensuel: 9100, dateEffet: "01/02/2026" },
  { type: "Fixe", poste: "Assurances", methode: "Prime annuelle ÷ 12", source: "Facture assureur", frequence: "Annuel", coutTheoMensuel: 12000, coutReelMensuel: 12000, dateEffet: "01/01/2026" },
  { type: "Variable", poste: "Carburant tracteur", methode: "Conso standard × km × prix €/L", source: "AS24 / Engie par immat.", frequence: "Mensuel (M-1)", coutTheoMensuel: 142000, coutReelMensuel: 157200, dateEffet: "01/04/2026" },
  { type: "Variable", poste: "Carburant frigo", methode: "2 L/h × heures fonctionnement", source: "Engie CSV", frequence: "Mensuel (M-1)", coutTheoMensuel: 18000, coutReelMensuel: 19400, dateEffet: "01/04/2026" },
  { type: "Variable", poste: "Péages", methode: "Tarif théorique / trajet (PTV)", source: "AS24 / portail péage", frequence: "Mensuel", coutTheoMensuel: 11800, coutReelMensuel: 12600, dateEffet: "01/01/2026" },
  { type: "Variable", poste: "Salaires & charges RH", methode: "Forfait jour (~165€/j) × jours travaillés", source: "Factorial / Silae", frequence: "Mensuel (M-1)", coutTheoMensuel: 174000, coutReelMensuel: 181600, dateEffet: "01/03/2026" },
  { type: "Fixe", poste: "Équipements GPS / ADR / tire-palettes", methode: "Loyer / abonnement mensuel", source: "Factures fournisseurs", frequence: "Annuel", coutTheoMensuel: 4200, coutReelMensuel: 4200, dateEffet: "01/01/2026" },
  { type: "Var. lissé", poste: "Casse / sinistres non assurés", methode: "% du CA (1,7%)", source: "Données Raphaela (5-10 M-1)", frequence: "Mensuel / Trim.", coutTheoMensuel: 24400, coutReelMensuel: 31800, dateEffet: "01/01/2026" },
  { type: "Exceptionnel", poste: "Immobilisation véhicules", methode: "N/A théorique", source: "Exploitation", frequence: "Mensuel", coutTheoMensuel: 0, coutReelMensuel: 6500, dateEffet: "—" },
  { type: "Variable", poste: "Sous-traitance (achat)", methode: "Prix d'achat unitaire", source: "Factures sous-traitants", frequence: "Au fil des prestations", coutTheoMensuel: 17500, coutReelMensuel: 17900, dateEffet: "01/01/2026" },
  { type: "Variable", poste: "Repositionnements / pieds", methode: "km × coût/km + temps × coût horaire", source: "Masternaut / Solides", frequence: "Mensuel", coutTheoMensuel: 28000, coutReelMensuel: 34800, dateEffet: "01/01/2026" },
];

export const m3TheoreticalInputs = {
  salaryDay: "≈ 165€/j SPL (charges + congés)",
  fuelGO: "28 L/100km (GO)",
  fuelGNC: "30,5 L/100km (GNC)",
  fridge: "2 L/h (semi frigo)",
  kmYear: "≈ 150 000 km/an (jusqu'à 250–300k en longues distances)",
  h1: "Diviseur jours ouvrés à arbitrer (21 ou 26) — base 22h/jour véhicule",
};

// ─── M4 — ANALYSIS UNITS ──────────────────────────────────────────

export const m4BlocksNomenclature = [
  { code: "🔵", label: "Pied / Repositionnement", detail: "Segment entre prestations — imputé à la tournée (pas au client)", color: "blue" },
  { code: "🔴", label: "Optimisation", detail: "Trou exploitable dans la planification — temps non utilisé", color: "red" },
  { code: "🟠", label: "HPL", detail: "Haut de plage matin/soir — départ ou arrivée en HPL", color: "orange" },
  { code: "🟢", label: "OK — Rentable", detail: "Marge brute ≥ seuil cible — tournée conforme", color: "green" },
  { code: "⚫", label: "Déficitaire", detail: "Marge brute négative — visible Finance uniquement", color: "black" },
];

export const m4VarianceAxes = [
  "Chauffeur",
  "Tracteur",
  "Semi-remorque",
  "Tournée",
  "Trajet / Prestation",
  "Client / Contrat",
];

// ─── M4 — TOURNÉES (30 items) ─────────────────────────────────────

export const m4Tournees = [
  { id: "T-0421", date: "28/04/2026", chauffeur: "Martin D.", tracteur: "AB-421-PL", client: "FedEx", ca: 8450, coutTheo: 6920, coutReel: 7480, marge: 970, delta: -560, km: 487, statut: "warn", ecart: { carburant: -280, rh: -180, peages: -60, casse: -40 } },
  { id: "T-0422", date: "28/04/2026", chauffeur: "Dupont A.", tracteur: "CD-183-PL", client: "Chronopost", ca: 5210, coutTheo: 4050, coutReel: 5680, marge: -470, delta: -1630, km: 312, statut: "deficit", ecart: { carburant: -820, rh: -490, peages: -180, casse: -140 } },
  { id: "T-0423", date: "28/04/2026", chauffeur: "Lemaire B.", tracteur: "EF-092-PL", client: "DHL Supply", ca: 12990, coutTheo: 9880, coutReel: 9420, marge: 3570, delta: 460, km: 724, statut: "ok", ecart: { carburant: 210, rh: 140, peages: 60, casse: 50 } },
  { id: "T-0424", date: "27/04/2026", chauffeur: "Morin C.", tracteur: "GH-774-PL", client: "Auchan", ca: 6780, coutTheo: 5200, coutReel: 5190, marge: 1590, delta: 10, km: 398, statut: "ok", ecart: { carburant: 30, rh: -20, peages: 0, casse: 0 } },
  { id: "T-0425", date: "27/04/2026", chauffeur: "Bernard P.", tracteur: "IJ-556-PL", client: "CEVA", ca: 9120, coutTheo: 7600, coutReel: 8950, marge: 170, delta: -1350, km: 531, statut: "warn", ecart: { carburant: -680, rh: -420, peages: -150, casse: -100 } },
  { id: "T-0426", date: "26/04/2026", chauffeur: "Fontaine S.", tracteur: "AB-421-PL", client: "FedEx", ca: 11340, coutTheo: 8700, coutReel: 8620, marge: 2720, delta: 80, km: 660, statut: "ok", ecart: { carburant: 40, rh: 30, peages: 10, casse: 0 } },
  { id: "T-0427", date: "26/04/2026", chauffeur: "Dupont A.", tracteur: "CD-183-PL", client: "Carrefour", ca: 4830, coutTheo: 4100, coutReel: 6020, marge: -1190, delta: -1920, km: 289, statut: "deficit", ecart: { carburant: -960, rh: -580, peages: -220, casse: -160 } },
  { id: "T-0428", date: "25/04/2026", chauffeur: "Garnier M.", tracteur: "KL-309-PL", client: "FedEx", ca: 14200, coutTheo: 10800, coutReel: 11200, marge: 3000, delta: -400, km: 812, statut: "ok", ecart: { carburant: -200, rh: -150, peages: -30, casse: -20 } },
  { id: "T-0429", date: "25/04/2026", chauffeur: "Leroy T.", tracteur: "MN-447-PL", client: "Auchan", ca: 7650, coutTheo: 5900, coutReel: 5780, marge: 1870, delta: 120, km: 441, statut: "ok", ecart: { carburant: 60, rh: 40, peages: 20, casse: 0 } },
  { id: "T-0430", date: "25/04/2026", chauffeur: "Petit F.", tracteur: "OP-812-PL", client: "DHL Supply", ca: 9880, coutTheo: 7700, coutReel: 8940, marge: 940, delta: -1240, km: 567, statut: "warn", ecart: { carburant: -620, rh: -380, peages: -140, casse: -100 } },
  { id: "T-0431", date: "24/04/2026", chauffeur: "Martin D.", tracteur: "AB-421-PL", client: "FedEx", ca: 10500, coutTheo: 8200, coutReel: 7980, marge: 2520, delta: 220, km: 598, statut: "ok", ecart: { carburant: 110, rh: 70, peages: 30, casse: 10 } },
  { id: "T-0432", date: "24/04/2026", chauffeur: "Blanc R.", tracteur: "QR-124-PL", client: "CEVA", ca: 6200, coutTheo: 4800, coutReel: 5100, marge: 1100, delta: -300, km: 365, statut: "ok", ecart: { carburant: -150, rh: -100, peages: -30, casse: -20 } },
  { id: "T-0433", date: "24/04/2026", chauffeur: "Lemaire B.", tracteur: "EF-092-PL", client: "Leroy Merlin", ca: 7800, coutTheo: 6200, coutReel: 7900, marge: -100, delta: -1700, km: 451, statut: "deficit", ecart: { carburant: -850, rh: -510, peages: -220, casse: -120 } },
  { id: "T-0434", date: "23/04/2026", chauffeur: "Morin C.", tracteur: "GH-774-PL", client: "DHL Supply", ca: 11200, coutTheo: 8700, coutReel: 8510, marge: 2690, delta: 190, km: 648, statut: "ok", ecart: { carburant: 95, rh: 60, peages: 25, casse: 10 } },
  { id: "T-0435", date: "23/04/2026", chauffeur: "Bernard P.", tracteur: "IJ-556-PL", client: "Chronopost", ca: 5500, coutTheo: 4200, coutReel: 4980, marge: 520, delta: -780, km: 327, statut: "warn", ecart: { carburant: -390, rh: -240, peages: -90, casse: -60 } },
  { id: "T-0436", date: "23/04/2026", chauffeur: "Garnier M.", tracteur: "KL-309-PL", client: "Schneider Electric", ca: 4200, coutTheo: 3400, coutReel: 3280, marge: 920, delta: 120, km: 248, statut: "ok", ecart: { carburant: 60, rh: 40, peages: 15, casse: 5 } },
  { id: "T-0437", date: "22/04/2026", chauffeur: "Fontaine S.", tracteur: "AB-421-PL", client: "FedEx", ca: 13100, coutTheo: 10200, coutReel: 9900, marge: 3200, delta: 300, km: 754, statut: "ok", ecart: { carburant: 150, rh: 100, peages: 35, casse: 15 } },
  { id: "T-0438", date: "22/04/2026", chauffeur: "Dupont A.", tracteur: "CD-183-PL", client: "Auchan", ca: 8100, coutTheo: 6300, coutReel: 7800, marge: 300, delta: -1500, km: 471, statut: "warn", ecart: { carburant: -750, rh: -450, peages: -180, casse: -120 } },
  { id: "T-0439", date: "22/04/2026", chauffeur: "Leroy T.", tracteur: "MN-447-PL", client: "DHL Supply", ca: 10300, coutTheo: 8000, coutReel: 7820, marge: 2480, delta: 180, km: 591, statut: "ok", ecart: { carburant: 90, rh: 60, peages: 20, casse: 10 } },
  { id: "T-0440", date: "21/04/2026", chauffeur: "Petit F.", tracteur: "OP-812-PL", client: "CEVA", ca: 7400, coutTheo: 5800, coutReel: 6900, marge: 500, delta: -1100, km: 428, statut: "warn", ecart: { carburant: -550, rh: -330, peages: -130, casse: -90 } },
  { id: "T-0441", date: "21/04/2026", chauffeur: "Martin D.", tracteur: "AB-421-PL", client: "Carrefour", ca: 3900, coutTheo: 3200, coutReel: 4600, marge: -700, delta: -1400, km: 241, statut: "deficit", ecart: { carburant: -700, rh: -420, peages: -180, casse: -100 } },
  { id: "T-0442", date: "21/04/2026", chauffeur: "Blanc R.", tracteur: "QR-124-PL", client: "FedEx", ca: 9600, coutTheo: 7500, coutReel: 7300, marge: 2300, delta: 200, km: 554, statut: "ok", ecart: { carburant: 100, rh: 70, peages: 20, casse: 10 } },
  { id: "T-0443", date: "20/04/2026", chauffeur: "Lemaire B.", tracteur: "EF-092-PL", client: "Auchan", ca: 8900, coutTheo: 7000, coutReel: 6800, marge: 2100, delta: 200, km: 512, statut: "ok", ecart: { carburant: 100, rh: 70, peages: 20, casse: 10 } },
  { id: "T-0444", date: "20/04/2026", chauffeur: "Garnier M.", tracteur: "KL-309-PL", client: "DHL Supply", ca: 12100, coutTheo: 9400, coutReel: 9200, marge: 2900, delta: 200, km: 697, statut: "ok", ecart: { carburant: 100, rh: 70, peages: 20, casse: 10 } },
  { id: "T-0445", date: "19/04/2026", chauffeur: "Bernard P.", tracteur: "IJ-556-PL", client: "Chronopost", ca: 6100, coutTheo: 4700, coutReel: 5600, marge: 500, delta: -900, km: 356, statut: "warn", ecart: { carburant: -450, rh: -270, peages: -110, casse: -70 } },
  { id: "T-0446", date: "19/04/2026", chauffeur: "Fontaine S.", tracteur: "AB-421-PL", client: "Leroy Merlin", ca: 9200, coutTheo: 7200, coutReel: 7050, marge: 2150, delta: 150, km: 530, statut: "ok", ecart: { carburant: 75, rh: 50, peages: 18, casse: 7 } },
  { id: "T-0447", date: "18/04/2026", chauffeur: "Morin C.", tracteur: "GH-774-PL", client: "FedEx", ca: 11500, coutTheo: 8900, coutReel: 8720, marge: 2780, delta: 180, km: 664, statut: "ok", ecart: { carburant: 90, rh: 60, peages: 20, casse: 10 } },
  { id: "T-0448", date: "18/04/2026", chauffeur: "Leroy T.", tracteur: "MN-447-PL", client: "CEVA", ca: 6800, coutTheo: 5300, coutReel: 6200, marge: 600, delta: -900, km: 395, statut: "warn", ecart: { carburant: -450, rh: -270, peages: -110, casse: -70 } },
  { id: "T-0449", date: "17/04/2026", chauffeur: "Petit F.", tracteur: "OP-812-PL", client: "Schneider Electric", ca: 5100, coutTheo: 4100, coutReel: 3980, marge: 1120, delta: 120, km: 298, statut: "ok", ecart: { carburant: 60, rh: 40, peages: 15, casse: 5 } },
  { id: "T-0450", date: "17/04/2026", chauffeur: "Dupont A.", tracteur: "CD-183-PL", client: "DHL Supply", ca: 8700, coutTheo: 6800, coutReel: 8100, marge: 600, delta: -1300, km: 504, statut: "warn", ecart: { carburant: -650, rh: -390, peages: -160, casse: -100 } },
];

const EMPTY_FINANCE_AGG = {
  ca: 0,
  marge: 0,
  coutTheo: 0,
  coutReel: 0,
  delta: 0,
  km: 0,
  ecartCarburant: 0,
  ecartRh: 0,
  ecartPeages: 0,
  ecartCasse: 0,
};

/** Agrégats tournées — réutilisable côté UI si `financeTourneeAggregate` n’est pas encore lié (HMR / import). */
export function computeFinanceTourneeAggregate(tournees) {
  const list = Array.isArray(tournees) ? tournees : [];
  if (list.length === 0) return { ...EMPTY_FINANCE_AGG };
  return list.reduce(
    (acc, t) => ({
      ca: acc.ca + t.ca,
      marge: acc.marge + t.marge,
      coutTheo: acc.coutTheo + t.coutTheo,
      coutReel: acc.coutReel + t.coutReel,
      delta: acc.delta + t.delta,
      km: acc.km + t.km,
      ecartCarburant: acc.ecartCarburant + t.ecart.carburant,
      ecartRh: acc.ecartRh + t.ecart.rh,
      ecartPeages: acc.ecartPeages + t.ecart.peages,
      ecartCasse: acc.ecartCasse + t.ecart.casse,
    }),
    { ...EMPTY_FINANCE_AGG },
  );
}

/** Agrégats 30 tournées — base cockpit finance (démo, pas de backend) */
export const financeTourneeAggregate = computeFinanceTourneeAggregate(m4Tournees);

/** Budget mensuel démo (k€) — écart vs réel affiché dans M5 */
export const financeBudgetKpis = {
  caMensuelBudgetK: 1480,
  margeBruteBudgetK: 178,
  margePctBudget: 12.0,
  coutTotalBudgetK: 1302,
};

/** Série mensuelle k€ — prévision vs réel (fixtures déterministes) */
export const financeMonthlySeries = [
  { month: "Jan", caReel: 1320, margeReel: 155, caPrev: 1280, margePrev: 148 },
  { month: "Fév", caReel: 1410, margeReel: 168, caPrev: 1360, margePrev: 162 },
  { month: "Mar", caReel: 1380, margeReel: 142, caPrev: 1400, margePrev: 158 },
  { month: "Avr", caReel: 1520, margeReel: 201, caPrev: 1450, margePrev: 172 },
  { month: "Mai", caReel: 1465, margeReel: 185, caPrev: 1480, margePrev: 178 },
];

/** Paramètres sensibilité démo — valeurs de base (GO €/L, km moyen, objectif marge %) */
export const financeSensitivityBase = {
  goEuroPerL: 1.42,
  kmMoyenTournee: 512,
  margeCiblePct: 12.0,
};

// ─── M4 — CLIENTS (10) ───────────────────────────────────────────

export const m4Clients = [
  { id: "CL-01", name: "FedEx", type: "National express", ca: 5800000, coutReel: 4948000, marge: 852000, txMarge: 14.7, tournees: 48, statut: "ok" },
  { id: "CL-02", name: "DHL Supply", type: "Contrat cadre", ca: 4600000, coutReel: 3956000, marge: 644000, txMarge: 14.0, tournees: 41, statut: "ok" },
  { id: "CL-03", name: "CEVA", type: "3PL", ca: 3900000, coutReel: 3705000, marge: 195000, txMarge: 5.0, tournees: 36, statut: "warn" },
  { id: "CL-04", name: "Auchan", type: "Distribution GMS", ca: 2900000, coutReel: 2494000, marge: 406000, txMarge: 14.0, tournees: 29, statut: "ok" },
  { id: "CL-05", name: "Chronopost", type: "Messagerie express", ca: 1800000, coutReel: 1926000, marge: -126000, txMarge: -7.0, tournees: 22, statut: "deficit" },
  { id: "CL-06", name: "Carrefour", type: "Distribution GMS", ca: 1200000, coutReel: 1236000, marge: -36000, txMarge: -3.0, tournees: 15, statut: "deficit" },
  { id: "CL-07", name: "Leroy Merlin", type: "Transport spécialisé", ca: 980000, coutReel: 833000, marge: 147000, txMarge: 15.0, tournees: 12, statut: "ok" },
  { id: "CL-08", name: "Schneider Electric", type: "Industrie B2B", ca: 720000, coutReel: 612000, marge: 108000, txMarge: 15.0, tournees: 9, statut: "ok" },
  { id: "CL-09", name: "Danone", type: "Agroalimentaire", ca: 640000, coutReel: 563200, marge: 76800, txMarge: 12.0, tournees: 8, statut: "ok" },
  { id: "CL-10", name: "Geodis", type: "Sous-traitance achetée", ca: 420000, coutReel: 382200, marge: 37800, txMarge: 9.0, tournees: 6, statut: "ok" },
];

// ─── M4 — CHAUFFEURS (10) ────────────────────────────────────────

export const m4Chauffeurs = [
  { id: "CH-01", nom: "Martin D.", tournees: 18, km: 8740, caGenere: 152000, coutReel: 131000, marge: 21000, txMarge: 13.8, ampMoyH: 10.2, statut: "ok" },
  { id: "CH-02", nom: "Dupont A.", tournees: 15, km: 7120, caGenere: 101000, coutReel: 118000, marge: -17000, txMarge: -16.8, ampMoyH: 11.4, statut: "deficit" },
  { id: "CH-03", nom: "Lemaire B.", tournees: 21, km: 10850, caGenere: 196000, coutReel: 164000, marge: 32000, txMarge: 16.3, ampMoyH: 9.8, statut: "ok" },
  { id: "CH-04", nom: "Morin C.", tournees: 12, km: 5840, caGenere: 88000, coutReel: 79000, marge: 9000, txMarge: 10.2, ampMoyH: 10.5, statut: "ok" },
  { id: "CH-05", nom: "Bernard P.", tournees: 16, km: 8190, caGenere: 127000, coutReel: 139000, marge: -12000, txMarge: -9.4, ampMoyH: 12.1, statut: "warn" },
  { id: "CH-06", nom: "Fontaine S.", tournees: 19, km: 9610, caGenere: 181000, coutReel: 154000, marge: 27000, txMarge: 14.9, ampMoyH: 10.0, statut: "ok" },
  { id: "CH-07", nom: "Garnier M.", tournees: 14, km: 6920, caGenere: 118000, coutReel: 99000, marge: 19000, txMarge: 16.1, ampMoyH: 9.6, statut: "ok" },
  { id: "CH-08", nom: "Leroy T.", tournees: 17, km: 8380, caGenere: 143000, coutReel: 122000, marge: 21000, txMarge: 14.7, ampMoyH: 10.3, statut: "ok" },
  { id: "CH-09", nom: "Blanc R.", tournees: 13, km: 6540, caGenere: 109000, coutReel: 93000, marge: 16000, txMarge: 14.7, ampMoyH: 10.8, statut: "ok" },
  { id: "CH-10", nom: "Petit F.", tournees: 11, km: 5490, caGenere: 84000, coutReel: 76000, marge: 8000, txMarge: 9.5, ampMoyH: 11.2, statut: "ok" },
];

// ─── M4 — VÉHICULES (8) ──────────────────────────────────────────

export const m4Vehicules = [
  { id: "V-01", immat: "AB-421-PL", type: "Tracteur GO", annee: 2021, km: 198400, txUtilisation: 76, marge: 52000, conso: 29.1, alert: true, loyer: 1800 },
  { id: "V-02", immat: "CD-183-PL", type: "Tracteur GO", annee: 2020, km: 142300, txUtilisation: 68, marge: -8000, conso: 31.4, alert: false, loyer: 1750 },
  { id: "V-03", immat: "EF-092-PL", type: "Tracteur GNC", annee: 2022, km: 167800, txUtilisation: 82, marge: 71000, conso: 30.2, alert: false, loyer: 1950 },
  { id: "V-04", immat: "GH-774-PL", type: "Tracteur GNC", annee: 2023, km: 89200, txUtilisation: 59, marge: 18000, conso: 29.8, alert: false, loyer: 2100 },
  { id: "V-05", immat: "IJ-556-PL", type: "Tracteur GO", annee: 2019, km: 221600, txUtilisation: 71, marge: 4000, conso: 32.1, alert: true, loyer: 1600 },
  { id: "V-06", immat: "KL-309-PL", type: "Tracteur GO", annee: 2022, km: 134700, txUtilisation: 74, marge: 39000, conso: 28.7, alert: false, loyer: 1900 },
  { id: "V-07", immat: "MN-447-PL", type: "Tracteur GNC", annee: 2023, km: 98500, txUtilisation: 77, marge: 44000, conso: 30.8, alert: false, loyer: 2050 },
  { id: "V-08", immat: "OP-812-PL", type: "Tracteur GO", annee: 2021, km: 176300, txUtilisation: 65, marge: 12000, conso: 30.5, alert: false, loyer: 1850 },
];

// ─── M5 — KPIs ───────────────────────────────────────────────────

export const m5KPIs = [
  { kpi: "CA réalisé vs prévu", unit: "€ + %", cadence: "Mensuel / Hebdo", value: "17,2 M€ (97%)", color: "ok" },
  { kpi: "Marge / % rentabilité", unit: "€ + %", cadence: "Mensuel", value: "1,94 M€ (11,3%)", color: "ok" },
  { kpi: "Kilométrage théorique et réel", unit: "km", cadence: "Quotidien", value: "42 180 / 44 950", color: "warn" },
  { kpi: "Taux d'utilisation véhicule", unit: "% (base 22h/j)", cadence: "Quotidien / Hebdo", value: "72%", color: "ok" },
  { kpi: "Amplitude & heures de service", unit: "h", cadence: "Quotidien", value: "10,3 h", color: "ok" },
  { kpi: "Conso carburant réelle vs théorique", unit: "L/100km + €", cadence: "Mensuel (M-1)", value: "29,7 vs 28,0", color: "warn" },
  { kpi: "Impact indexation carburant", unit: "€ + %", cadence: "Mensuel", value: "+385 k€", color: "ok" },
  { kpi: "Coûts de péage", unit: "€", cadence: "Mensuel", value: "142 k€", color: "ok" },
  { kpi: "Coûts casse & immobilisation", unit: "€", cadence: "Mensuel", value: "38 k€", color: "warn" },
  { kpi: "Delta théorique vs réel", unit: "€ + %", cadence: "Mensuel", value: "-52 k€", color: "warn" },
  { kpi: "Taux modification S-1 (planning)", unit: "%", cadence: "Hebdomadaire", value: "14%", color: "ok" },
];

export const m5Alerts = [
  { type: "Tournée déficitaire", detail: "Marge brute négative — T-0422, T-0427, T-0433, T-0441", severity: "high" },
  { type: "Multi-semi-remorque", detail: "Une tournée utilise plusieurs semi simultanément", severity: "medium" },
  { type: "Dépassement km révision", detail: "AB-421-PL (198 400 km) et IJ-556-PL (221 600 km) — seuil 180 000 km", severity: "high" },
  { type: "Surconsommation carburant", detail: "GO : 29,7 L/100 vs théorique 28,0 L/100 (+6,1%)", severity: "medium" },
  { type: "Client sous-performant", detail: "Chronopost −7% et Carrefour −3% — marge négative", severity: "high" },
  { type: "Exception ETL non résolue", detail: "Engie CSV — virgule sur quantité, AS24 plein dupliqué", severity: "low" },
];

export const m5Planning = {
  horizon: "S → S+4",
  review: "Revue qualité S-1 (taux modification planification)",
  rights: "La Conception ne voit que le code couleur (sans chiffres)",
};

// ─── TRANSVERSE — H1–H11 HYPOTHÈSES ──────────────────────────────

// (Pages transverse supprimées : pas de datasets transverse)

// ─── TRANSVERSE — JALONS (10) ─────────────────────────────────────

// (Pages transverse supprimées : pas de jalons roadmap)

// ─── TRANSVERSE — DROITS D'ACCÈS ─────────────────────────────────

// (Pages transverse supprimées : pas de matrice droits d'accès)

// ─── TRANSVERSE — GLOSSAIRE ───────────────────────────────────────

// (Pages transverse supprimées : pas de glossaire)
