"use client";

import { useState } from "react";
import { ChevronRight, CheckCircle2, Wrench } from "lucide-react";
import { PageShell, KpiGrid, KpiTile } from "@/components/ui/PageShell";
import { Toolbar } from "@/components/ui/Toolbar";
import { SearchInput } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Table, Thead, Tbody, Tr, Th, Td } from "@/components/ui/Table";
import { DrilldownDrawer, DrawerSection, DrawerRow } from "@/components/ui/DrilldownDrawer";
import { useToast } from "@/components/ui/Toast";
import { useDemoStore } from "@/stores/demoStore";
import { m4Vehicules } from "@/lib/demo-data";
import { HealthChip, HealthChipRow } from "@/components/ui/HealthChip";
import { Sparkline, demoSparkFromSeed } from "@/components/finance/Sparkline";

const VEHICULES = m4Vehicules;

function fmt(n, sign = false) {
  return `${sign && n >= 0 ? "+" : ""}${(n / 1000).toFixed(0)} k€`;
}

export default function ParVehiculePage() {
  const { state, actions } = useDemoStore();
  const { showToast } = useToast();
  const [search, setSearch] = useState("");
  const [drawer, setDrawer] = useState(null);
  const [chipFilter, setChipFilter] = useState("all");

  const filtered = VEHICULES.filter((v) => {
    const match = search === "" || v.immat.toLowerCase().includes(search.toLowerCase());
    const rev = v.km > state.assumptions.revisionThresholdKm;
    if (!match) return false;
    if (chipFilter === "all") return true;
    if (chipFilter === "revision") return rev;
    if (chipFilter === "margeNeg") return v.marge < 0;
    return true;
  });
  const revisionAlert = VEHICULES.filter((v) => v.km > state.assumptions.revisionThresholdKm).length;

  return (
    <PageShell
      moduleLabel="M4 — Moteur de rentabilité"
      title="Rentabilité par véhicule"
      description="Suivi des tracteurs : km, taux d'utilisation, marge imputable, alertes révision."
      bare
      noPad
    >
      <div className="px-6 pt-6 space-y-3">
        <KpiGrid cols={4}>
          <KpiTile label="Tracteurs actifs" value={VEHICULES.length} sub="Flotte Phase 2" />
          <KpiTile label="Tx utilisation moyen" value="71%" sub="Base 22h/jour" trend="up" />
          <KpiTile label="Alertes révision" value={revisionAlert} accent={revisionAlert > 0} sub={`Seuil : ${state.assumptions.revisionThresholdKm.toLocaleString("fr-FR")} km`} />
          <KpiTile label="Conso moy. réelle" value="30,5 L/100" sub="vs théorique 28,0" trend="down" />
        </KpiGrid>
        <HealthChipRow>
          <HealthChip label="Tous" value={VEHICULES.length} color="neutral" isActive={chipFilter === "all"} onClick={() => setChipFilter("all")} />
          <HealthChip label="Révision" value={revisionAlert} color="amber" isActive={chipFilter === "revision"} onClick={() => setChipFilter(chipFilter === "revision" ? "all" : "revision")} />
          <HealthChip label="Marge nég." value={VEHICULES.filter((v) => v.marge < 0).length} color="red" isActive={chipFilter === "margeNeg"} onClick={() => setChipFilter(chipFilter === "margeNeg" ? "all" : "margeNeg")} />
        </HealthChipRow>
      </div>

      <div className="px-6 py-5">
        <div className="rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
          <Toolbar left={<SearchInput placeholder="Immatriculation…" value={search} onChange={(e) => setSearch(e.target.value)} className="w-48" />} />
          <Table>
            <Thead>
              <Tr>
                <Th>Immatriculation</Th>
                <Th>Type</Th>
                <Th right>Km cumulés</Th>
                <Th right>Taux util.</Th>
                <Th right>Conso réelle</Th>
                <Th>Trend marge</Th>
                <Th right>Marge imputable</Th>
                <Th>Révision</Th>
                <Th />
              </Tr>
            </Thead>
            <Tbody>
              {filtered.map((v) => {
                const needsRevision = v.km > state.assumptions.revisionThresholdKm;
                return (
                  <Tr key={v.id} clickable onClick={() => setDrawer(v)}>
                    <Td className="font-mono font-medium">{v.immat}</Td>
                    <Td muted>{v.type}</Td>
                    <Td right className="tabular-nums">{v.km.toLocaleString("fr-FR")}</Td>
                    <Td right>
                      <span className={`tabular-nums font-medium ${v.txUtilisation < 65 ? "text-amber-600" : "text-emerald-700"}`}>{v.txUtilisation}%</span>
                    </Td>
                    <Td right>
                      <span className={`tabular-nums text-sm ${v.conso > 30 ? "text-amber-600" : "text-neutral-700"}`}>{v.conso} L/100</span>
                    </Td>
                    <Td>
                      <Sparkline values={demoSparkFromSeed(v.immat.length * 11 + v.marge, 7)} width={72} height={28} />
                    </Td>
                    <Td right>
                      <span className={`tabular-nums font-medium ${v.marge < 0 ? "text-red-600" : "text-emerald-700"}`}>{fmt(v.marge, true)}</span>
                    </Td>
                    <Td>
                      {needsRevision
                        ? <Badge variant="red" size="sm">Révision requise</Badge>
                        : <Badge variant="emerald" size="sm">OK</Badge>}
                    </Td>
                    <Td><ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-neutral-500 transition-colors" /></Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </div>
      </div>

      <DrilldownDrawer open={!!drawer} title={drawer?.immat ?? ""} subtitle={drawer?.type} onClose={() => setDrawer(null)}
        footer={
          <>
            <Button variant="primary" size="sm" icon={<Wrench className="w-4 h-4" />}
              onClick={() => { showToast(`Demande révision créée pour ${drawer?.immat}`, "info"); setDrawer(null); }}
            >Planifier révision</Button>
            <Button variant="ghost" size="sm" icon={<CheckCircle2 className="w-4 h-4" />}
              onClick={() => { actions.markInvestigated(`v-${drawer?.id}`, true); showToast("Véhicule marqué comme traité", "success"); }}
            >Marquer traité</Button>
          </>
        }
      >
        {drawer && (
          <>
            <DrawerSection title="Identification">
              <DrawerRow label="Immatriculation" value={drawer.immat} />
              <DrawerRow label="Type" value={drawer.type} />
            </DrawerSection>
            <DrawerSection title="Utilisation">
              <DrawerRow label="Km cumulés" value={`${drawer.km.toLocaleString("fr-FR")} km`} />
              <DrawerRow label="Seuil révision" value={`${state.assumptions.revisionThresholdKm.toLocaleString("fr-FR")} km`} highlight={drawer.km > state.assumptions.revisionThresholdKm} />
              <DrawerRow label="Taux utilisation" value={`${drawer.txUtilisation}%`} />
            </DrawerSection>
            <DrawerSection title="Performance">
              <DrawerRow label="Conso. réelle" value={`${drawer.conso} L/100km`} highlight={drawer.conso > 30} />
              <DrawerRow label="Référence théorique" value="28,0 L/100km" />
              <DrawerRow label="Marge imputable" value={fmt(drawer.marge, true)} highlight={drawer.marge < 0} />
            </DrawerSection>
          </>
        )}
      </DrilldownDrawer>
    </PageShell>
  );
}
