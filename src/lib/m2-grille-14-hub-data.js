/**
 * M2 — Hub unique « grille 14 postes » : métadonnées par onglet + lignes détail (démo).
 * Aligné sur `m3CostGrid` (ordre identique).
 */
import {
  m3CostGrid,
  m2SourceRecords,
  m4SemiRemorquesDemo,
  m4SousTraitancePrestataires,
} from "./demo-data";

const SLUGS = [
  "loyers-tracteurs",
  "loyers-semi",
  "entretien-maintenance",
  "pneumatiques",
  "assurances",
  "carburant-tracteur",
  "carburant-frigo",
  "peages",
  "salaires-rh",
  "equipements-gps",
  "casse-sinistres",
  "immobilisation",
  "sous-traitance",
  "repositionnements",
];

const TAB_SHORT = [
  "Loyers tract.",
  "Loyers semi",
  "Entretien",
  "Pneus",
  "Assurances",
  "GO tracteur",
  "Frigo",
  "Péages",
  "Salaires",
  "GPS / ADR",
  "Casse",
  "Immo.",
  "Sous-trait.",
  "Pieds",
];

function garageRows() {
  return m2SourceRecords["Factures garage"] ?? [];
}

/** @returns {{ provenanceLabel: string, provenanceCanal: 'factorial' | 'parnass_p1', provenanceDetail: string }} */
function provenanceForIndex(i) {
  if (i === 8) {
    return {
      provenanceLabel: "Factorial / Silae",
      provenanceCanal: "factorial",
      provenanceDetail: "Données paie & bulletins — connecteur SaaS (hors backoffice Parnass).",
    };
  }
  const g = m3CostGrid[i];
  return {
    provenanceLabel: "Plateforme Parnass · Phase 1",
    provenanceCanal: "parnass_p1",
    provenanceDetail: `API / modules P1 — alimentation prévue pour « ${g.poste} » (réf. grille : ${g.source}).`,
  };
}

function rowsForPosteIndex(i) {
  const garage = garageRows();
  const as24 = m2SourceRecords.AS24 ?? [];
  const engie = m2SourceRecords.Engie ?? [];
  const masternaut = m2SourceRecords["Masternaut / Michelin"] ?? [];
  const solides = m2SourceRecords["Solides (Tacho)"] ?? [];
  const exploitation = m2SourceRecords["Exploitation (module)"] ?? [];
  const ptv = m2SourceRecords.PTV ?? [];

  switch (i) {
    case 0:
      return [
        { immat: "AB-421-PL", loueur: "Avia Location", loyer_mensuel: 1180, fin_contrat: "31/12/2027", agence: "Lille" },
        { immat: "IJ-556-PL", loueur: "Avia Location", loyer_mensuel: 1210, fin_contrat: "30/06/2026", agence: "Reims" },
        { immat: "EF-092-PL", loueur: "NAS Transport", loyer_mensuel: 1095, fin_contrat: "15/03/2028", agence: "Lyon" },
        { immat: "GH-774-PL", loueur: "Avia Location", loyer_mensuel: 1195, fin_contrat: "28/02/2027", agence: "Roissy" },
        { immat: "MN-447-PL", loueur: "Avia Location", loyer_mensuel: 1175, fin_contrat: "10/09/2026", agence: "Metz" },
      ];
    case 1:
      return m4SemiRemorquesDemo.map((s) => ({
        semi_id: s.id,
        immat: s.immat,
        loyer_mensuel: s.loyerMensuel,
        mode: s.mode,
        affectation_pct: s.affectationPct,
        clients: s.clients,
      }));
    case 2:
      return garage.filter((r) => !String(r.type_intervention).toLowerCase().includes("pneu"));
    case 3:
      return garage.filter((r) => String(r.type_intervention).toLowerCase().includes("pneu"));
    case 4:
      return [
        { police: "POL-2026-TR-01", assureur: "Groupama", prime_mensuelle: 4200, franchise: "1500 €", flotte: "Tracteurs (42)" },
        { police: "POL-2026-SR-02", assureur: "MACIF Pro", prime_mensuelle: 3800, franchise: "2000 €", flotte: "Semi (18)" },
        { police: "POL-2026-RC-03", assureur: "AXA", prime_mensuelle: 4000, franchise: "1000 €", flotte: "RC + marchandises" },
      ];
    case 5:
      return as24.filter((r) => r.categorie !== "Péage");
    case 6:
      return engie;
    case 7: {
      const peagesAs24 = as24.filter((r) => r.categorie === "Péage");
      const peagesPtv = ptv.map((p, idx) => ({
        date: "—",
        immat: `CORRIDOR-${idx + 1}`,
        chauffeur: "—",
        station: `${p.origine} → ${p.destination}`,
        litres: null,
        prix_litre: null,
        total_ttc: p.peage_theo,
        type_energie: "—",
        categorie: "Péage théo PTV",
      }));
      return [...peagesAs24, ...peagesPtv];
    }
    case 8:
      return m2SourceRecords["Factorial / Silae"] ?? [];
    case 9:
      return [
        { immat: "AB-421-PL", fournisseur: "Masternaut", poste: "GPS + éco-conduite", abonnement_mensuel: 42, statut: "Actif" },
        { immat: "IJ-556-PL", fournisseur: "Masternaut", poste: "GPS + éco-conduite", abonnement_mensuel: 42, statut: "Actif" },
        { immat: "EF-092-PL", fournisseur: "WinCPL", poste: "Tire-palettes", loyer_mensuel: 28, statut: "Actif" },
        { immat: "GH-774-PL", fournisseur: "Masternaut", poste: "GPS + ADR", abonnement_mensuel: 58, statut: "Actif" },
      ];
    case 10:
      return [
        { date: "2026-04-12", vehicule: "IJ-556-PL", nature: "Sinistre tiers", montant_ht: 4200, assureur: "Groupama", statut: "En expertise" },
        { date: "2026-04-03", vehicule: "CM-902-ZZ", nature: "Bris de glace", montant_ht: 890, assureur: "MACIF", statut: "Clos" },
        { date: "2026-03-28", vehicule: "AB-421-PL", nature: "Casse marchandise", montant_ht: 2100, assureur: "—", statut: "Non couvert" },
      ];
    case 11:
      return exploitation.slice(0, 5).map((e, idx) => ({
        ...e,
        motif_immobilisation: "Contrôle technique lourd",
        couts_directs: idx % 2 === 0 ? 2100 : 1450,
      }));
    case 12:
      return m4SousTraitancePrestataires.map((st) => ({
        id: st.id,
        prestataire: st.prestataire,
        type: st.type,
        ca_facture: st.caFacture,
        cout_achat: st.coutAchat,
        marge: st.marge,
        tx_marge_pct: st.txMarge,
        statut: st.statut,
      }));
    case 13:
      return masternaut.map((m, idx) => {
        const s = solides[idx % solides.length];
        return {
          date: m.date,
          immat: m.immat,
          chauffeur: m.chauffeur,
          km_vide: m.km_vide,
          km_reel: m.km_reel,
          heures_conduite: s?.heures_conduite ?? "—",
          poste_impute: "Pied / repositionnement",
        };
      });
    default:
      return [];
  }
}

/**
 * Onglets grille 14 + lignes tableau pour la page M2 unique.
 */
export function getM2Grille14HubTabs() {
  return m3CostGrid.map((grid, i) => {
    const prov = provenanceForIndex(i);
    const rows = rowsForPosteIndex(i);
    return {
      slug: SLUGS[i],
      tabShort: TAB_SHORT[i],
      grid,
      ...prov,
      rows,
    };
  });
}
