"use client";

import { useState } from "react";
import { TrendingUp, TrendingDown, ChevronRight } from "lucide-react";
import { PageShell, SectionCard, KpiGrid, KpiTile } from "@/components/ui/PageShell";
import { Toolbar } from "@/components/ui/Toolbar";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { Table, Thead, Tbody, Tr, Th, Td } from "@/components/ui/Table";
import { DrilldownDrawer, DrawerSection, DrawerRow } from "@/components/ui/DrilldownDrawer";
import { useDemoStore } from "@/stores/demoStore";

const DECOMPOSITION = [
  { label: "Effet volume", value: "+28 000 €", pct: "+2,3%", direction: "up" },
  { label: "Effet prix", value: "+14 500 €", pct: "+1,2%", direction: "up" },
  { label: "Effet indexation", value: null, pct: null, direction: "up" },
];

const FULL_ROWS = [
  { contrat: "FedEx — National", caTheorique: 1250000, caReel: 1310000, indexation: null, delta: 60000 },
  { contrat: "Chronopost — Région", caTheorique: 420000, caReel: 398000, indexation: 12000, delta: -22000 },
  { contrat: "Auchan — Distribution", caTheorique: 680000, caReel: 695000, indexation: 8500, delta: 15000 },
  { contrat: "CEVA — Logistique", caTheorique: 940000, caReel: 921000, indexation: null, delta: -19000 },
  { contrat: "DHL Supply — Cadre", caTheorique: 1080000, caReel: 1104000, indexation: 24000, delta: 24000 },
];

function fmt(val) {
  if (val === null || val === undefined) return "—";
  const sign = val >= 0 ? "+" : "";
  return `${sign}${(val / 1000).toFixed(0)} k€`;
}
function fmtE(val) {
  return `${(val / 1000).toFixed(0)} k€`;
}

export default function CaTheoriquePage() {
  const { state, kpis } = useDemoStore();
  const [period, setPeriod] = useState("T2 2026");
  const [drawer, setDrawer] = useState(null);

  const indexationKPI = kpis.find((k) => k.kpi.toLowerCase().includes("indexation"));
  const indexImpact = state.indexation.indexationImpactKEUR;

  const rows = FULL_ROWS.map((r) => ({
    ...r,
    indexation: r.contrat.includes("FedEx") ? indexImpact * 1000 * 0.22 : r.indexation,
  }));

  const totalTheorique = rows.reduce((s, r) => s + r.caTheorique, 0);
  const totalReel = rows.reduce((s, r) => s + r.caReel, 0);
  const totalDelta = totalReel - totalTheorique;

  return (
    <PageShell
      moduleLabel="M1 — Commercial & Tarification"
      title="CA Théorique vs Réel"
      description={`Décomposition effet-volume/prix/indexation pour ${state.selectedContract} · ${period}`}
      bare
      noPad
    >
      {/* KPIs */}
      <div className="px-6 pt-6">
        <KpiGrid cols={4}>
          <KpiTile
            label="CA Théorique (total)"
            value={fmtE(totalTheorique)}
            sub={period}
          />
          <KpiTile
            label="CA Réel (total)"
            value={fmtE(totalReel)}
            sub="Exploitation"
          />
          <KpiTile
            label="Delta (Réel − Théo.)"
            value={fmt(totalDelta)}
            sub={totalDelta >= 0 ? "Dépassement positif" : "Sous-réalisation"}
            trend={totalDelta >= 0 ? "up" : "down"}
            accent={totalDelta < -50000}
          />
          <KpiTile
            label="Impact indexation"
            value={`+${indexImpact} k€`}
            sub="Source M1 indexation"
            trend="up"
          />
        </KpiGrid>
      </div>

      {/* Table */}
      <div className="px-6 py-5">
        <div className="rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
          <Toolbar
            left={
              <Select value={period} onChange={(e) => setPeriod(e.target.value)}>
                <option>T2 2026</option>
                <option>T1 2026</option>
                <option>T4 2025</option>
                <option>Annuel 2025</option>
              </Select>
            }
            right={
              <span className="text-xs text-neutral-400">Cliquez une ligne pour le détail</span>
            }
          />
          <Table>
            <Thead>
              <Tr>
                <Th>Contrat</Th>
                <Th right>CA Théorique</Th>
                <Th right>CA Réel</Th>
                <Th right>Effet indexation</Th>
                <Th right>Delta</Th>
                <Th />
              </Tr>
            </Thead>
            <Tbody>
              {rows.map((r) => (
                <Tr key={r.contrat} clickable onClick={() => setDrawer(r)}>
                  <Td className="font-medium">{r.contrat}</Td>
                  <Td right className="tabular-nums">{fmtE(r.caTheorique)}</Td>
                  <Td right className="tabular-nums">{fmtE(r.caReel)}</Td>
                  <Td right className="tabular-nums text-neutral-500">{r.indexation ? fmt(r.indexation) : "—"}</Td>
                  <Td right>
                    <span className={r.delta >= 0 ? "text-emerald-600 font-medium" : "text-red-600 font-medium"}>
                      {fmt(r.delta)}
                    </span>
                  </Td>
                  <Td>
                    <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-neutral-500 transition-colors" />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

          {/* Totals row */}
          <div className="px-5 py-3 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-700">Total</span>
            <div className="flex gap-12 text-xs font-semibold tabular-nums">
              <span className="text-neutral-700">{fmtE(totalTheorique)}</span>
              <span className="text-neutral-700">{fmtE(totalReel)}</span>
              <span className="text-neutral-400">—</span>
              <span className={totalDelta >= 0 ? "text-emerald-700" : "text-red-700"}>{fmt(totalDelta)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Drilldown */}
      <DrilldownDrawer
        open={!!drawer}
        title={drawer?.contrat ?? ""}
        subtitle="Décomposition CA"
        onClose={() => setDrawer(null)}
      >
        {drawer && (
          <>
            <DrawerSection title="Chiffres clés">
              <DrawerRow label="CA Théorique" value={fmtE(drawer.caTheorique)} />
              <DrawerRow label="CA Réel" value={fmtE(drawer.caReel)} />
              <DrawerRow label="Delta" value={fmt(drawer.delta)} highlight={drawer.delta < 0} />
              <DrawerRow label="Effet indexation" value={drawer.indexation ? fmt(drawer.indexation) : "—"} />
            </DrawerSection>

            <DrawerSection title="Décomposition de l'écart">
              {DECOMPOSITION.map((d) => (
                <DrawerRow
                  key={d.label}
                  label={d.label}
                  value={d.label === "Effet indexation" ? `+${indexImpact} k€` : `${d.value} (${d.pct})`}
                  highlight={d.direction === "down"}
                />
              ))}
            </DrawerSection>

            <DrawerSection title="Actions">
              <div className="flex flex-col gap-1.5">
                <a href="/m1/indexation-carburant" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                  <ChevronRight className="w-3.5 h-3.5" />
                  Modifier les paramètres d&apos;indexation
                </a>
                <a href="/m3/grille-couts" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                  <ChevronRight className="w-3.5 h-3.5" />
                  Voir dans le dashboard M5
                </a>
              </div>
            </DrawerSection>
          </>
        )}
      </DrilldownDrawer>
    </PageShell>
  );
}
