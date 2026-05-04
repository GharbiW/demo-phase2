"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";

const MODES = [
  { id: "both", label: "Prév. + Réel" },
  { id: "prev", label: "Prévision" },
  { id: "reel", label: "Réel" },
  { id: "gap", label: "Écart" },
];

/**
 * Mini graphique dual-série (k€) — fixtures `financeMonthlySeries`.
 */
export function ForecastVsActual({ series, className }) {
  const [mode, setMode] = useState("both");

  const { max, pathPrev, pathReel, pathGap } = useMemo(() => {
    const vals = [];
    series.forEach((m) => {
      vals.push(m.caPrev, m.margePrev, m.caReel, m.margeReel);
    });
    const maxV = Math.max(...vals, 1);
    const W = 280;
    const H = 96;
    const pad = 8;
    const n = series.length;
    const xAt = (i) => pad + (i / (n - 1 || 1)) * (W - pad * 2);
    const yAt = (v) => pad + (H - pad * 2) * (1 - v / maxV);

    const line = (keyCa, keyM) => {
      return series
        .map((m, i) => {
          const x = xAt(i);
          const y = yAt(m[keyCa] + m[keyM]);
          return `${i === 0 ? "M" : "L"} ${x} ${y}`;
        })
        .join(" ");
    };

    const gapPath = series
      .map((m, i) => {
        const x = xAt(i);
        const gap = m.caReel + m.margeReel - (m.caPrev + m.margePrev);
        const y = yAt(Math.max(0, gap + maxV * 0.25));
        return `${i === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");

    return {
      max: maxV,
      pathPrev: line("caPrev", "margePrev"),
      pathReel: line("caReel", "margeReel"),
      pathGap: gapPath,
    };
  }, [series]);

  return (
    <div className={cn("rounded-xl border border-neutral-200 bg-white p-4 shadow-sm", className)}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
            Prévision vs réel
          </p>
          <p className="text-xs text-neutral-500 mt-0.5">
            CA + marge (k€ / mois) — lecture directionnelle pour le comité rentabilité.
          </p>
        </div>
        <div className="flex flex-wrap gap-1">
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMode(m.id)}
              className={cn(
                "px-2.5 py-1 rounded-md text-[10px] font-semibold border transition-colors",
                mode === m.id
                  ? "bg-neutral-900 text-white border-neutral-900"
                  : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300",
              )}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>
      <svg viewBox="0 0 280 96" className="w-full h-28" aria-hidden>
        <line x1="8" y1="88" x2="272" y2="88" className="stroke-neutral-200" strokeWidth="1" />
        {(mode === "both" || mode === "prev") && (
          <path
            d={pathPrev}
            fill="none"
            className="stroke-neutral-400"
            strokeWidth="2"
            strokeDasharray="4 3"
          />
        )}
        {(mode === "both" || mode === "reel") && (
          <path
            d={pathReel}
            fill="none"
            className="stroke-[color:var(--color-parnass-red)]"
            strokeWidth="2.5"
          />
        )}
        {mode === "gap" && (
          <path
            d={pathGap}
            fill="none"
            className="stroke-emerald-600"
            strokeWidth="2"
          />
        )}
      </svg>
      <div className="flex flex-wrap gap-3 mt-2 text-[10px] text-neutral-500">
        <span className="inline-flex items-center gap-1">
          <span className="w-3 h-0.5 bg-neutral-400 border-dashed border-t border-neutral-400" />
          Prévision (pointillés)
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="w-3 h-0.5 bg-[color:var(--color-parnass-red)]" />
          Réel
        </span>
        <span className="ml-auto font-money tabular-nums">
          Max combiné : {max.toLocaleString("fr-FR")} k€
        </span>
      </div>
    </div>
  );
}
