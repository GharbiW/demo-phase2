"use client";

import { useState } from "react";
import { PageShell } from "@/components/ui/PageShell";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { Table, Thead, Tbody, Tr, Th, Td } from "@/components/ui/Table";
import { DrilldownDrawer, DrawerSection, DrawerRow } from "@/components/ui/DrilldownDrawer";
import { Tabs, TabsList, Tab, TabPanel } from "@/components/ui/Tabs";
import { useDemoStore } from "@/stores/demoStore";
import { cockpitPeriodOptions } from "@/lib/cockpit-mock-data";
import { HealthChip, HealthChipRow } from "@/components/ui/HealthChip";
import { Sparkline, demoSparkFromSeed } from "@/components/finance/Sparkline";

export default function VueDetaillee() {
  const { state, kpis, actions } = useDemoStore();
  const [drawer, setDrawer] = useState(null);
  const [kpiChip, setKpiChip] = useState("all");

  const okCount = kpis.filter((k) => k.color === "ok").length;
  const warnCount = kpis.filter((k) => k.color !== "ok").length;

  const financiersKpis = kpis.filter((k) =>
    ["CA réalisé", "Marge", "Impact indexation", "Delta théorique", "Coûts de péage", "Coûts casse"].some((kw) => k.kpi.toLowerCase().includes(kw.toLowerCase()))
  );
  const operationnelsKpis = kpis.filter((k) =>
    ["Kilométrage", "Taux d'utilisation", "Amplitude", "Conso", "Taux modification"].some((kw) => k.kpi.toLowerCase().includes(kw.toLowerCase()))
  );

  return (
    <PageShell
      moduleLabel="M5 — Dashboard Rentabilité"
      title="Vue détaillée — KPIs"
      description="Tous les indicateurs de performance organisés par thématique."
      bare
      noPad
    >
      <div className="px-6 pt-6">
        <div className="flex flex-col gap-3 mb-5">
          <div className="flex items-center gap-3 flex-wrap">
            <Select value={state.period} onChange={(e) => actions.setPeriod(e.target.value)}>
              {cockpitPeriodOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </Select>
            <span className="text-xs text-neutral-400">Cliquez un KPI pour le détail</span>
          </div>
          <HealthChipRow>
            <HealthChip label="Tous" value={kpis.length} color="neutral" isActive={kpiChip === "all"} onClick={() => setKpiChip("all")} />
            <HealthChip label="Dans cible" value={okCount} color="emerald" isActive={kpiChip === "ok"} onClick={() => setKpiChip(kpiChip === "ok" ? "all" : "ok")} />
            <HealthChip label="Écart / risque" value={warnCount} color="amber" isActive={kpiChip === "warn"} onClick={() => setKpiChip(kpiChip === "warn" ? "all" : "warn")} />
          </HealthChipRow>
        </div>

        <Tabs defaultTab="financiers">
          <div className="rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
            <TabsList className="px-4 pt-1">
              <Tab id="financiers" label="Financiers" />
              <Tab id="operationnels" label="Opérationnels" />
              <Tab id="tous" label="Tous les KPIs" />
            </TabsList>

            {["financiers", "operationnels", "tous"].map((tabId) => {
              const tabKpis = tabId === "financiers" ? financiersKpis : tabId === "operationnels" ? operationnelsKpis : kpis;
              const filteredKpis = tabKpis.filter((k) => {
                if (kpiChip === "all") return true;
                if (kpiChip === "ok") return k.color === "ok";
                return k.color !== "ok";
              });
              return (
                <TabPanel key={tabId} id={tabId}>
                  <Table>
                    <Thead>
                      <Tr>
                        <Th>KPI</Th>
                        <Th>Trend</Th>
                        <Th>Unité</Th>
                        <Th>Cadence</Th>
                        <Th right>Valeur ({state.period})</Th>
                        <Th>Statut</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {filteredKpis.map((k) => (
                        <Tr key={k.kpi} clickable onClick={() => setDrawer(k)}>
                          <Td className="font-medium">{k.kpi}</Td>
                          <Td>
                            <Sparkline values={demoSparkFromSeed(k.kpi.length * 3, 6)} width={64} height={24} />
                          </Td>
                          <Td muted>{k.unit}</Td>
                          <Td muted>{k.cadence}</Td>
                          <Td right className="font-semibold tabular-nums font-money">{k.value}</Td>
                          <Td>
                            <Badge variant={k.color === "ok" ? "emerald" : "amber"} size="sm">
                              {k.color === "ok" ? "Normal" : "⚠ Attention"}
                            </Badge>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TabPanel>
              );
            })}
          </div>
        </Tabs>
      </div>

      <DrilldownDrawer open={!!drawer} title={drawer?.kpi ?? ""} subtitle={`Unité : ${drawer?.unit}`} onClose={() => setDrawer(null)}>
        {drawer && (
          <>
            <DrawerSection title="Valeur">
              <div className="text-3xl font-bold text-neutral-900 py-2">{drawer.value}</div>
              <DrawerRow label="Cadence" value={drawer.cadence} />
              <DrawerRow label="Statut" value={drawer.color === "ok" ? "✓ Normal" : "⚠ Attention"} highlight={drawer.color === "warn"} />
            </DrawerSection>
            <DrawerSection title="Liens">
              <a href="/m3/grille-couts" className="text-sm text-blue-600 hover:underline">→ Grille 13 postes (théo vs réel)</a>
            </DrawerSection>
          </>
        )}
      </DrilldownDrawer>
    </PageShell>
  );
}
