"use client";

import { useState } from "react";
import { PageShell, SectionCard, KpiGrid, KpiTile } from "@/components/ui/PageShell";
import { HealthChip, HealthChipRow } from "@/components/ui/HealthChip";
import { AiInsightBanner } from "@/components/ui/AiInsightBanner";
import { Badge } from "@/components/ui/Badge";
import { DrilldownDrawer, DrawerSection, DrawerRow, DrawerChart } from "@/components/ui/DrilldownDrawer";
import { Table, Thead, Tbody, Tr, Th, Td } from "@/components/ui/Table";
import Toast from "@/components/ui/Toast";
import { m4Tournees } from "@/lib/demo-data";
import { TourneeWaterfallRecharts } from "@/components/cockpit/TourneeWaterfallRecharts";
import { computeTourneeCostBreakdown, getFuelJustification } from "@/lib/cockpit-mock-data";
import { LayoutGrid, List, Truck, TrendingDown, AlertTriangle, ChevronRight, Fuel, Users, MapPin, Wrench } from "lucide-react";
import Link from "next/link";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const STATUS_CONFIG = {
  ok: { border: "border-emerald-200", bg: "bg-white", barColor: "bg-emerald-500", dot: "bg-emerald-500", label: "Rentable", chip: "emerald" },
  warn: { border: "border-amber-300", bg: "bg-amber-50/30", barColor: "bg-amber-400", dot: "bg-amber-400", label: "Sous-perf.", chip: "amber" },
  deficit: { border: "border-red-300", bg: "bg-red-50/40", barColor: "bg-red-500", dot: "bg-red-500", label: "Déficitaire", chip: "red" },
};

const fmt = (v) => `${v > 0 ? "+" : ""}${v.toLocaleString("fr-FR")} €`;

export default function ParTourneePage() {
  const [view, setView] = useState("cards");
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const total = m4Tournees.length;
  const okCount = m4Tournees.filter((t) => t.statut === "ok").length;
  const warnCount = m4Tournees.filter((t) => t.statut === "warn").length;
  const deficitCount = m4Tournees.filter((t) => t.statut === "deficit").length;

  const filtered = filter === "all" ? m4Tournees
    : m4Tournees.filter((t) => t.statut === filter);

  const selectedTournee = selected ? m4Tournees.find((t) => t.id === selected) : null;
  const breakdown = selectedTournee ? computeTourneeCostBreakdown(selectedTournee) : null;

  const totalCA = m4Tournees.reduce((s, t) => s + t.ca, 0);
  const totalMarge = m4Tournees.reduce((s, t) => s + t.marge, 0);

  return (
    <PageShell
      title="P4.1 — Analyse par tournée"
      subtitle="Marge brute · Variance postes · 30 tournées analysées"
      bare
      noPad
    >
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      <div className="px-6 pt-6 space-y-5">

        <KpiGrid cols={4}>
          <KpiTile label="CA total" value={`${(totalCA / 1000).toFixed(0)} k€`} sub="30 tournées analysées" />
          <KpiTile label="Marge brute" value={`${(totalMarge / 1000).toFixed(0)} k€`} sub={`${((totalMarge / totalCA) * 100).toFixed(1)}% taux marge`} color={totalMarge > 0 ? "ok" : "warn"} />
          <KpiTile label="Tournées déficitaires" value={deficitCount} sub="Marge brute négative — Finance" color="warn" />
          <KpiTile label="Tournées en alerte" value={warnCount} sub="Sous-performance détectée" />
        </KpiGrid>

        {/* AI Insight */}
        <AiInsightBanner
          label="IA — Pattern déficit détecté sur chauffeur Dupont A."
          insight="3 tournées consécutives déficitaires détectées pour Dupont A. (T-0422, T-0427, T-0450). Surconsommation GO systématique +18% vs théorique. Amplitude moyenne 11.4h. Recommandation : révision route + diagnostic moteur AB-421-PL."
          confidence={87}
        />

        {/* Health chips + view toggle */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <HealthChipRow>
            <HealthChip label="Toutes" value={total} color="neutral" isActive={filter === "all"} onClick={() => setFilter("all")} />
            <HealthChip label="Rentables" value={okCount} color="emerald" isActive={filter === "ok"} onClick={() => setFilter(filter === "ok" ? "all" : "ok")} />
            <HealthChip label="Sous-perf." value={warnCount} color="amber" isActive={filter === "warn"} onClick={() => setFilter(filter === "warn" ? "all" : "warn")} />
            <HealthChip label="Déficit" value={deficitCount} color="red" isActive={filter === "deficit"} onClick={() => setFilter(filter === "deficit" ? "all" : "deficit")} />
          </HealthChipRow>
          <div className="flex gap-1 p-1 rounded-lg bg-neutral-100 border border-neutral-200">
            <button
              onClick={() => setView("cards")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${view === "cards" ? "bg-white shadow-sm text-neutral-900 border border-neutral-200" : "text-neutral-500 hover:text-neutral-700"}`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />Cartes
            </button>
            <button
              onClick={() => setView("table")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${view === "table" ? "bg-white shadow-sm text-neutral-900 border border-neutral-200" : "text-neutral-500 hover:text-neutral-700"}`}
            >
              <List className="w-3.5 h-3.5" />Tableau
            </button>
          </div>
        </div>

        {/* CARD VIEW */}
        {view === "cards" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {filtered.map((t) => {
              const cfg = STATUS_CONFIG[t.statut] || STATUS_CONFIG.ok;
              const margeRatio = Math.max(0, Math.min(100, (t.marge / t.ca) * 100 + 20));
              const isSelected = selected === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setSelected(isSelected ? null : t.id)}
                  className={`text-left rounded-xl border-2 ${cfg.border} ${cfg.bg} p-4 hover:shadow-md transition-all ${isSelected ? "ring-2 ring-offset-1 ring-neutral-900/20" : ""}`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full ${cfg.dot} shrink-0`} />
                        <span className="text-xs font-bold font-mono text-neutral-700">{t.id}</span>
                      </div>
                      <div className="text-[10px] text-neutral-400 mt-0.5">{t.date}</div>
                    </div>
                    <Badge color={cfg.chip} size="sm">{cfg.label}</Badge>
                  </div>

                  {/* Client + Chauffeur */}
                  <div className="mb-2 space-y-0.5">
                    <div className="flex items-center gap-1.5 text-xs text-neutral-700 font-medium">
                      <Truck className="w-3 h-3 text-neutral-400 shrink-0" />
                      {t.client}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                      <Users className="w-3 h-3 text-neutral-400 shrink-0" />
                      {t.chauffeur} · {t.km} km
                    </div>
                  </div>

                  {/* CA / Marge numbers */}
                  <div className="flex items-end justify-between mb-2">
                    <div>
                      <div className="text-[10px] text-neutral-400">CA</div>
                      <div className="text-sm font-bold font-mono text-neutral-900">{t.ca.toLocaleString("fr-FR")} €</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-neutral-400">Marge</div>
                      <div className={`text-sm font-bold font-mono ${t.marge < 0 ? "text-red-600" : t.marge < 500 ? "text-amber-600" : "text-emerald-600"}`}>
                        {t.marge.toLocaleString("fr-FR")} €
                      </div>
                      <div className={`text-[10px] font-semibold font-mono mt-0.5 ${t.marge < 0 ? "text-red-500" : t.marge < 500 ? "text-amber-500" : "text-emerald-500"}`}>
                        {((t.marge / t.ca) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>

                  {/* Margin bar */}
                  <div className="h-1.5 rounded-full bg-neutral-100 overflow-hidden mb-2">
                    <div className={`h-full rounded-full ${cfg.barColor} transition-all`} style={{ width: `${margeRatio}%` }} />
                  </div>

                  {/* Variance ecarts */}
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {Object.entries(t.ecart).filter(([, v]) => v !== 0).map(([k, v]) => (
                      <div key={k} className={`flex items-center gap-0.5 text-[9px] font-semibold ${v < 0 ? "text-red-500" : "text-emerald-500"}`}>
                        {k === "carburant" && <Fuel className="w-2.5 h-2.5" />}
                        {k === "rh" && <Users className="w-2.5 h-2.5" />}
                        {k === "peages" && <MapPin className="w-2.5 h-2.5" />}
                        {k === "casse" && <Wrench className="w-2.5 h-2.5" />}
                        {v > 0 ? "+" : ""}{(v / 1000).toFixed(1)}k
                      </div>
                    ))}
                  </div>

                  <div className="mt-2 flex items-center gap-1 text-[10px] text-neutral-400 group-hover:text-neutral-600">
                    Voir détail <ChevronRight className="w-3 h-3" />
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* TABLE VIEW */}
        {view === "table" && (
          <SectionCard noPad>
            <Table compact stickyHeader>
              <Thead>
                <Tr>
                  <Th>Réf</Th>
                  <Th>Date</Th>
                  <Th>Client</Th>
                  <Th>Chauffeur</Th>
                  <Th right>CA prévu</Th>
                  <Th right>Coût réel</Th>
                  <Th right>Marge nette</Th>
                  <Th right>Tx marge</Th>
                  <Th right>Delta</Th>
                  <Th>Statut</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filtered.map((t) => {
                  const cfg = STATUS_CONFIG[t.statut] || STATUS_CONFIG.ok;
                  return (
                    <Tr key={t.id} clickable highlighted={selected === t.id} onClick={() => setSelected(t.id === selected ? null : t.id)}>
                      <Td><span className="font-mono text-xs font-bold text-[#E80912]">{t.id}</span></Td>
                      <Td><span className="text-xs text-neutral-500">{t.date}</span></Td>
                      <Td><span className="font-medium text-xs">{t.client}</span></Td>
                      <Td><span className="text-xs">{t.chauffeur}</span></Td>
                      <Td right><span className="font-mono text-xs">{t.ca.toLocaleString("fr-FR")} €</span></Td>
                      <Td right><span className="font-mono text-xs">{t.coutReel.toLocaleString("fr-FR")} €</span></Td>
                      <Td right>
                        <span className={`font-mono text-xs font-semibold ${t.marge < 0 ? "text-red-600" : t.marge < 500 ? "text-amber-600" : "text-emerald-600"}`}>
                          {t.marge.toLocaleString("fr-FR")} €
                        </span>
                      </Td>
                      <Td right>
                        <span className={`font-mono text-xs font-bold ${t.marge < 0 ? "text-red-600" : t.marge / t.ca < 0.08 ? "text-amber-600" : "text-emerald-700"}`}>
                          {((t.marge / t.ca) * 100).toFixed(1)}%
                        </span>
                      </Td>
                      <Td right>
                        <span className={`font-mono text-xs ${t.delta < 0 ? "text-red-500" : "text-emerald-500"}`}>
                          {fmt(t.delta)}
                        </span>
                      </Td>
                      <Td><Badge color={cfg.chip} size="sm">{cfg.label}</Badge></Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </SectionCard>
        )}

      </div>

      {/* Drawer */}
      {selectedTournee && (
        <DrilldownDrawer
          open={!!selected}
          onClose={() => setSelected(null)}
          title={selectedTournee.id}
          subtitle={`${selectedTournee.client} · ${selectedTournee.chauffeur} · ${selectedTournee.date}`}
        >
          <DrawerSection title="Cost Engine — facture de production (démo)">
            {breakdown ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-neutral-200 bg-white p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Km prévus / réels</p>
                    <p className="text-sm font-mono font-semibold text-neutral-900 mt-1">
                      {breakdown.kmPrev} → {breakdown.kmReel} km
                    </p>
                    <p className={`text-[11px] mt-1 ${breakdown.ecarts.km > 0 ? "text-amber-700" : "text-neutral-500"}`}>
                      Écart km : {breakdown.ecarts.km >= 0 ? "+" : ""}{breakdown.ecarts.km} km
                    </p>
                  </div>
                  <div className="rounded-lg border border-neutral-200 bg-white p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Carburant</p>
                    <p className="text-sm font-mono font-semibold text-neutral-900 mt-1">
                      Théo {breakdown.theorique.litres.toFixed(0)}L · Réel {breakdown.reel.litres.toFixed(0)}L
                    </p>
                    <p className="text-[11px] text-neutral-500 mt-1">Prix pompe: <span className="font-mono">{breakdown.reel.pump.toFixed(2)} €</span></p>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-neutral-50 border-b border-neutral-200 text-[10px] uppercase tracking-wider text-neutral-500">
                        <th className="px-3 py-2 text-left font-semibold">Poste</th>
                        <th className="px-3 py-2 text-right font-semibold">Théorique</th>
                        <th className="px-3 py-2 text-right font-semibold">Réel</th>
                        <th className="px-3 py-2 text-right font-semibold">Écart</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {[
                        { k: "Carburant", t: breakdown.theorique.fuel, r: breakdown.reel.fuel, e: breakdown.ecarts.fuel },
                        { k: "Salaires (RH)", t: breakdown.theorique.rh, r: breakdown.reel.rh, e: breakdown.ecarts.rh },
                        { k: "Matériel (amort.)", t: breakdown.theorique.materiel, r: breakdown.reel.materiel, e: breakdown.ecarts.materiel },
                        { k: "Péages", t: breakdown.theorique.peages, r: breakdown.reel.peages, e: breakdown.ecarts.peages },
                        { k: "Pénalités", t: 0, r: breakdown.reel.penalites, e: breakdown.reel.penalites },
                        { k: "Sous-traitance", t: 0, r: breakdown.reel.sousTraitance, e: breakdown.reel.sousTraitance },
                      ].map((row) => (
                        <tr key={row.k}>
                          <td className="px-3 py-2 text-xs font-medium text-neutral-800">{row.k}</td>
                          <td className="px-3 py-2 text-right font-mono text-xs">{Math.round(row.t).toLocaleString("fr-FR")} €</td>
                          <td className="px-3 py-2 text-right font-mono text-xs">{Math.round(row.r).toLocaleString("fr-FR")} €</td>
                          <td className={`px-3 py-2 text-right font-mono text-xs font-semibold ${row.e > 0 ? "text-red-600" : row.e < 0 ? "text-emerald-700" : "text-neutral-400"}`}>
                            {row.e === 0 ? "—" : `${row.e > 0 ? "+" : ""}${Math.round(row.e).toLocaleString("fr-FR")} €`}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-neutral-900 text-white">
                        <td className="px-3 py-2 text-xs font-bold">Total coût tournée</td>
                        <td className="px-3 py-2 text-right font-mono text-xs font-bold">{Math.round(breakdown.theorique.total).toLocaleString("fr-FR")} €</td>
                        <td className="px-3 py-2 text-right font-mono text-xs font-bold">{Math.round(breakdown.reel.total).toLocaleString("fr-FR")} €</td>
                        <td className={`px-3 py-2 text-right font-mono text-xs font-bold ${breakdown.ecarts.total > 0 ? "text-red-200" : "text-emerald-200"}`}>
                          {breakdown.ecarts.total > 0 ? "+" : ""}{Math.round(breakdown.ecarts.total).toLocaleString("fr-FR")} €
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <p className="text-xs text-neutral-500">Aucune donnée “production” pour cette tournée.</p>
            )}
          </DrawerSection>

          <DrawerSection title="Waterfall marge (k€)">
            <TourneeWaterfallRecharts tournee={selectedTournee} />
          </DrawerSection>

          {breakdown && (
            <DrawerSection title="Théorique vs Réel par poste (€)">
              <DrawerChart title="Comparaison coûts par catégorie" height={200}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={[
                      { poste: "Carburant", théo: Math.round(breakdown.theorique.fuel), réel: Math.round(breakdown.reel.fuel) },
                      { poste: "Salaires", théo: Math.round(breakdown.theorique.rh), réel: Math.round(breakdown.reel.rh) },
                      { poste: "Matériel", théo: Math.round(breakdown.theorique.materiel), réel: Math.round(breakdown.reel.materiel) },
                      { poste: "Péages", théo: Math.round(breakdown.theorique.peages), réel: Math.round(breakdown.reel.peages) },
                    ]}
                    margin={{ top: 4, right: 16, bottom: 0, left: 48 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                    <XAxis type="number" tick={{ fontSize: 9, fill: "#9ca3af" }} axisLine={false} tickLine={false}
                      tickFormatter={(v) => `${v.toLocaleString("fr-FR")}`} />
                    <YAxis type="category" dataKey="poste" tick={{ fontSize: 10, fill: "#374151" }} width={50} axisLine={false} tickLine={false} />
                    <Bar dataKey="théo" fill="#93c5fd" radius={[0, 3, 3, 0]} name="Théorique" />
                    <Bar dataKey="réel" fill="#dc2626" opacity={0.75} radius={[0, 3, 3, 0]} name="Réel" />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Tooltip
                      formatter={(v, name) => [`${v.toLocaleString("fr-FR")} €`, name]}
                      contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #e5e7eb" }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </DrawerChart>
            </DrawerSection>
          )}
          <DrawerSection title="Justification carburant (démo)">
            <p className="text-xs text-neutral-700 leading-relaxed px-1">
              {getFuelJustification(selectedTournee.id)}
            </p>
          </DrawerSection>
          <DrawerSection title="Résultats financiers">
            <DrawerRow label="CA prévu" value={`${selectedTournee.ca.toLocaleString("fr-FR")} €`} />
            <DrawerRow label="Coût théorique" value={`${selectedTournee.coutTheo.toLocaleString("fr-FR")} €`} />
            <DrawerRow label="Coût réel" value={`${selectedTournee.coutReel.toLocaleString("fr-FR")} €`} />
            <DrawerRow label="Marge brute"
              value={<span className={selectedTournee.marge < 0 ? "text-red-600 font-bold" : "text-emerald-600 font-bold"}>{selectedTournee.marge.toLocaleString("fr-FR")} €</span>}
            />
            <DrawerRow label="Km parcourus" value={`${selectedTournee.km} km`} />
          </DrawerSection>
          <DrawerSection title="Variance par poste (vs théorique)">
            {Object.entries(selectedTournee.ecart).map(([k, v]) => (
              <DrawerRow key={k} label={k.charAt(0).toUpperCase() + k.slice(1)}
                value={<span className={v < 0 ? "text-red-600 font-semibold" : v > 0 ? "text-emerald-600 font-semibold" : "text-neutral-400"}>{v === 0 ? "—" : fmt(v)}</span>}
              />
            ))}
            <DrawerRow label="Delta total"
              value={<span className={selectedTournee.delta < 0 ? "text-red-700 font-bold" : "text-emerald-700 font-bold"}>{fmt(selectedTournee.delta)}</span>}
            />
          </DrawerSection>
          {selectedTournee.statut === "deficit" && (
            <div className="mx-0 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2">
              <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <p className="text-xs text-red-700">Tournée déficitaire — visible Finance uniquement. Escalade recommandée.</p>
            </div>
          )}
          <DrawerSection title="Navigation">
            <div className="flex flex-col gap-2">
              <Link href="/rentabilite/analyse-ecarts" className="flex items-center gap-2 text-xs text-[#E80912] hover:underline">
                <TrendingDown className="w-3 h-3" /> Analyse complète des écarts
              </Link>
              <Link href="/rentabilite/par-chauffeur" className="flex items-center gap-2 text-xs text-neutral-600 hover:text-neutral-900">
                <Users className="w-3 h-3" /> Vue par chauffeur
              </Link>
            </div>
          </DrawerSection>
        </DrilldownDrawer>
      )}
    </PageShell>
  );
}
