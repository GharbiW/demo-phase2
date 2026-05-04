"use client";

import { useState } from "react";
import { FileText, Plus, Download, Search, ChevronRight, Building2, CheckCircle2, Clock } from "lucide-react";
import { PageShell } from "@/components/ui/PageShell";
import { Toolbar } from "@/components/ui/Toolbar";
import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { Table, Thead, Tbody, Tr, Th, Td } from "@/components/ui/Table";
import { DrilldownDrawer, DrawerSection, DrawerRow } from "@/components/ui/DrilldownDrawer";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";
import { useDemoStore } from "@/stores/demoStore";
import { m1Contracts } from "@/lib/demo-data";

const ALL_CONTRACTS = [
  { id: "C-001", client: "FedEx", type: "National express", statut: "Actif", dateDebut: "01/01/2024", dateFin: "31/12/2026", caAnnuel: "1 250 000 €", indexation: "CNR GO PRO M-1", complexite: "Élevée", particularite: "Indexation par prestation — nombreuses lignes (import CSV prévu)" },
  { id: "C-002", client: "Auchan", type: "Distribution GMS", statut: "Actif", dateDebut: "01/03/2023", dateFin: "28/02/2026", caAnnuel: "680 000 €", indexation: "PMM M-1 moins TCPE", complexite: "Modérée", particularite: "Formule M-1 moins TCPE — à confirmer" },
  { id: "C-003", client: "CEVA", type: "Logistique third-party", statut: "Actif", dateDebut: "01/06/2024", dateFin: "31/05/2027", caAnnuel: "940 000 €", indexation: "À définir", complexite: "Élevée", particularite: "Formule à définir — négociation en cours" },
  { id: "C-004", client: "Chronopost", type: "Messagerie express", statut: "Actif", dateDebut: "01/01/2025", dateFin: "31/12/2025", caAnnuel: "420 000 €", indexation: "CNR GO PRO", complexite: "Modérée", particularite: "Traitement standard avec cas spécifiques documentés" },
  { id: "C-005", client: "Carrefour", type: "Distribution GMS", statut: "En révision", dateDebut: "01/02/2022", dateFin: "31/01/2025", caAnnuel: "310 000 €", indexation: "CNR GNC M-1", complexite: "Faible", particularite: "Renouvellement en négociation" },
  { id: "C-006", client: "DHL Supply", type: "Contrat cadre", statut: "Actif", dateDebut: "15/09/2024", dateFin: "14/09/2027", caAnnuel: "1 080 000 €", indexation: "Dirham + CNR GO", complexite: "Élevée", particularite: "Multi-formule avec péages inclus" },
];

const complexiteVariant = { Élevée: "red", Modérée: "amber", Faible: "emerald" };
const statutVariant = { Actif: "emerald", "En révision": "amber" };

export default function AdvContratsPage() {
  const { state, actions } = useDemoStore();
  const { showToast } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tous");
  const [selectedContract, setSelectedContract] = useState(null);

  const filtered = ALL_CONTRACTS.filter((c) => {
    const matchSearch = search === "" || c.client.toLowerCase().includes(search.toLowerCase()) || c.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "Tous" || c.statut === statusFilter;
    return matchSearch && matchStatus;
  });

  function handleRowClick(contract) {
    setSelectedContract(contract);
  }

  function handleSetActive(contract) {
    actions.setSelectedContract(contract.client);
    showToast(`Client actif défini : ${contract.client}`, "success");
    setSelectedContract(null);
  }

  return (
    <PageShell
      moduleLabel="M1 — Commercial & Tarification"
      title="Contrats ADV"
      description="Référentiel des contrats clients : formules tarifaires, règles d'indexation, CA théorique."
      actions={
        <>
          <Button variant="ghost" size="sm" icon={<Download className="w-4 h-4" />}>Export</Button>
          <Button variant="primary" size="sm" icon={<Plus className="w-4 h-4" />}>Nouveau contrat</Button>
        </>
      }
      bare
      noPad
    >
      <div className="rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
        <Toolbar
          left={
            <>
              <SearchInput
                placeholder="Rechercher un client, un contrat…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-72"
              />
              <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="Tous">Tous les statuts</option>
                <option value="Actif">Actif</option>
                <option value="En révision">En révision</option>
              </Select>
            </>
          }
          right={
            <span className="text-xs text-neutral-400">
              {filtered.length} contrat{filtered.length > 1 ? "s" : ""}
            </span>
          }
        />

        {filtered.length === 0 ? (
          <EmptyState
            icon={<FileText className="w-5 h-5" />}
            title="Aucun contrat trouvé"
            description="Modifiez vos filtres pour afficher des résultats."
          />
        ) : (
          <Table>
            <Thead>
              <Tr>
                <Th>Réf.</Th>
                <Th>Client</Th>
                <Th>Type</Th>
                <Th>Statut</Th>
                <Th>CA annuel</Th>
                <Th>Base indexation</Th>
                <Th>Complexité</Th>
                <Th>Fin contrat</Th>
                <Th />
              </Tr>
            </Thead>
            <Tbody>
              {filtered.map((c) => (
                <Tr
                  key={c.id}
                  clickable
                  onClick={() => handleRowClick(c)}
                  highlighted={state.selectedContract === c.client}
                >
                  <Td muted>{c.id}</Td>
                  <Td>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-neutral-900 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                        {c.client[0]}
                      </div>
                      <span className="font-medium">{c.client}</span>
                      {state.selectedContract === c.client && (
                        <Badge variant="blue" size="sm">Actif</Badge>
                      )}
                    </div>
                  </Td>
                  <Td muted>{c.type}</Td>
                  <Td>
                    <Badge variant={statutVariant[c.statut] ?? "neutral"}>{c.statut}</Badge>
                  </Td>
                  <Td className="font-medium tabular-nums">{c.caAnnuel}</Td>
                  <Td muted>{c.indexation}</Td>
                  <Td>
                    <Badge variant={complexiteVariant[c.complexite] ?? "neutral"}>{c.complexite}</Badge>
                  </Td>
                  <Td muted>{c.dateFin}</Td>
                  <Td>
                    <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-neutral-500 transition-colors" />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}

        <div className="px-5 py-3 border-t border-neutral-100 flex items-center justify-between">
          <span className="text-xs text-neutral-400">
            Client actif démo : <strong className="text-neutral-700">{state.selectedContract}</strong>
          </span>
          <span className="text-xs text-neutral-400">Cliquez une ligne pour le détail</span>
        </div>
      </div>

      {/* Contract detail drawer */}
      <DrilldownDrawer
        open={!!selectedContract}
        title={selectedContract?.client ?? ""}
        subtitle={`${selectedContract?.id} · ${selectedContract?.type}`}
        onClose={() => setSelectedContract(null)}
        footer={
          <>
            <Button
              variant="primary"
              size="sm"
              icon={<CheckCircle2 className="w-4 h-4" />}
              onClick={() => handleSetActive(selectedContract)}
            >
              Définir comme client actif
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setSelectedContract(null)}>
              Fermer
            </Button>
          </>
        }
      >
        {selectedContract && (
          <>
            <DrawerSection title="Informations contrat">
              <DrawerRow label="Référence" value={selectedContract.id} />
              <DrawerRow label="Client" value={selectedContract.client} />
              <DrawerRow label="Type" value={selectedContract.type} />
              <DrawerRow label="Statut" value={selectedContract.statut} />
              <DrawerRow label="Date début" value={selectedContract.dateDebut} />
              <DrawerRow label="Date fin" value={selectedContract.dateFin} />
            </DrawerSection>

            <DrawerSection title="Tarification">
              <DrawerRow label="CA annuel" value={selectedContract.caAnnuel} highlight />
              <DrawerRow label="Base indexation" value={selectedContract.indexation} />
              <DrawerRow label="Complexité" value={selectedContract.complexite} />
            </DrawerSection>

            <DrawerSection title="Particularités">
              <p className="text-sm text-neutral-700 bg-neutral-50 rounded-lg p-3 border border-neutral-200">
                {selectedContract.particularite}
              </p>
            </DrawerSection>

            <DrawerSection title="Liens rapides">
              <div className="flex flex-col gap-1">
                <a href="/m1/indexation-carburant" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                  <ChevronRight className="w-3.5 h-3.5" />
                  Indexation carburant
                </a>
                <a href="/m1/ca-theorique" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                  <ChevronRight className="w-3.5 h-3.5" />
                  CA théorique vs réel
                </a>
              </div>
            </DrawerSection>
          </>
        )}
      </DrilldownDrawer>
    </PageShell>
  );
}
