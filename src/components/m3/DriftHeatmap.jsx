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

const POSITIVE_SCALE = ["bg-red-100", "bg-red-200", "bg-red-300", "bg-red-500", "bg-red-700"];
const NEGATIVE_SCALE = ["bg-emerald-100", "bg-emerald-200", "bg-emerald-300", "bg-emerald-500", "bg-emerald-700"];
const TEXT_ON_DARK = ["text-neutral-700", "text-neutral-700", "text-neutral-800", "text-white", "text-white"];

export function DriftHeatmap({ rows, activeId, onSelect }) {
  if (!rows?.length) return null;

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5">
      <div className="flex items-end justify-between gap-3 mb-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 mb-1">
            Vue d'ensemble
          </p>
          <h2 className="text-[15px] font-semibold text-neutral-950 tracking-tight">
            Carte de chaleur des dérives
          </h2>
          <p className="text-[11px] text-neutral-500 mt-0.5">
            14 postes — chaque case = un poste. Couleur = sens et intensité de l'écart réel vs théorique.
          </p>
        </div>
        <Legend />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1.5">
        {rows.map((row, idx) => {
          const delta = row.coutReelMensuel - row.coutTheoMensuel;
          const pct = row.coutTheoMensuel ? (delta / row.coutTheoMensuel) * 100 : 0;
          const score = severityScore(pct);
          const isOver = delta > 0;
          const isUnder = delta < 0;
          const palette = isOver ? POSITIVE_SCALE : isUnder ? NEGATIVE_SCALE : ["bg-neutral-100"];
          const cls = palette[score] ?? palette[0];
          const textCls = score >= 3 ? TEXT_ON_DARK[score] : "text-neutral-800";
          const isActive = activeId === idx;

          return (
            <button
              key={row.poste}
              type="button"
              onClick={() => onSelect?.(idx)}
              className={cn(
                "group relative aspect-[5/4] rounded-lg border text-left transition-all",
                cls,
                isActive
                  ? "border-neutral-900 ring-2 ring-neutral-900/30 scale-[1.02]"
                  : "border-neutral-200/60 hover:border-neutral-400 hover:scale-[1.02]",
              )}
              title={`${row.poste} · ${pct > 0 ? "+" : ""}${pct.toFixed(1)}%`}
            >
              <div className={cn("absolute inset-0 p-2 flex flex-col justify-between", textCls)}>
                <span className="text-[9.5px] font-semibold uppercase tracking-tight leading-tight line-clamp-2">
                  {row.poste}
                </span>
                <span className="font-mono text-[12px] font-bold tabular-nums leading-none">
                  {pct > 0 ? "+" : ""}
                  {pct.toFixed(1)}%
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Legend() {
  return (
    <div className="hidden sm:flex items-center gap-3 text-[10px] text-neutral-500">
      <LegendBlock label="Sous théo" colors={NEGATIVE_SCALE} />
      <span className="text-neutral-300">|</span>
      <LegendBlock label="Sur théo" colors={POSITIVE_SCALE} />
    </div>
  );
}

function LegendBlock({ label, colors }) {
  return (
    <div className="flex items-center gap-1">
      <span className="font-semibold text-neutral-500">{label}</span>
      <div className="flex gap-px">
        {colors.map((c, i) => (
          <span key={i} className={cn("block w-3 h-3 rounded-sm", c)} />
        ))}
      </div>
    </div>
  );
}
