"use client";

import { useMemo } from "react";
import { PageShell, KpiGrid, KpiTile, SectionCard } from "@/components/ui/PageShell";
import { Table, Thead, Tbody, Tr, Th, Td } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { m4SousTraitancePrestataires } from "@/lib/demo-data";

function fmtK(n) {
  return `${(n / 1000).toFixed(0)} k€`;
}

export default function VueSousTraitancePage() {
  const rows = m4SousTraitancePrestataires;
  const totalCa = rows.reduce((s, r) => s + r.caFacture, 0);
  const totalAchat = rows.reduce((s, r) => s + r.coutAchat, 0);
  const totalMarge = rows.reduce((s, r) => s + r.marge, 0);
  const txMoy = totalCa > 0 ? ((totalMarge / totalCa) * 100).toFixed(1) : "0";

  const topClients = useMemo(() => {
    const map = new Map();
    rows.forEach((r) => {
      const cur = map.get(r.clientRef) ?? { ca: 0, achat: 0, marge: 0 };
      map.set(r.clientRef, {
        ca: cur.ca + r.caFacture,
        achat: cur.achat + r.coutAchat,
        marge: cur.marge + r.marge,
      });
    });
    return [...map.entries()]
      .map(([client, v]) => ({ client, ...v, tx: v.ca ? ((v.marge / v.ca) * 100).toFixed(1) : "0" }))
      .sort((a, b) => b.marge - a.marge);
  }, [rows]);

  return (
    <PageShell
      moduleLabel="M5 — Dashboard Rentabilité"
      title="Vue sous-traitance"
      description="Synthèse 5e bloc : P&L achat / vente, marge globale et par client — alignée sur les données M4 (démo)."
      bare
      noPad
    >
      <div className="px-6 pt-6">
        <KpiGrid cols={4}>
          <KpiTile label="Prestataires actifs" value={rows.length} sub="Période courante" />
          <KpiTile label="CA sous-traité (vente)" value={fmtK(totalCa)} sub="Facturé aux clients" />
          <KpiTile label="Coût achat" value={fmtK(totalAchat)} sub="Payé prestataires" />
          <KpiTile label="Marge & tx moyen" value={`${fmtK(totalMarge)} · ${txMoy}%`} trend={totalMarge > 0 ? "up" : "down"} sub="CA − achat" />
        </KpiGrid>
      </div>

      <div className="px-6 py-5 space-y-5">
        <SectionCard title="P&L global sous-traitance" description="Même jeu de données que M4 — sous-traitance pour cohérence cockpit.">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-center">
            <div className="rounded-lg border bg-white p-4">
              <div className="text-xs text-neutral-500">Vente</div>
              <div className="text-lg font-bold tabular-nums">{fmtK(totalCa)}</div>
            </div>
            <div className="rounded-lg border bg-white p-4">
              <div className="text-xs text-neutral-500">Achat</div>
              <div className="text-lg font-bold tabular-nums">{fmtK(totalAchat)}</div>
            </div>
            <div className="rounded-lg border border-emerald-100 bg-emerald-50/50 p-4">
              <div className="text-xs text-emerald-800">Marge</div>
              <div className={`text-lg font-bold tabular-nums ${totalMarge < 0 ? "text-red-600" : "text-emerald-800"}`}>{fmtK(totalMarge)}</div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Rentabilité par prestataire" noPad>
          <Table>
            <Thead>
              <Tr>
                <Th>Prestataire</Th>
                <Th>Client ref.</Th>
                <Th right>CA facturé</Th>
                <Th right>Coût achat</Th>
                <Th right>Marge</Th>
                <Th right>Tx marge</Th>
                <Th>Statut</Th>
              </Tr>
            </Thead>
            <Tbody>
              {rows.map((r) => (
                <Tr key={r.id}>
                  <Td className="font-medium">{r.prestataire}</Td>
                  <Td muted className="text-xs">{r.clientRef}</Td>
                  <Td right className="tabular-nums">{fmtK(r.caFacture)}</Td>
                  <Td right muted className="tabular-nums">{fmtK(r.coutAchat)}</Td>
                  <Td right>
                    <span className={`tabular-nums font-medium ${r.marge < 0 ? "text-red-600" : "text-emerald-700"}`}>
                      {r.marge >= 0 ? "+" : ""}{fmtK(r.marge)}
                    </span>
                  </Td>
                  <Td right>
                    <span className={`text-xs font-semibold ${r.txMarge < 0 ? "text-red-600" : "text-emerald-700"}`}>{r.txMarge}%</span>
                  </Td>
                  <Td><Badge variant={r.statut === "ok" ? "emerald" : "red"} size="sm">{r.statut === "ok" ? "OK" : "Déficitaire"}</Badge></Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </SectionCard>

        <SectionCard title="Top clients — marge cumulée" noPad>
          <Table>
            <Thead>
              <Tr>
                <Th>Client</Th>
                <Th right>CA</Th>
                <Th right>Achat</Th>
                <Th right>Marge</Th>
                <Th right>Tx marge</Th>
              </Tr>
            </Thead>
            <Tbody>
              {topClients.map((c) => (
                <Tr key={c.client}>
                  <Td className="font-medium">{c.client}</Td>
                  <Td right className="tabular-nums">{fmtK(c.ca)}</Td>
                  <Td right className="tabular-nums text-neutral-600">{fmtK(c.achat)}</Td>
                  <Td right className={`tabular-nums font-medium ${c.marge < 0 ? "text-red-600" : "text-emerald-700"}`}>
                    {c.marge >= 0 ? "+" : ""}{fmtK(c.marge)}
                  </Td>
                  <Td right className="tabular-nums text-xs">{c.tx}%</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </SectionCard>
      </div>
    </PageShell>
  );
}
