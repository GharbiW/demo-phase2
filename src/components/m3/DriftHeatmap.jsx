"use client";

import { cn } from "@/lib/cn";

function severityScore(pct) {
  const a = Math.abs(pct ?? 0);
  if (a >= 12) return 4;
  if (a >= 8) return 3;
  if (a >= 4) return 2;
  if (a >= 1) return 1;
  return 0;
}

const POSITIVE_SCALE = [
  "bg-red-50 border-red-100",
  "bg-red-100 border-red-200",
  "bg-red-200 border-red-300",
  "bg-red-400 border-red-500",
  "bg-red-600 border-red-700",
];
const NEGATIVE_SCALE = [
  "bg-emerald-50 border-emerald-100",
  "bg-emerald-100 border-emerald-200",
  "bg-emerald-200 border-emerald-300",
  "bg-emerald-400 border-emerald-500",
  "bg-emerald-600 border-emerald-700",
];
const TEXT_ON_DARK = [
  "text-neutral-700",
  "text-neutral-700",
  "text-neutral-800",
  "text-white",
  "text-white",
];

export function DriftHeatmap({ rows, activeId, onSelect }) {
  if (!rows?.length) return null;

  return (
    <div className="rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 px-5 py-3 border-b border-neutral-100">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-0.5">Vue d&apos;ensemble</p>
          <h2 className="text-sm font-semibold text-neutral-900">Carte de chaleur des dérives</h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            13 postes — chaque case = un poste. Couleur = sens et intensité de l&apos;écart réel vs théorique.
          </p>
        </div>
        <Legend />
      </div>

      {/* Grid — compact, all 13 postes in 2 rows on sm, 1 row on lg */}
      <div className="p-3">
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5" style={{ gridTemplateColumns: "repeat(7, minmax(0, 1fr))" }}>
          {rows.map((row, idx) => {
            const delta = row.coutReelMensuel - row.coutTheoMensuel;
            const pct = row.coutTheoMensuel ? (delta / row.coutTheoMensuel) * 100 : 0;
            const score = severityScore(pct);
            const isOver = delta > 0;
            const isUnder = delta < 0;
            const palette = isOver ? POSITIVE_SCALE : isUnder ? NEGATIVE_SCALE : ["bg-neutral-100 border-neutral-200"];
            const cls = palette[score] ?? palette[0];
            const textCls = score >= 3 ? TEXT_ON_DARK[score] : "text-neutral-700";
            const isActive = activeId === idx;

            return (
              <button
                key={row.poste}
                type="button"
                onClick={() => onSelect?.(idx)}
                className={cn(
                  "group relative rounded-lg border text-left transition-all duration-150",
                  "h-[72px]",
                  cls,
                  isActive
                    ? "ring-2 ring-neutral-900 ring-offset-1 scale-[1.04] shadow-md"
                    : "hover:scale-[1.03] hover:shadow-sm",
                )}
                title={`${row.poste} · ${pct > 0 ? "+" : ""}${pct.toFixed(1)}%`}
              >
                <div className={cn("absolute inset-0 p-1.5 flex flex-col justify-between", textCls)}>
                  <span className="text-[8px] font-semibold leading-tight line-clamp-2 uppercase tracking-tight">
                    {row.poste}
                  </span>
                  <span className="font-mono text-[11px] font-bold tabular-nums leading-none">
                    {pct > 0 ? "+" : ""}
                    {pct.toFixed(1)}%
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Legend() {
  return (
    <div className="hidden sm:flex items-center gap-4 text-[10px] text-neutral-500 shrink-0">
      <LegendBlock label="Sous théo" colors={NEGATIVE_SCALE} />
      <div className="w-px h-5 bg-neutral-200" />
      <LegendBlock label="Sur théo" colors={POSITIVE_SCALE} />
    </div>
  );
}

function LegendBlock({ label, colors }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="font-semibold text-neutral-500">{label}</span>
      <div className="flex gap-0.5">
        {colors.map((c, i) => (
          <span
            key={i}
            className={cn("block w-3 h-3 rounded-sm border", c)}
          />
        ))}
      </div>
    </div>
  );
}
