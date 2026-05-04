"use client";

import { useState } from "react";
import { PageShell, SectionCard } from "@/components/ui/PageShell";
import { Toolbar } from "@/components/ui/Toolbar";
import { SearchInput } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Table, Thead, Tbody, Tr, Th, Td } from "@/components/ui/Table";

const AUDIT_LOG = [
  { date: "28/04/2026 14:32", user: "Raphaela", action: "Mise à jour", poste: "Conso. tracteur GO", avant: "27,5 L/100", apres: "28,0 L/100", motif: "Recalibrage flotte Q1" },
  { date: "28/04/2026 09:15", user: "Wael Demo", action: "Mise à jour", poste: "Forfait jour conducteur", avant: "160 €", apres: "165 €", motif: "Avenant convention collective" },
  { date: "25/04/2026 16:47", user: "Raphaela", action: "Mise à jour", poste: "Seuil révision", avant: "160 000 km", apres: "180 000 km", motif: "Révision politique maintenance" },
  { date: "20/04/2026 11:22", user: "Finance", action: "Mise à jour", poste: "Loyers semi-remorques", avant: "650 €/u", apres: "700 €/u", motif: "Renouvellement contrat locateur" },
  { date: "15/04/2026 08:55", user: "Raphaela", action: "Validation", poste: "Carburant frigo", avant: "1,8 L/h", apres: "2,0 L/h", motif: "Mesures terrain corrigées" },
  { date: "01/03/2026 10:00", user: "Finance", action: "Initialisation", poste: "Grille complète T1 2026", avant: "—", apres: "Chargée", motif: "Initialisation période" },
];

export default function HistoriqueAuditPage() {
  const [search, setSearch] = useState("");

  const filtered = AUDIT_LOG.filter((r) =>
    search === "" || r.poste.toLowerCase().includes(search.toLowerCase()) || r.user.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PageShell
      moduleLabel="M3 — Moteur de coûts"
      title="Historique & Audit"
      description="Traçabilité de toutes les modifications de la grille de coûts et des hypothèses."
      bare
      noPad
    >
      <div className="px-6 py-6">
        <div className="rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
          <Toolbar
            left={<SearchInput placeholder="Poste, utilisateur…" value={search} onChange={(e) => setSearch(e.target.value)} className="w-64" />}
            right={<span className="text-xs text-neutral-400">{filtered.length} entrée{filtered.length > 1 ? "s" : ""}</span>}
          />
          <Table>
            <Thead>
              <Tr>
                <Th>Date</Th>
                <Th>Utilisateur</Th>
                <Th>Action</Th>
                <Th>Poste</Th>
                <Th>Avant</Th>
                <Th>Après</Th>
                <Th>Motif</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filtered.map((r, i) => (
                <Tr key={i}>
                  <Td muted className="text-xs whitespace-nowrap">{r.date}</Td>
                  <Td className="font-medium">{r.user}</Td>
                  <Td>
                    <Badge variant={r.action === "Initialisation" ? "blue" : "neutral"} size="sm">{r.action}</Badge>
                  </Td>
                  <Td className="font-medium">{r.poste}</Td>
                  <Td muted className="tabular-nums text-xs">{r.avant}</Td>
                  <Td className="tabular-nums text-xs font-medium text-neutral-800">{r.apres}</Td>
                  <Td muted className="text-xs max-w-[200px]">
                    <span className="truncate block">{r.motif}</span>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </div>
      </div>
    </PageShell>
  );
}
