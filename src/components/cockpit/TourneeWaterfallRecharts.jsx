"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

/**
 * Waterfall simplifié : CA → postes de variance (négatifs) → marge réelle.
 * Les postes affichent l'impact sur la marge (€).
 */
export function TourneeWaterfallRecharts({ tournee }) {
  if (!tournee) return null;

  const { ca, coutTheo, marge, ecart } = tournee;
  const margeTheoK = (ca - coutTheo) / 1000;
  const fuelK = (ecart?.carburant ?? 0) / 1000;
  const rhK = (ecart?.rh ?? 0) / 1000;
  const otherK = ((ecart?.peages ?? 0) + (ecart?.casse ?? 0)) / 1000;
  const margeK = marge / 1000;

  const data = [
    { name: "Marge théo.", value: margeTheoK, kind: "start" },
    { name: "Écart carburant", value: fuelK, kind: "neg" },
    { name: "Écart temps / HS", value: rhK, kind: "neg" },
    { name: "Péages & casse", value: otherK, kind: "neg" },
    { name: "Marge réelle", value: margeK, kind: "end" },
  ];

  const fmt = (v) => `${(v * 1000).toLocaleString("fr-FR", { maximumFractionDigits: 0 })} €`;

  return (
    <div className="h-[220px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-12} textAnchor="end" height={48} />
          <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${v.toFixed(1)} k€`} width={44} />
          <Tooltip
            formatter={(val) => [fmt(val), ""]}
            contentStyle={{ borderRadius: 12, fontSize: 12 }}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={48}>
            {data.map((entry, index) => {
              let fill = "var(--cockpit-semantic-info, #2563eb)";
              if (entry.kind === "neg") fill = "var(--cockpit-semantic-danger, #dc2626)";
              if (entry.kind === "end") fill = marge >= 0 ? "var(--cockpit-semantic-success, #059669)" : "var(--cockpit-semantic-danger, #dc2626)";
              return <Cell key={`cell-${index}`} fill={fill} />;
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
