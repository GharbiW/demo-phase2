"use client";

import { PageShell, SectionCard, KpiGrid, KpiTile } from "@/components/ui/PageShell";
import { Table, Thead, Tbody, Tr, Th, Td } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { planningBlockEuroImpact } from "@/lib/demo-data";

const CODES = [
  { code: "🟢", label: "OK — Rentable", detail: "Marge ≥ seuil cible", visible: "Conception (sans chiffres)" },
  { code: "🟠", label: "HPL — Haut de plage", detail: "Départ ou arrivée en HPL matin/soir", visible: "Conception" },
  { code: "🔴", label: "Optimisation possible", detail: "Trou exploitable dans la planification", visible: "Conception" },
  { code: "🔵", label: "Pied / Repositionnement", detail: "Km non facturés entre prestations", visible: "Conception" },
  { code: "⚫", label: "Déficitaire", detail: "Marge brute négative", visible: "Finance uniquement" },
];

const SEMAINES = [
  { semaine: "S (courante)", nb: 148, okPct: "71%", hplPct: "12%", optPct: "8%", piedPct: "9%", modifPct: "—" },
  { semaine: "S+1", nb: 142, okPct: "68%", hplPct: "14%", optPct: "10%", piedPct: "8%", modifPct: "—" },
  { semaine: "S+2", nb: 138, okPct: "65%", hplPct: "15%", optPct: "12%", piedPct: "8%", modifPct: "—" },
  { semaine: "S+3", nb: 124, okPct: "62%", hplPct: "16%", optPct: "13%", piedPct: "9%", modifPct: "—" },
  { semaine: "S+4", nb: 89, okPct: "58%", hplPct: "18%", optPct: "14%", piedPct: "10%", modifPct: "—" },
  { semaine: "S-1 (revue)", nb: 156, okPct: "74%", hplPct: "11%", optPct: "7%", piedPct: "8%", modifPct: "14%" },
];

function fmtEuro(n) {
  return `${(n / 1000).toFixed(1).replace(".", ",")} k€`;
}

export default function IntegrationPlanningPage() {
  return (
    <PageShell
      moduleLabel="M5 — Dashboard Rentabilité"
      title="Intégration planning"
      description="Codes couleur de rentabilité intégrés dans l'écran de planification. La Conception voit les codes sans les chiffres ; la Finance voit l’impact € agrégé par type de bloc."
      bare
      noPad
    >
      <div className="px-6 pt-6">
        <KpiGrid cols={4}>
          <KpiTile label="Horizon planning" value="S → S+4" sub="5 semaines glissantes" />
          <KpiTile label="Taux modification S-1" value="14%" sub="Cible : < 20%" trend="up" />
          <KpiTile label="Tournées planifiées (S)" value={148} sub="Semaine courante" />
          <KpiTile label="Codes actifs" value={5} sub="Visibilité Conception" />
        </KpiGrid>
      </div>

      <div className="px-6 py-5 space-y-5">
        <SectionCard
          title="Blocs planning → impact € (Finance)"
          description="Conception : code seul. Finance : panneau € moyen mensuel démo — coût km non facturé, opportunité temps, surcoût HPL."
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {planningBlockEuroImpact.map((b) => (
              <div key={b.codeKey} className="rounded-xl border border-neutral-200 bg-neutral-50/60 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{b.emoji}</span>
                  <span className="text-sm font-semibold text-neutral-900">{b.label}</span>
                </div>
                <div className="text-[11px] text-neutral-500 mb-3">{b.detail}</div>
                <div className="rounded-lg bg-white border border-neutral-100 p-3 space-y-2 text-xs">
                  <div className="flex justify-between gap-2">
                    <span className="text-neutral-500">Conception</span>
                    <span className="font-medium text-neutral-800 text-right">{b.conception}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-neutral-500">Finance</span>
                    <span className="font-bold tabular-nums text-[color:var(--color-parnass-red)]">{fmtEuro(b.financeEuro)}</span>
                  </div>
                  <p className="text-[11px] text-neutral-600 pt-1 border-t border-neutral-100">{b.financeLabel}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Nomenclature des codes couleur" description="Visibilité contrôlée par rôle — la Conception voit les codes sans les données chiffrées">
          <div className="flex flex-col gap-2">
            {CODES.map((c) => (
              <div key={c.code} className="flex items-start gap-3 py-2 border-b border-neutral-100 last:border-0">
                <span className="text-xl shrink-0">{c.code}</span>
                <div className="flex-1">
                  <div className="text-sm font-medium text-neutral-900">{c.label}</div>
                  <div className="text-xs text-neutral-500">{c.detail}</div>
                </div>
                <Badge variant="neutral" size="sm">{c.visible}</Badge>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Répartition planning par semaine" noPad>
          <Table>
            <Thead>
              <Tr>
                <Th>Semaine</Th>
                <Th right>Nb tournées</Th>
                <Th right>🟢 OK</Th>
                <Th right>🟠 HPL</Th>
                <Th right>🔴 Optim.</Th>
                <Th right>🔵 Pied</Th>
                <Th right>Taux modif. S-1</Th>
              </Tr>
            </Thead>
            <Tbody>
              {SEMAINES.map((s) => (
                <Tr key={s.semaine} highlighted={s.semaine === "S-1 (revue)"}>
                  <Td className="font-medium">
                    {s.semaine}
                    {s.semaine === "S-1 (revue)" && <Badge variant="blue" size="sm" className="ml-2">Revue qualité</Badge>}
                  </Td>
                  <Td right className="tabular-nums">{s.nb}</Td>
                  <Td right className="tabular-nums text-emerald-700 font-medium">{s.okPct}</Td>
                  <Td right className="tabular-nums text-amber-600">{s.hplPct}</Td>
                  <Td right className="tabular-nums text-red-500">{s.optPct}</Td>
                  <Td right className="tabular-nums text-blue-600">{s.piedPct}</Td>
                  <Td right className="tabular-nums font-medium">{s.modifPct}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </SectionCard>
      </div>
    </PageShell>
  );
}
