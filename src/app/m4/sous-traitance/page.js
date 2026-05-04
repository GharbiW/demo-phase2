"use client";

import { useState, useMemo } from "react";
import { ChevronRight } from "lucide-react";
import { PageShell, KpiGrid, KpiTile, SectionCard } from "@/components/ui/PageShell";
import { Toolbar } from "@/components/ui/Toolbar";
import { SearchInput } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Table, Thead, Tbody, Tr, Th, Td } from "@/components/ui/Table";
import { DrilldownDrawer, DrawerSection, DrawerRow } from "@/components/ui/DrilldownDrawer";
import { useToast } from "@/components/ui/Toast";
import { m4SousTraitancePrestataires } from "@/lib/demo-data";

function fmt(n, sign = false) {
  return `${sign && n >= 0 ? "+" : ""}${(n / 1000).toFixed(0)} k€`;
}

export default function SousTraitancePage() {
  const { showToast } = useToast();
  const [search, setSearch] = useState("");
  const [drawer, setDrawer] = useState(null);

  const rows = m4SousTraitancePrestataires;
  const filtered = rows.filter((s) => search === "" || s.prestataire.toLowerCase().includes(search.toLowerCase()));
  const totalMarge = rows.reduce((s, r) => s + r.marge, 0);
  const totalCa = rows.reduce((s, r) => s + r.caFacture, 0);
  const totalAchat = rows.reduce((s, r) => s + r.coutAchat, 0);
  const txMargeGlobal = totalCa > 0 ? ((totalMarge / totalCa) * 100).toFixed(1) : "0";

  const topClients = useMemo(() => {
    const map = new Map();
    rows.forEach((r) => {
      map.set(r.clientRef, (map.get(r.clientRef) ?? 0) + r.marge);
    });
    return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [rows]);

  return (
    <PageShell
      moduleLabel="M4 — Moteur de rentabilité"
      title="Rentabilité sous-traitance"
      description="5e bloc du modèle économique : P&L simplifié prix d'achat vs prix de vente, taux de marge, top clients (fixtures démo)."
      bare
      noPad
    >
      <div className="px-6 pt-6">
        <KpiGrid cols={4}>
          <KpiTile label="Prestataires actifs" value={rows.length} sub="Période courante" />
          <KpiTile label="CA facturé total" value={fmt(totalCa)} sub="Facturé au client" />
          <KpiTile label="Coût achat total" value={fmt(totalAchat)} sub="Payé prestataires" />
          <KpiTile label="Marge sous-traitance" value={fmt(totalMarge, true)} trend={totalMarge > 0 ? "up" : "down"} sub={`Tx marge ${txMargeGlobal}%`} />
        </KpiGrid>
      </div>

      <div className="px-6 py-5 space-y-5">
        <SectionCard title="P&L sous-traitance (synthèse)" description="Achat vs vente — même logique que le cockpit M5, granularité prestataire.">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="rounded-lg border border-neutral-100 bg-neutral-50 p-4">
              <div className="text-xs text-neutral-500 uppercase tracking-wide">Vente (client)</div>
              <div className="text-xl font-bold tabular-nums text-neutral-900 mt-1">{fmt(totalCa)}</div>
            </div>
            <div className="rounded-lg border border-neutral-100 bg-neutral-50 p-4">
              <div className="text-xs text-neutral-500 uppercase tracking-wide">Achat (sous-traitant)</div>
              <div className="text-xl font-bold tabular-nums text-neutral-900 mt-1">{fmt(totalAchat)}</div>
            </div>
            <div className="rounded-lg border border-emerald-100 bg-emerald-50/60 p-4">
              <div className="text-xs text-emerald-800 uppercase tracking-wide">Marge nette</div>
              <div className={`text-xl font-bold tabular-nums mt-1 ${totalMarge < 0 ? "text-red-600" : "text-emerald-800"}`}>{fmt(totalMarge, true)}</div>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-2">Top clients (marge cumulée)</div>
            <div className="flex flex-wrap gap-2">
              {topClients.map(([client, marge]) => (
                <span key={client} className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs">
                  <span className="font-medium text-neutral-800">{client}</span>
                  <span className={`tabular-nums font-semibold ${marge < 0 ? "text-red-600" : "text-emerald-700"}`}>{fmt(marge, true)}</span>
                </span>
              ))}
            </div>
          </div>
        </SectionCard>

        <div className="rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
          <Toolbar left={<SearchInput placeholder="Rechercher un prestataire…" value={search} onChange={(e) => setSearch(e.target.value)} className="w-64" />} />
          <Table>
            <Thead>
              <Tr>
                <Th>Prestataire</Th>
                <Th>Type</Th>
                <Th right>Tournées</Th>
                <Th right>CA facturé</Th>
                <Th right>Coût achat</Th>
                <Th right>Marge</Th>
                <Th right>Tx marge</Th>
                <Th />
              </Tr>
            </Thead>
            <Tbody>
              {filtered.map((s) => (
                <Tr key={s.id} clickable onClick={() => setDrawer(s)}>
                  <Td className="font-medium">{s.prestataire}</Td>
                  <Td muted>{s.type}</Td>
                  <Td right muted className="tabular-nums">{s.tournees}</Td>
                  <Td right className="tabular-nums font-medium">{fmt(s.caFacture)}</Td>
                  <Td right muted className="tabular-nums">{fmt(s.coutAchat)}</Td>
                  <Td right>
                    <span className={`tabular-nums font-medium ${s.marge < 0 ? "text-red-600" : "text-emerald-700"}`}>{fmt(s.marge, true)}</span>
                  </Td>
                  <Td right>
                    <span className={`text-xs font-semibold ${s.txMarge < 0 ? "text-red-600" : "text-emerald-700"}`}>{s.txMarge}%</span>
                  </Td>
                  <Td><ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-neutral-500 transition-colors" /></Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </div>
      </div>

      <DrilldownDrawer open={!!drawer} title={drawer?.prestataire ?? ""} subtitle={drawer?.type} onClose={() => setDrawer(null)}
        footer={
          <Button variant="ghost" size="sm" onClick={() => { showToast(`Ticket créé pour ${drawer?.prestataire}`, "info"); setDrawer(null); }}>
            Créer ticket
          </Button>
        }
      >
        {drawer && (
          <DrawerSection title="P&L Sous-traitance">
            <DrawerRow label="Client ref." value={drawer.clientRef} />
            <DrawerRow label="Tournées" value={drawer.tournees} />
            <DrawerRow label="CA facturé (vente)" value={fmt(drawer.caFacture)} />
            <DrawerRow label="Coût d'achat" value={fmt(drawer.coutAchat)} />
            <DrawerRow label="Marge nette" value={fmt(drawer.marge, true)} highlight={drawer.marge < 0} />
            <DrawerRow label="Taux de marge" value={`${drawer.txMarge}%`} highlight={drawer.txMarge < 0} />
          </DrawerSection>
        )}
      </DrilldownDrawer>
    </PageShell>
  );
}
