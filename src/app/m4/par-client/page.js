"use client";

import { useState, useMemo } from "react";
import { ChevronRight, CheckCircle2, Star } from "lucide-react";
import { PageShell, KpiGrid, KpiTile } from "@/components/ui/PageShell";
import { Toolbar } from "@/components/ui/Toolbar";
import { SearchInput } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Table, Thead, Tbody, Tr, Th, Td } from "@/components/ui/Table";
import { DrilldownDrawer, DrawerSection, DrawerRow } from "@/components/ui/DrilldownDrawer";
import { useToast } from "@/components/ui/Toast";
import { useDemoStore } from "@/stores/demoStore";
import { m4Clients } from "@/lib/demo-data";
import { HealthChip, HealthChipRow } from "@/components/ui/HealthChip";
import { Sparkline, demoSparkFromSeed } from "@/components/finance/Sparkline";

const CLIENTS = m4Clients;

const statutVariant = { ok: "emerald", warn: "amber", deficit: "red" };

function fmt(n, sign = false) {
  const s = sign && n >= 0 ? "+" : "";
  if (Math.abs(n) >= 1_000_000) {
    return `${s}${(n / 1_000_000).toFixed(1)} M€`;
  }
  return `${s}${(n / 1000).toFixed(0)} k€`;
}

export default function ParClientPage() {
  const { state, actions } = useDemoStore();
  const { showToast } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tous");
  const [drawer, setDrawer] = useState(null);

  const filtered = useMemo(() => CLIENTS.filter((c) => {
    const matchSearch = search === "" || c.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "Tous" || c.statut === statusFilter;
    return matchSearch && matchStatus;
  }), [search, statusFilter]);

  const totalCA = CLIENTS.reduce((s, c) => s + c.ca, 0);
  const totalMarge = CLIENTS.reduce((s, c) => s + c.marge, 0);
  const avgTxMarge = (totalMarge / totalCA * 100).toFixed(1);

  return (
    <PageShell
      moduleLabel="M4 — Moteur de rentabilité"
      title="Rentabilité par client"
      description="P&L synthétique par client/contrat : CA, coûts réels, marge brute et taux."
      bare
      noPad
    >
      <div className="px-6 pt-6 space-y-3">
        <KpiGrid cols={4}>
          <KpiTile label="Clients actifs" value={CLIENTS.length} sub="Contrats Phase 2" />
          <KpiTile label="CA portefeuille" value={fmt(totalCA)} sub="Cumul période" />
          <KpiTile label="Marge brute totale" value={fmt(totalMarge, true)} sub={`Taux moyen : ${avgTxMarge}%`} trend="up" />
          <KpiTile label="Client actif démo" value={state.selectedContract} sub="Défini dans M1" accent />
        </KpiGrid>
        <HealthChipRow>
          <HealthChip label="Tous" value={CLIENTS.length} color="neutral" isActive={statusFilter === "Tous"} onClick={() => setStatusFilter("Tous")} />
          <HealthChip label="Rentable" value={CLIENTS.filter((c) => c.statut === "ok").length} color="emerald" isActive={statusFilter === "ok"} onClick={() => setStatusFilter(statusFilter === "ok" ? "Tous" : "ok")} />
          <HealthChip label="À surveiller" value={CLIENTS.filter((c) => c.statut === "warn").length} color="amber" isActive={statusFilter === "warn"} onClick={() => setStatusFilter(statusFilter === "warn" ? "Tous" : "warn")} />
          <HealthChip label="Déficitaire" value={CLIENTS.filter((c) => c.statut === "deficit").length} color="red" isActive={statusFilter === "deficit"} onClick={() => setStatusFilter(statusFilter === "deficit" ? "Tous" : "deficit")} />
        </HealthChipRow>
      </div>

      <div className="px-6 py-5">
        <div className="rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
          <Toolbar
            left={
              <>
                <SearchInput
                  placeholder="Rechercher un client…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-64"
                />
                <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="Tous">Tous statuts</option>
                  <option value="ok">Rentable</option>
                  <option value="warn">À surveiller</option>
                  <option value="deficit">Déficitaire</option>
                </Select>
              </>
            }
          />
          <Table>
            <Thead>
              <Tr>
                <Th>Client</Th>
                <Th>Type</Th>
                <Th right>CA</Th>
                <Th right>Coût réel</Th>
                <Th>Trend marge</Th>
                <Th right>Marge brute</Th>
                <Th right>Tx marge</Th>
                <Th right>Tournées</Th>
                <Th>Statut</Th>
                <Th />
              </Tr>
            </Thead>
            <Tbody>
              {filtered.map((c) => (
                <Tr key={c.id} clickable onClick={() => setDrawer(c)} highlighted={state.selectedContract === c.name}>
                  <Td>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-neutral-900 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                        {c.name[0]}
                      </div>
                      <div>
                        <div className="font-medium text-neutral-900">{c.name}</div>
                        {state.selectedContract === c.name && <Badge variant="blue" size="sm">Actif</Badge>}
                      </div>
                    </div>
                  </Td>
                  <Td muted>{c.type}</Td>
                  <Td right className="tabular-nums font-medium">{fmt(c.ca)}</Td>
                  <Td right className="tabular-nums text-neutral-500">{fmt(c.coutReel)}</Td>
                  <Td>
                    <Sparkline values={demoSparkFromSeed(c.name.length * 7 + c.txMarge * 10, 7)} width={72} height={28} />
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
                  <Td right muted className="tabular-nums">{c.tournees}</Td>
                  <Td>
                    <Badge variant={statutVariant[c.statut] ?? "neutral"} size="sm">
                      {c.statut === "ok" ? "Rentable" : c.statut === "warn" ? "À surveiller" : "Déficitaire"}
                    </Badge>
                  </Td>
                  <Td>
                    <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-neutral-500 transition-colors" />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </div>
      </div>

      <DrilldownDrawer
        open={!!drawer}
        title={drawer?.name ?? ""}
        subtitle={drawer?.type}
        onClose={() => setDrawer(null)}
        footer={
          <>
            <Button
              variant="primary"
              size="sm"
              icon={<Star className="w-4 h-4" />}
              onClick={() => {
                actions.setSelectedContract(drawer.name);
                showToast(`Client actif défini : ${drawer.name}`, "success");
                setDrawer(null);
              }}
            >
              Définir comme client actif
            </Button>
            <Button
              variant="ghost"
              size="sm"
              icon={<CheckCircle2 className="w-4 h-4" />}
              onClick={() => {
                actions.markInvestigated(`cl-${drawer.id}`, true);
                showToast("Client marqué comme traité", "success");
              }}
            >
              Marquer traité
            </Button>
          </>
        }
      >
        {drawer && (
          <>
            <DrawerSection title="P&L Synthétique">
              <DrawerRow label="CA période" value={fmt(drawer.ca)} />
              <DrawerRow label="Coût réel" value={fmt(drawer.coutReel)} />
              <DrawerRow label="Marge brute" value={fmt(drawer.marge, true)} highlight={drawer.marge < 0} />
              <DrawerRow label="Taux de marge" value={`${drawer.txMarge}%`} highlight={drawer.txMarge < 5} />
              <DrawerRow label="Nb tournées" value={drawer.tournees} />
            </DrawerSection>

            <DrawerSection title="Décomposition coûts">
              <DrawerRow label="Carburant (~38%)" value={`${(drawer.coutReel * 0.38 / 1000).toFixed(0)} k€`} />
              <DrawerRow label="Salaires (~42%)" value={`${(drawer.coutReel * 0.42 / 1000).toFixed(0)} k€`} />
              <DrawerRow label="Péages (~8%)" value={`${(drawer.coutReel * 0.08 / 1000).toFixed(0)} k€`} />
              <DrawerRow label="Amort. & divers (~12%)" value={`${(drawer.coutReel * 0.12 / 1000).toFixed(0)} k€`} />
            </DrawerSection>

            <DrawerSection title="Liens">
              <a href="/m1/adv-contrats" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                <ChevronRight className="w-3.5 h-3.5" />Voir le contrat ADV
              </a>
              <a href="/rentabilite/par-tournee" className="text-sm text-blue-600 hover:underline flex items-center gap-1 mt-1">
                <ChevronRight className="w-3.5 h-3.5" />Voir les tournées associées
              </a>
            </DrawerSection>
          </>
        )}
      </DrilldownDrawer>
    </PageShell>
  );
}
