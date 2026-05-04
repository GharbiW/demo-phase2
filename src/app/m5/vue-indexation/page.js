"use client";

"use client";

import { PageShell, SectionCard, KpiGrid, KpiTile } from "@/components/ui/PageShell";
import { Table, Thead, Tbody, Tr, Th, Td } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { useDemoStore } from "@/stores/demoStore";

const HISTORY = [
  { mois: "Déc 2025", cNR_GO: "168,42", dirham: "1,8410", impactK: "+312 k€", statut: "ok" },
  { mois: "Jan 2026", cNR_GO: "170,85", dirham: "1,8621", impactK: "+341 k€", statut: "ok" },
  { mois: "Fév 2026", cNR_GO: "172,14", dirham: "1,8720", impactK: "+358 k€", statut: "ok" },
  { mois: "Mar 2026", cNR_GO: "173,21", dirham: "1,8814", impactK: "+371 k€", statut: "ok" },
  { mois: "Avr 2026", cNR_GO: "174,88", dirham: "1,8930", impactK: null, statut: "current" },
];

export default function VueIndexationPage() {
  const { state } = useDemoStore();
  const impact = state.indexation.indexationImpactKEUR;

  return (
    <PageShell
      moduleLabel="M5 — Dashboard Rentabilité"
      title="Vue indexation carburant"
      description="Suivi mensuel des indices CNR / Dirham et leur impact sur le CA théorique."
      bare
      noPad
    >
      <div className="px-6 pt-6">
        <KpiGrid cols={4}>
          <KpiTile label="Indice CNR GO (M-1)" value="174,88 c/L" sub="Avril 2026" trend="up" />
          <KpiTile label="Dirham TTC (M-1)" value="1,8930 €/kg" sub="Avril 2026" />
          <KpiTile label="Impact indexation" value={`+${impact} k€`} sub={`Contrat : ${state.selectedContract}`} trend="up" />
          <KpiTile label="Variation YTD" value="+3,8%" sub="vs Déc 2025" trend="up" />
        </KpiGrid>
      </div>

      <div className="px-6 py-5">
        <SectionCard title="Historique indices et impacts" description="Évolution mensuelle des indices de référence et impact calculé sur le CA" noPad>
          <Table>
            <Thead>
              <Tr>
                <Th>Mois</Th>
                <Th right>CNR GO PRO (c/L)</Th>
                <Th right>Dirham TTC (€/kg)</Th>
                <Th right>Impact calcul (k€)</Th>
                <Th>Statut</Th>
              </Tr>
            </Thead>
            <Tbody>
              {HISTORY.map((r) => (
                <Tr key={r.mois} highlighted={r.statut === "current"}>
                  <Td className="font-medium">
                    {r.mois}
                    {r.statut === "current" && <Badge variant="blue" size="sm" className="ml-2">Courant</Badge>}
                  </Td>
                  <Td right className="tabular-nums">{r.cNR_GO}</Td>
                  <Td right className="tabular-nums">{r.dirham}</Td>
                  <Td right>
                    {r.statut === "current"
                      ? <span className="text-blue-600 font-medium">+{impact} k€</span>
                      : <span className="text-emerald-700 font-medium">{r.impactK}</span>
                    }
                  </Td>
                  <Td>
                    <Badge variant={r.statut === "current" ? "blue" : "emerald"} size="sm">
                      {r.statut === "current" ? "En cours" : "Validé"}
                    </Badge>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </SectionCard>
      </div>
    </PageShell>
  );
}
