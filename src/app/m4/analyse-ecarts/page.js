"use client";

import { useState } from "react";
import { PageShell, SectionCard, KpiGrid, KpiTile } from "@/components/ui/PageShell";
import { Table, Thead, Tbody, Tr, Th, Td } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { DrilldownDrawer, DrawerSection, DrawerRow } from "@/components/ui/DrilldownDrawer";
import { m4Tournees, m4Clients, computeFinanceTourneeAggregate } from "@/lib/demo-data";
import { TrendingDown, TrendingUp, Fuel, Users, MapPin, Wrench, AlertTriangle } from "lucide-react";
import { AiInsightBanner } from "@/components/ui/AiInsightBanner";
import { FinanceSection } from "@/components/finance/FinanceSection";
import { ContributionBars } from "@/components/finance/ContributionBars";
import { BridgeWaterfall, buildTourneeBridgeSteps } from "@/components/finance/BridgeWaterfall";
const POSTE_ICONS = {
  carburant: <Fuel className="w-3.5 h-3.5" />,
  rh: <Users className="w-3.5 h-3.5" />,
  peages: <MapPin className="w-3.5 h-3.5" />,
  casse: <Wrench className="w-3.5 h-3.5" />,
};

const fmt = (v) => `${v > 0 ? "+" : ""}${v.toLocaleString("fr-FR")} €`;
const fmtAbs = (v) => `${Math.abs(v).toLocaleString("fr-FR")} €`;

export default function AnalyseEcartsPage() {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("all");

  const tournees = m4Tournees;
  const deficitaires = tournees.filter((t) => t.statut === "deficit").sort((a, b) => a.marge - b.marge);
  const warns = tournees.filter((t) => t.statut === "warn");

  const totalDelta = tournees.reduce((s, t) => s + t.delta, 0);
  const totalCarburant = tournees.reduce((s, t) => s + t.ecart.carburant, 0);
  const totalRH = tournees.reduce((s, t) => s + t.ecart.rh, 0);
  const totalPeages = tournees.reduce((s, t) => s + t.ecart.peages, 0);
  const totalCasse = tournees.reduce((s, t) => s + t.ecart.casse, 0);

  // CA decomposition (3 effets)
  const totalCA = tournees.reduce((s, t) => s + t.ca, 0);
  const effetVolume = Math.round(totalCA * 0.042);
  const effetPrix = Math.round(totalCA * -0.018);
  const effetIndexation = Math.round(totalCA * 0.027);
  const barMax = Math.max(Math.abs(effetVolume), Math.abs(effetPrix), Math.abs(effetIndexation));

  const filtered = filter === "deficit" ? deficitaires : filter === "warn" ? warns : tournees;
  const selectedTournee = selected ? tournees.find((t) => t.id === selected) : null;

  const agg = computeFinanceTourneeAggregate(tournees);
  const bridgeSteps = buildTourneeBridgeSteps(agg);
  const negTotal = totalCarburant + totalRH + totalPeages + totalCasse;
  const shareCarb = negTotal !== 0 ? Math.round((totalCarburant / negTotal) * 100) : null;
  const contributionRows = [
    { id: "carb", label: "Carburant (GO / GNC / frigo)", impactEuro: totalCarburant, hint: shareCarb != null ? `${shareCarb}% du cumul des écarts (agrégat)` : "Part non calculable sur ce sous-ensemble" },
    { id: "rh", label: "RH & amplitude", impactEuro: totalRH, hint: "Paie réelle vs théorique forfait jour" },
    { id: "pe", label: "Péages PTV", impactEuro: totalPeages, hint: "Écart trajet réel vs théorique" },
    { id: "cas", label: "Casse & immobilisation", impactEuro: totalCasse, hint: "Sinistres imputés période" },
  ];

  return (
    <PageShell
      title="P4.6 — Analyse des écarts"
      subtitle="Variance par poste · Décomposition CA · Top 5 déficitaires — 30 tournées analysées"
    >
      {/* KPI strip */}
      <KpiGrid cols={5}>
        <KpiTile label="Delta total" value={fmt(totalDelta)} sub="Réel vs Théorique" color={totalDelta < 0 ? "ok" : "warn"} />
        <KpiTile label="Écart carburant" value={fmt(totalCarburant)} sub="GO · GNC · Frigo" color={totalCarburant < 0 ? "warn" : "ok"} />
        <KpiTile label="Écart RH" value={fmt(totalRH)} sub="Amplitude · Paie" color={totalRH < 0 ? "warn" : "ok"} />
        <KpiTile label="Écart péages" value={fmt(totalPeages)} sub="Réel vs théorique PTV" color={totalPeages < 0 ? "warn" : "ok"} />
        <KpiTile label="Écart casse" value={fmt(totalCasse)} sub="Sinistres · Immobilisation" color={totalCasse < 0 ? "warn" : "ok"} />
      </KpiGrid>

      {/* AI Insight */}
      <AiInsightBanner
        label="IA — Impact carburant représente 62% des écarts — cause principale identifiée"
        insight="Sur les 30 tournées analysées, le poste carburant génère 62% du delta négatif total (−3 840€ sur −6 200€ d'écarts cumulés). Pattern de surconsommation détecté sur 5 tournées avec le même véhicule AB-421-PL. Recommandation IA Phase 3 : alerte préventive 7 jours avant seuil de révision kilométrique."
        confidence={89}
        action={{ label: "Voir les recommandations IA", href: "/m6/recommandations" }}
      />

      <FinanceSection
        eyebrow="Impact €"
        title="Pont marge & contribution des postes"
        subtitle="Le même agrégat que la vue synthèse : CA réalisé, coûts réels constatés, marge résiduelle — puis ventilation des écarts par levier."
        delayClass="finance-reveal-delay-1"
      />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        <BridgeWaterfall steps={bridgeSteps} />
        <ContributionBars rows={contributionRows} />
      </div>

      {/* Top 5 déficitaires */}
      <SectionCard title="Top 5 tournées déficitaires — Alerte Finance">
        <div className="space-y-2">
          {[...tournees].sort((a, b) => a.marge - b.marge).slice(0, 5).map((t, idx) => (
            <div
              key={t.id}
              className={`flex flex-col sm:flex-row items-start sm:items-center gap-3 rounded-xl border px-4 py-3 cursor-pointer hover:shadow-sm transition-all ${t.statut === "deficit" ? "border-red-200 bg-red-50" : "border-amber-200 bg-amber-50"}`}
              onClick={() => setSelected(t.id)}
            >
              <div className="flex items-center gap-3 flex-1">
                <span className="w-6 h-6 rounded-full bg-white border border-neutral-200 text-xs font-bold text-neutral-500 flex items-center justify-center shrink-0">{idx + 1}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-neutral-900">{t.id}</span>
                    <Badge color={t.statut === "deficit" ? "red" : "amber"} size="sm">{t.statut === "deficit" ? "Déficitaire" : "Sous-perf."}</Badge>
                    <span className="text-xs text-neutral-500">{t.client} · {t.chauffeur}</span>
                  </div>
                  <div className="text-xs text-neutral-500 mt-0.5">{t.date}</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 text-xs">
                {Object.entries(t.ecart).map(([k, v]) => (
                  <div key={k} className="flex items-center gap-1">
                    <span className="text-neutral-400">{POSTE_ICONS[k]}</span>
                    <span className={v < 0 ? "text-red-600 font-semibold" : "text-emerald-600 font-semibold"}>{fmt(v)}</span>
                  </div>
                ))}
              </div>
              <div className="shrink-0 text-right">
                <div className={`text-sm font-bold font-mono ${t.marge < 0 ? "text-red-600" : "text-amber-600"}`}>
                  {t.marge.toLocaleString("fr-FR")} € marge
                </div>
                <div className="text-xs text-neutral-400">CA : {t.ca.toLocaleString("fr-FR")} €</div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* CA Decomposition */}
      <SectionCard title="Décomposition CA en 3 effets — Analyse contribution">
        <div className="space-y-4">
          <p className="text-xs text-neutral-500">
            Le CA réalisé de <strong>{(totalCA / 1000).toFixed(0)} k€</strong> sur 30 tournées se décompose en 3 effets :
          </p>
          <div className="space-y-3">
            {[
              { label: "Effet Volume", desc: "Plus de tournées planifiées vs période précédente", value: effetVolume, icon: <TrendingUp className="w-4 h-4" /> },
              { label: "Effet Prix", desc: "Variation des tarifs contractuels et spotés appliqués", value: effetPrix, icon: <TrendingDown className="w-4 h-4" /> },
              { label: "Effet Indexation", desc: "Révision des contrats indexés CNR/Dirham", value: effetIndexation, icon: <TrendingUp className="w-4 h-4" /> },
            ].map((e) => {
              const isPositive = e.value >= 0;
              const barWidth = barMax > 0 ? (Math.abs(e.value) / barMax * 100) : 0;
              return (
                <div key={e.label} className="flex items-center gap-4">
                  <div className="w-36 shrink-0">
                    <div className="text-sm font-semibold text-neutral-900">{e.label}</div>
                    <div className="text-xs text-neutral-400 leading-relaxed">{e.desc}</div>
                  </div>
                  <div className="flex-1 flex items-center gap-3">
                    <div className="flex-1 h-6 bg-neutral-100 rounded-full overflow-hidden relative">
                      <div
                        className={`absolute top-0 h-full rounded-full flex items-center justify-end pr-2 ${isPositive ? "left-0 bg-emerald-400" : "right-0 bg-red-400"}`}
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                    <div className={`w-24 text-right font-bold font-mono text-sm ${isPositive ? "text-emerald-600" : "text-red-600"}`}>
                      {fmt(e.value)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-between border-t border-neutral-200 pt-3">
            <span className="text-sm font-semibold text-neutral-700">Impact net total</span>
            <span className={`text-lg font-bold font-mono ${effetVolume + effetPrix + effetIndexation >= 0 ? "text-emerald-600" : "text-red-600"}`}>
              {fmt(effetVolume + effetPrix + effetIndexation)}
            </span>
          </div>
        </div>
      </SectionCard>

      {/* Variance table */}
      <SectionCard
        title="Variance par tournée — poste par poste"
        actions={
          <div className="flex gap-1">
            {[["all", "Toutes"], ["deficit", "Déficit seulement"], ["warn", "Sous-perf."]].map(([v, l]) => (
              <button key={v} onClick={() => setFilter(v)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${filter === v ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"}`}>
                {l}
              </button>
            ))}
          </div>
        }
        noPad
      >
        <Table compact stickyHeader>
          <Thead>
            <Tr>
              <Th>Tournée</Th>
              <Th>Date</Th>
              <Th>Client</Th>
              <Th>Chauffeur</Th>
              <Th right>CA</Th>
              <Th right>Marge</Th>
              <Th right><span className="flex items-center gap-1 justify-end"><Fuel className="w-3 h-3" />Carburant</span></Th>
              <Th right><span className="flex items-center gap-1 justify-end"><Users className="w-3 h-3" />RH</span></Th>
              <Th right><span className="flex items-center gap-1 justify-end"><MapPin className="w-3 h-3" />Péages</span></Th>
              <Th right><span className="flex items-center gap-1 justify-end"><Wrench className="w-3 h-3" />Casse</span></Th>
              <Th right>Delta total</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filtered.slice(0, 20).map((t) => {
              const isDeficit = t.statut === "deficit";
              return (
                <Tr key={t.id} clickable highlighted={selected === t.id}
                  onClick={() => setSelected(t.id)}>
                  <Td>
                    <span className="font-mono text-xs font-bold text-[#E80912]">{t.id}</span>
                  </Td>
                  <Td><span className="text-xs text-neutral-500">{t.date}</span></Td>
                  <Td><span className="text-xs font-medium">{t.client}</span></Td>
                  <Td><span className="text-xs text-neutral-600">{t.chauffeur}</span></Td>
                  <Td right><span className="font-mono text-xs">{t.ca.toLocaleString("fr-FR")} €</span></Td>
                  <Td right>
                    <span className={`font-mono text-xs font-semibold ${isDeficit ? "text-red-600" : t.marge < 500 ? "text-amber-600" : "text-emerald-600"}`}>
                      {t.marge.toLocaleString("fr-FR")} €
                    </span>
                  </Td>
                  {Object.entries(t.ecart).map(([k, v]) => (
                    <Td key={k} right>
                      <span className={`font-mono text-xs ${v < -100 ? "text-red-600 font-semibold" : v < 0 ? "text-red-400" : v > 0 ? "text-emerald-600" : "text-neutral-400"}`}>
                        {v === 0 ? "—" : fmt(v)}
                      </span>
                    </Td>
                  ))}
                  <Td right>
                    <span className={`font-mono text-xs font-bold ${t.delta < 0 ? "text-red-600" : "text-emerald-600"}`}>
                      {fmt(t.delta)}
                    </span>
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </SectionCard>

      {/* Drawer */}
      {selectedTournee && (
        <DrilldownDrawer
          open={!!selected}
          onClose={() => setSelected(null)}
          title={`Analyse — ${selectedTournee.id}`}
          subtitle={`${selectedTournee.client} · ${selectedTournee.chauffeur} · ${selectedTournee.date}`}
        >
          <DrawerSection title="Résultats">
            <DrawerRow label="CA" value={`${selectedTournee.ca.toLocaleString("fr-FR")} €`} />
            <DrawerRow label="Coût théorique" value={`${selectedTournee.coutTheo.toLocaleString("fr-FR")} €`} />
            <DrawerRow label="Coût réel" value={`${selectedTournee.coutReel.toLocaleString("fr-FR")} €`} />
            <DrawerRow label="Marge brute" value={`${selectedTournee.marge.toLocaleString("fr-FR")} €`} />
            <DrawerRow label="km parcourus" value={`${selectedTournee.km} km`} />
          </DrawerSection>
          <DrawerSection title="Variance par poste">
            {Object.entries(selectedTournee.ecart).map(([k, v]) => (
              <DrawerRow key={k} label={k.charAt(0).toUpperCase() + k.slice(1)}
                value={<span className={v < 0 ? "text-red-600 font-semibold" : v > 0 ? "text-emerald-600 font-semibold" : "text-neutral-400"}>{v === 0 ? "—" : fmt(v)}</span>} />
            ))}
            <DrawerRow label="Delta total"
              value={<span className={selectedTournee.delta < 0 ? "text-red-700 font-bold" : "text-emerald-700 font-bold"}>{fmt(selectedTournee.delta)}</span>} />
          </DrawerSection>
          {selectedTournee.statut === "deficit" && (
            <div className="mx-4 mb-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2">
              <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <p className="text-xs text-red-700">Tournée déficitaire — visible Finance uniquement. Marge brute négative.</p>
            </div>
          )}
        </DrilldownDrawer>
      )}
    </PageShell>
  );
}
