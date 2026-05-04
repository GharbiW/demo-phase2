import { PageShell, SectionCard, KpiGrid, KpiTile } from "@/components/ui/PageShell";
import { Table, Thead, Tbody, Tr, Th, Td } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";

const STREAMS = [
  { source: "AS24", poste: "Carburant GO + péages", format: "API REST", freq: "Mensuel (M-1)", statut: "À connecter", volume: "~1 200 lignes/mois" },
  { source: "Engie CSV", poste: "Carburant GNC/GNL/BIO", format: "CSV normalisé", freq: "Mensuel (M-1)", statut: "CSV à normaliser", volume: "~340 lignes/mois" },
  { source: "Factorial / Silae", poste: "Salaires & charges RH", format: "API REST", freq: "Mensuel (M-1)", statut: "À connecter", volume: "~85 lignes/mois" },
  { source: "Factures garage", poste: "Entretien / casse / pneus", format: "PDF / CSV manuel", freq: "Mensuel", statut: "Manuel", volume: "~40 factures/mois" },
  { source: "Masternaut", poste: "Km réels + reposit.", format: "API Webhook", freq: "Hebdomadaire", statut: "À connecter", volume: "~8 000 lignes/semaine" },
];

const statusV = { "À connecter": "amber", "CSV à normaliser": "amber", "Manuel": "neutral", Actif: "emerald" };

export default function IngestionCoutsReelsPage() {
  return (
    <PageShell
      moduleLabel="M3 — Moteur de coûts"
      title="Ingestion coûts réels"
      description="Flux d'alimentation des coûts réels depuis les sources opérationnelles vers le moteur."
      bare
      noPad
    >
      <div className="px-6 pt-6">
        <KpiGrid cols={3}>
          <KpiTile label="Flux de données" value={STREAMS.length} sub="Postes de coûts réels" />
          <KpiTile label="À configurer" value={STREAMS.filter((s) => s.statut !== "Actif").length} accent sub="Avant production" />
          <KpiTile label="Volume mensuel estimé" value="~1 700" sub="Lignes par mois" />
        </KpiGrid>
      </div>

      <div className="px-6 py-5">
        <SectionCard title="Flux d'ingestion" noPad>
          <Table>
            <Thead>
              <Tr>
                <Th>Source</Th>
                <Th>Poste de coût</Th>
                <Th>Format</Th>
                <Th>Fréquence</Th>
                <Th>Volume</Th>
                <Th>Statut</Th>
              </Tr>
            </Thead>
            <Tbody>
              {STREAMS.map((s) => (
                <Tr key={s.source}>
                  <Td className="font-medium">{s.source}</Td>
                  <Td>{s.poste}</Td>
                  <Td muted>{s.format}</Td>
                  <Td muted>{s.freq}</Td>
                  <Td muted className="text-xs">{s.volume}</Td>
                  <Td><Badge variant={statusV[s.statut] ?? "neutral"} size="sm">{s.statut}</Badge></Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </SectionCard>
      </div>
    </PageShell>
  );
}
