"use client";

import { cn } from "@/lib/cn";

/**
 * Sparkline SVG — valeurs normalisées 0..1 implicites via min/max.
 */
export function Sparkline({
  values,
  className,
  strokeClass = "stroke-[color:var(--color-parnass-red)]",
  height = 28,
  width = 72,
}) {
  if (!values?.length) return <div className={cn("h-7 w-[72px] rounded bg-neutral-100", className)} />;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const pad = 2;
  const w = width - pad * 2;
  const h = height - pad * 2;
  const pts = values.map((v, i) => {
    const x = pad + (i / (values.length - 1 || 1)) * w;
    const y = pad + h - ((v - min) / span) * h;
    return `${x},${y}`;
  });
  const d = `M ${pts.join(" L ")}`;
  return (
    <svg
      className={cn("shrink-0", className)}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden
    >
      <path
        d={d}
        fill="none"
        className={cn(strokeClass, "stroke-[1.75]")}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Génère une courbe démo stable à partir d'une graine numérique */
export function demoSparkFromSeed(seed, len = 6) {
  const out = [];
  let x = seed % 97;
  for (let i = 0; i < len; i++) {
    x = (x * 9301 + 49297) % 233280;
    out.push((x / 233280) * 40 + 60);
  }
  return out;
}
