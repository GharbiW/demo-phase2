"use client";

import { useState } from "react";
import { ChevronRight, CheckCircle2 } from "lucide-react";
import { PageShell, KpiGrid, KpiTile } from "@/components/ui/PageShell";
import { Toolbar } from "@/components/ui/Toolbar";
import { SearchInput } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Table, Thead, Tbody, Tr, Th, Td } from "@/components/ui/Table";
import { DrilldownDrawer, DrawerSection, DrawerRow } from "@/components/ui/DrilldownDrawer";
import { useToast } from "@/components/ui/Toast";
import { useDemoStore } from "@/stores/demoStore";
import { m4Chauffeurs } from "@/lib/demo-data";
import { HealthChip, HealthChipRow } from "@/components/ui/HealthChip";
import { Sparkline, demoSparkFromSeed } from "@/components/finance/Sparkline";

const CHAUFFEURS = m4Chauffeurs;

const statutVariant = { ok: "emerald", warn: "amber", deficit: "red" };

function fmt(n, sign = false) {
  return `${sign && n >= 0 ? "+" : ""}${(n / 1000).toFixed(0)} k€`;
}

export default function ParChauffeurPage() {
  const { state, actions } = useDemoStore();
  const { showToast } = useToast();
  const [search, setSearch] = useState("");
  const [drawer, setDrawer] = useState(null);
  const [chipFilter, setChipFilter] = useState("all");

  const filtered = CHAUFFEURS.filter((c) => {
    const matchSearch = search === "" || c.nom.toLowerCase().includes(search.toLowerCase());
    const matchChip = chipFilter === "all" || c.statut === chipFilter;
    return matchSearch && matchChip;
  });
  const totalMarge = CHAUFFEURS.reduce((s, c) => s + c.marge, 0);

  return (
    <PageShell
      moduleLabel="M4 — Moteur de rentabilité"
      title="Rentabilité par chauffeur"
      description="Analyse de performance individuelle : CA généré, coûts imputés, marge brute et amplitude."
      bare
      noPad
    >
      <div className="px-6 pt-6 space-y-3">
        <KpiGrid cols={4}>
          <KpiTile label="Chauffeurs actifs" value={CHAUFFEURS.length} sub="Période courante" />
          <KpiTile label="Marge brute totale" value={fmt(totalMarge, true)} sub="Tous chauffeurs" trend="up" />
          <KpiTile label="Déficitaires" value={CHAUFFEURS.filter((c) => c.statut === "deficit").length} accent sub="Action requise" />
          <KpiTile label="Amplitude moyenne" value="10,7 h" sub="vs réglementaire 13h" />
        </KpiGrid>
        <HealthChipRow>
          <HealthChip label="Tous" value={CHAUFFEURS.length} color="neutral" isActive={chipFilter === "all"} onClick={() => setChipFilter("all")} />
          <HealthChip label="OK" value={CHAUFFEURS.filter((c) => c.statut === "ok").length} color="emerald" isActive={chipFilter === "ok"} onClick={() => setChipFilter(chipFilter === "ok" ? "all" : "ok")} />
          <HealthChip label="Surv." value={CHAUFFEURS.filter((c) => c.statut === "warn").length} color="amber" isActive={chipFilter === "warn"} onClick={() => setChipFilter(chipFilter === "warn" ? "all" : "warn")} />
          <HealthChip label="Déficit" value={CHAUFFEURS.filter((c) => c.statut === "deficit").length} color="red" isActive={chipFilter === "deficit"} onClick={() => setChipFilter(chipFilter === "deficit" ? "all" : "deficit")} />
        </HealthChipRow>
      </div>

      <div className="px-6 py-5">
        <div className="rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
          <Toolbar left={<SearchInput placeholder="Rechercher un chauffeur…" value={search} onChange={(e) => setSearch(e.target.value)} className="w-64" />} />
          <Table>
            <Thead>
              <Tr>
                <Th>Chauffeur</Th>
                <Th right>Tournées</Th>
                <Th right>Km</Th>
                <Th right>CA généré</Th>
                <Th right>Coût réel</Th>
                <Th>Marge trend</Th>
                <Th right>Marge</Th>
                <Th right>Tx marge</Th>
                <Th right>Ampl. moy.</Th>
                <Th>Statut</Th>
                <Th />
              </Tr>
            </Thead>
            <Tbody>
              {filtered.map((c) => (
                <Tr key={c.id} clickable onClick={() => setDrawer(c)}>
                  <Td>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-neutral-200 text-neutral-700 text-xs font-semibold flex items-center justify-center shrink-0">
                        {c.nom.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <span className="font-medium">{c.nom}</span>
                    </div>
                  </Td>
                  <Td right muted className="tabular-nums">{c.tournees}</Td>
                  <Td right muted className="tabular-nums">{c.km.toLocaleString("fr-FR")}</Td>
                  <Td right className="tabular-nums font-medium">{fmt(c.caGenere)}</Td>
                  <Td right muted className="tabular-nums">{fmt(c.coutReel)}</Td>
                  <Td>
                    <Sparkline values={demoSparkFromSeed(c.nom.charCodeAt(0) + c.id.charCodeAt(3), 7)} width={72} height={28} />
                  </Td>
                  <Td right>
                    <span className={`tabular-nums font-medium ${c.marge < 0 ? "text-red-600" : "text-emerald-700"}`}>
                      {fmt(c.marge, true)}
                    </span>
                  </Td>
                  <Td right>
                    <span className={`text-xs font-semibold ${c.txMarge < 0 ? "text-red-600" : c.txMarge < 8 ? "text-amber-600" : "text-emerald-700"}`}>
                      {c.txMarge}%
                    </span>
                  </Td>
                  <Td right muted className="tabular-nums">{c.ampMoyH} h</Td>
                  <Td><Badge variant={statutVariant[c.statut]} size="sm">{c.statut === "ok" ? "OK" : c.statut === "warn" ? "À surveiller" : "Déficitaire"}</Badge></Td>
                  <Td><ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-neutral-500 transition-colors" /></Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </div>
      </div>

      <DrilldownDrawer open={!!drawer} title={drawer?.nom ?? ""} subtitle="Fiche chauffeur" onClose={() => setDrawer(null)}
        footer={
          <Button variant="primary" size="sm" icon={<CheckCircle2 className="w-4 h-4" />}
            onClick={() => { actions.markInvestigated(`ch-${drawer.id}`, true); showToast("Chauffeur marqué comme traité", "success"); setDrawer(null); }}
          >Marquer traité</Button>
        }
      >
        {drawer && (
          <>
            <DrawerSection title="Performance">
              <DrawerRow label="Tournées" value={drawer.tournees} />
              <DrawerRow label="Km parcourus" value={`${drawer.km.toLocaleString("fr-FR")} km`} />
              <DrawerRow label="CA généré" value={fmt(drawer.caGenere)} />
              <DrawerRow label="Coût réel" value={fmt(drawer.coutReel)} />
              <DrawerRow label="Marge brute" value={fmt(drawer.marge, true)} highlight={drawer.marge < 0} />
              <DrawerRow label="Taux de marge" value={`${drawer.txMarge}%`} highlight={drawer.txMarge < 5} />
            </DrawerSection>
            <DrawerSection title="Temps de service">
              <DrawerRow label="Amplitude moyenne" value={`${drawer.ampMoyH} h`} highlight={drawer.ampMoyH > 12} />
              <DrawerRow label="Réglementaire max" value="13 h" />
            </DrawerSection>
          </>
        )}
      </DrilldownDrawer>
    </PageShell>
  );
}
