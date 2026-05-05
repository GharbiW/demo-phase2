"use client";

import { useMemo } from "react";
import { AlertTriangle, CheckCircle2, RefreshCw, Database, Clock } from "lucide-react";
import { PageShell, SectionCard, KpiGrid, KpiTile } from "@/components/ui/PageShell";
import { Badge } from "@/components/ui/Badge";
import { m3CostGrid } from "@/lib/demo-data";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts";

// ── Source → poste mapping ──────────────────────────────────────────
const STREAMS = [
  {
    source: "AS24",
    poste: "Carburant GO + péages",
    postes: ["Carburant tracteur", "Péages"],
    format: "API REST",
    freq: "Mensuel (M-1)",
    statut: "À connecter",
    volume: "~1 200 lignes/mois",
  },
  {
    source: "Engie CSV",
    poste: "Carburant GNC/GNL/BIO",
    postes: ["Carburant frigo", "AdBlue"],
    format: "CSV normalisé",
    freq: "Mensuel (M-1)",
    statut: "CSV à normaliser",
    volume: "~340 lignes/mois",
  },
  {
    source: "Factorial / Silae",
    poste: "Salaires & charges RH",
    postes: ["Salaires & charges RH", "Primes & variables RH"],
    format: "API REST",
    freq: "Mensuel (M-1)",
    statut: "À connecter",
    volume: "~85 lignes/mois",
  },
  {
    source: "Factures garage",
    poste: "Entretien / casse / pneus",
    postes: ["Entretien & maintenance", "Pneumatiques", "Casse / sinistres non assurés"],
    format: "PDF / CSV manuel",
    freq: "Mensuel",
    statut: "Manuel",
    volume: "~40 factures/mois",
  },
  {
    source: "Masternaut",
    poste: "Km réels + reposit.",
    postes: ["Sous-traitance & repositionnements"],
    format: "API Webhook",
    freq: "Hebdomadaire",
    statut: "À connecter",
    volume: "~8 000 lignes/semaine",
  },
];

const statusVariant = { "À connecter": "amber", "CSV à normaliser": "amber", "Manuel": "neutral", "Actif": "emerald" };

export default function IngestionCoutsReelsPage() {
  const totalTheo = useMemo(() => m3CostGrid.reduce((s, r) => s + r.coutTheoMensuel, 0), []);
  const totalReel = useMemo(() => m3CostGrid.reduce((s, r) => s + r.coutReelMensuel, 0), []);
  const totalDelta = totalReel - totalTheo;

  const topDeviant = useMemo(() => {
    return [...m3CostGrid]
      .map((r) => ({
        ...r,
        pct: r.coutTheoMensuel ? ((r.coutReelMensuel - r.coutTheoMensuel) / r.coutTheoMensuel) * 100 : 0,
      }))
      .filter((r) => r.pct > 0)
      .sort((a, b) => b.pct - a.pct)[0];
  }, []);

  const fluxActifs = STREAMS.filter((s) => s.statut === "Actif").length;

  // ── Chart data ─────────────────────────────────────────────────────
  const chartData = useMemo(() =>
    [...m3CostGrid]
      .sort((a, b) => b.coutReelMensuel - a.coutReelMensuel)
      .map((r) => ({
        name: r.poste.length > 20 ? r.poste.slice(0, 19) + "…" : r.poste,
        fullName: r.poste,
        theo: Math.round(r.coutTheoMensuel / 1000),
        reel: Math.round(r.coutReelMensuel / 1000),
        over: r.coutReelMensuel > r.coutTheoMensuel,
      })),
  []);

  // ── Enrich streams with cost data from m3CostGrid ─────────────────
  const enrichedStreams = useMemo(() =>
    STREAMS.map((stream) => {
      const matchedPostes = m3CostGrid.filter((r) =>
        stream.postes.some((p) => r.poste.includes(p.split(" ")[0]))
      );
      const coutReel = matchedPostes.reduce((s, r) => s + r.coutReelMensuel, 0);
      const coutTheo = matchedPostes.reduce((s, r) => s + r.coutTheoMensuel, 0);
      const delta = coutReel - coutTheo;
      const pct = coutTheo ? ((delta / coutTheo) * 100).toFixed(1) : "0.0";
      return { ...stream, coutReel, coutTheo, delta, pct };
    }),
  []);

  return (
    <PageShell
      moduleLabel="M3 — Moteur de coûts"
      title="Coûts réels — Réconciliation"
      description="Vue consolidée des coûts réels ingérés depuis les sources opérationnelles. Dérive par poste et statut des flux."
      bare
      noPad
    >
      <div className="px-6 pt-6 space-y-6">

        {/* ── 6 KPI tiles ──────────────────────────────────────────── */}
        <KpiGrid cols={6}>
          <KpiTile
            label="Coût réel total / mois"
            value={`${(totalReel / 1000).toFixed(0)} k€`}
            sub="13 postes consolidés"
          />
          <KpiTile
            label="Dérive totale"
            value={`${totalDelta > 0 ? "+" : ""}${(totalDelta / 1000).toFixed(1)} k€`}
            sub={`${totalDelta > 0 ? "Sur" : "Sous"}-budget`}
            accent={totalDelta > 0}
            trend={totalDelta > 0 ? "down" : "up"}
          />
          <KpiTile
            label="Poste le plus déviant"
            value={topDeviant ? `+${topDeviant.pct.toFixed(1)}%` : "—"}
            sub={topDeviant?.poste ?? "—"}
            accent={!!topDeviant}
          />
          <KpiTile
            label="Flux actifs / total"
            value={`${fluxActifs} / ${STREAMS.length}`}
            sub={`${STREAMS.length - fluxActifs} à configurer`}
            accent={fluxActifs < STREAMS.length}
          />
          <KpiTile
            label="Dernière synchro"
            value="M-1"
            sub="Mars 2026 — à jour"
          />
          <KpiTile
            label="Lignes ingérées"
            value="~1 700"
            sub="Estimation mensuelle"
          />
        </KpiGrid>

        {/* ── Dual bar chart — théo vs réel ─────────────────────── */}
        <SectionCard
          title="Coûts théorique vs réel — 13 postes"
          description="Comparaison mensuelle par poste. Les barres rouges dépassent le budget théorique."
        >
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={chartData}
                margin={{ top: 0, right: 50, bottom: 0, left: 14 }}
                barCategoryGap="20%"
                barGap={2}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                <XAxis
                  type="number"
                  tick={{ fontSize: 10, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${v}k€`}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 9.5, fill: "#374151" }}
                  width={148}
                  axisLine={false}
                  tickLine={false}
                />
                <Bar dataKey="theo" name="Théorique" fill="#93c5fd" radius={[0, 3, 3, 0]} />
                <Bar
                  dataKey="reel"
                  name="Réel"
                  radius={[0, 3, 3, 0]}
                  fill="#dc2626"
                  opacity={0.75}
                />
                <Legend
                  iconType="square"
                  iconSize={10}
                  wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
                />
                <Tooltip
                  formatter={(v, name, props) => [
                    `${v} k€/mois`,
                    name === "Réel" ? `${props.payload?.fullName ?? ""} (Réel)` : `${props.payload?.fullName ?? ""} (Théo)`,
                  ]}
                  contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #e5e7eb" }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Quick stats below chart */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {m3CostGrid
              .filter((r) => r.coutReelMensuel > r.coutTheoMensuel)
              .sort((a, b) => (b.coutReelMensuel - b.coutTheoMensuel) - (a.coutReelMensuel - a.coutTheoMensuel))
              .slice(0, 4)
              .map((r) => {
                const pct = ((r.coutReelMensuel - r.coutTheoMensuel) / r.coutTheoMensuel * 100).toFixed(1);
                const deltaK = ((r.coutReelMensuel - r.coutTheoMensuel) / 1000).toFixed(1);
                return (
                  <div key={r.poste} className="rounded-lg border border-red-100 bg-red-50/50 p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <AlertTriangle className="w-3 h-3 text-red-500 shrink-0" />
                      <span className="text-[10px] font-bold text-red-600">+{pct}%</span>
                    </div>
                    <p className="text-[11px] font-semibold text-neutral-800 leading-tight line-clamp-2">{r.poste}</p>
                    <p className="text-[10px] text-red-500 font-mono mt-0.5">+{deltaK} k€ vs théo</p>
                  </div>
                );
              })}
          </div>
        </SectionCard>

        {/* ── Enriched sources table ────────────────────────────── */}
        <SectionCard title="Flux d'ingestion & coûts capturés" noPad>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200 text-[10px] uppercase tracking-wider text-neutral-500">
                  <th className="px-4 py-3 text-left font-semibold">Source</th>
                  <th className="px-4 py-3 text-left font-semibold">Poste de coût</th>
                  <th className="px-4 py-3 text-left font-semibold">Format</th>
                  <th className="px-4 py-3 text-left font-semibold">Fréquence</th>
                  <th className="px-4 py-3 text-right font-semibold">Coût réel capturé</th>
                  <th className="px-4 py-3 text-right font-semibold">Dérive</th>
                  <th className="px-4 py-3 text-left font-semibold">Volume</th>
                  <th className="px-4 py-3 text-left font-semibold">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {enrichedStreams.map((s) => (
                  <tr key={s.source} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-neutral-100 border border-neutral-200 flex items-center justify-center shrink-0">
                          <Database className="w-3 h-3 text-neutral-500" />
                        </div>
                        <span className="font-medium text-neutral-900 text-xs">{s.source}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-neutral-700">{s.poste}</td>
                    <td className="px-4 py-3 text-xs text-neutral-500">{s.format}</td>
                    <td className="px-4 py-3 text-xs text-neutral-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-neutral-400 shrink-0" />
                        {s.freq}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-xs font-semibold text-neutral-900">
                      {s.coutReel > 0 ? `${(s.coutReel / 1000).toFixed(1)} k€` : "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {s.delta !== 0 ? (
                        <span className={`font-mono text-xs font-semibold tabular-nums ${s.delta > 0 ? "text-red-600" : "text-emerald-700"}`}>
                          {s.delta > 0 ? "+" : ""}{(s.delta / 1000).toFixed(1)} k€
                          <span className="text-[10px] font-normal ml-1 opacity-70">({s.pct}%)</span>
                        </span>
                      ) : (
                        <span className="text-xs text-neutral-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-neutral-500">{s.volume}</td>
                    <td className="px-4 py-3">
                      <Badge variant={statusVariant[s.statut] ?? "neutral"} size="sm">
                        {s.statut}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-neutral-200 bg-neutral-50">
                  <td colSpan={4} className="px-4 py-3 text-xs font-bold text-neutral-900">Total consolidé</td>
                  <td className="px-4 py-3 text-right font-mono text-xs font-bold text-neutral-900">
                    {(totalReel / 1000).toFixed(0)} k€
                  </td>
                  <td className={`px-4 py-3 text-right font-mono text-xs font-bold ${totalDelta > 0 ? "text-red-600" : "text-emerald-700"}`}>
                    {totalDelta > 0 ? "+" : ""}{(totalDelta / 1000).toFixed(1)} k€
                  </td>
                  <td colSpan={2} />
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Status legend */}
          <div className="px-4 py-3 border-t border-neutral-100 flex flex-wrap gap-4 text-[11px] text-neutral-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              Actif — flux opérationnel
            </span>
            <span className="flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              À connecter / normaliser — phase de déploiement
            </span>
            <span className="flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5 text-neutral-400" />
              Manuel — saisie opérationnelle en attendant intégration
            </span>
          </div>
        </SectionCard>

      </div>
    </PageShell>
  );
}
