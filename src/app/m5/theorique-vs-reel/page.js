"use client";

import { PageShell, SectionCard, KpiGrid, KpiTile } from "@/components/ui/PageShell";
import { Select } from "@/components/ui/Select";
import { Table, Thead, Tbody, Tr, Th, Td } from "@/components/ui/Table";
import { useDemoStore } from "@/stores/demoStore";
import { cockpitPeriodOptions } from "@/lib/cockpit-mock-data";
import { m5TheoriqueVsReelSpecRows, m4Tournees, computeFinanceTourneeAggregate } from "@/lib/demo-data";

function fmtKeurFromNumber(keur) {
  const sign = keur >= 0 ? "+" : "";
  return `${sign}${keur.toFixed(0)} k€`;
}

export default function TheoriqueVsReelPage() {
  const { state, kpis, actions } = useDemoStore();

  const margeKPI = kpis.find((k) => k.kpi.toLowerCase().includes("marge"));
  const deltaKPI = kpis.find((k) => k.kpi.toLowerCase().includes("delta théorique"));
  const indexKPI = kpis.find((k) => k.kpi.toLowerCase().includes("indexation"));

  const agg = computeFinanceTourneeAggregate(m4Tournees);
  const margeTheoK = (agg.ca - agg.coutTheo) / 1000;
  const ecartSynthK = (agg.coutReel - agg.coutTheo) / 1000;

  const financeRows = [
    { critere: "CA (agrégat tournées démo)", theorique: `${(agg.ca / 1000).toFixed(0)} k€`, reel: `${(agg.ca / 1000).toFixed(0)} k€`, ecart: "Volume / mix (M1)", responsable: "Commerce" },
    { critere: "Coûts totaux", theorique: `${(agg.coutTheo / 1000).toFixed(0)} k€`, reel: `${(agg.coutReel / 1000).toFixed(0)} k€`, ecart: fmtKeurFromNumber(ecartSynthK), responsable: "Raphaela / M3" },
    { critere: "Marge brute", theorique: `${margeTheoK.toFixed(0)} k€ (CA − coût théo)`, reel: margeKPI?.value ?? `${(agg.marge / 1000).toFixed(0)} k€`, ecart: deltaKPI?.value ?? fmtKeurFromNumber((agg.marge / 1000) - margeTheoK), responsable: "Finance" },
    { critere: "Indexation carburant", theorique: "Hors scope vue théorique partielle", reel: indexKPI?.value ?? "+385 k€", ecart: "Contrat sélectionné M1", responsable: "Raphaela" },
    { critere: "Variance carburant (poste)", theorique: "—", reel: `${(agg.ecartCarburant / 1000).toFixed(1)} k€`, ecart: "Σ écarts M4", responsable: "Exploitation" },
  ];

  return (
    <PageShell
      moduleLabel="M5 — Dashboard Rentabilité"
      title="Théorique vs Réel"
      description="Comparatif théorique / réel (CA, charges, indexation, vues) et synthèse € sur agrégat tournées démo."
      bare
      noPad
    >
      <div className="px-6 pt-6">
        <div className="flex items-center gap-3 mb-5">
          <Select value={state.period} onChange={(e) => actions.setPeriod(e.target.value)}>
            {cockpitPeriodOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </Select>
        </div>

        <KpiGrid cols={3}>
          <KpiTile label="Delta théorique vs réel" value={deltaKPI?.value ?? "—"} sub="Propagé depuis M3" accent={deltaKPI?.color === "warn"} />
          <KpiTile label="Marge réelle" value={margeKPI?.value ?? "—"} sub="Impacté par M3 + M1" trend="up" />
          <KpiTile label="Impact indexation" value={indexKPI?.value ?? "—"} sub={`Contrat : ${state.selectedContract}`} trend="up" />
        </KpiGrid>
      </div>

      <div className="px-6 py-5 space-y-5">
        <SectionCard title="Comparatif qualitatif" noPad>
          <Table>
            <Thead>
              <Tr>
                <Th>Critère</Th>
                <Th>Théorique</Th>
                <Th>Réel</Th>
                <Th>Écart / lecture</Th>
                <Th>Responsable</Th>
              </Tr>
            </Thead>
            <Tbody>
              {m5TheoriqueVsReelSpecRows.map((r) => (
                <Tr key={r.id}>
                  <Td className="font-medium text-sm">{r.critere}</Td>
                  <Td className="text-xs text-neutral-700 max-w-[220px]">{r.theorique}</Td>
                  <Td className="text-xs text-neutral-700 max-w-[220px]">{r.reel}</Td>
                  <Td className="text-xs text-neutral-600 max-w-[200px]">{r.ecart}</Td>
                  <Td className="text-xs text-neutral-500 whitespace-nowrap">{r.responsable}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </SectionCard>

        <SectionCard title="Synthèse € (30 tournées démo)" description="Agrégat M4 + KPIs M5 quand vous bougez M1 / M3." noPad>
          <Table>
            <Thead>
              <Tr>
                <Th>Ligne P&amp;L</Th>
                <Th right>Théorique</Th>
                <Th right>Réel</Th>
                <Th right>Écart €</Th>
                <Th>Responsable</Th>
              </Tr>
            </Thead>
            <Tbody>
              {financeRows.map((r) => (
                <Tr key={r.critere}>
                  <Td className="font-medium text-sm">{r.critere}</Td>
                  <Td right className="tabular-nums text-xs text-neutral-700">{r.theorique}</Td>
                  <Td right className="tabular-nums text-xs font-medium text-neutral-900">{r.reel}</Td>
                  <Td right className="tabular-nums text-xs">
                    <span className={r.ecart.includes("-") && r.critere.includes("Coûts") ? "text-red-600 font-semibold" : "text-neutral-800"}>{r.ecart}</span>
                  </Td>
                  <Td className="text-xs text-neutral-500">{r.responsable}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </SectionCard>

      </div>
    </PageShell>
  );
}
