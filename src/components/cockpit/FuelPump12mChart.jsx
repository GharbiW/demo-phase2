"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cockpitFuelPump12m } from "@/lib/cockpit-mock-data";

export function FuelPump12mChart({ data = cockpitFuelPump12m }) {
  return (
    <div className="h-[260px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
          <XAxis dataKey="mois" tick={{ fontSize: 9 }} interval={1} angle={-20} textAnchor="end" height={44} />
          <YAxis tick={{ fontSize: 10 }} domain={["dataMin - 0.05", "dataMax + 0.05"]} tickFormatter={(v) => `${v.toFixed(2)} €`} width={44} />
          <Tooltip formatter={(v) => [`${Number(v).toFixed(3)} €`, ""]} contentStyle={{ borderRadius: 12, fontSize: 12 }} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Line type="monotone" dataKey="go" name="Gasoil" stroke="var(--cockpit-chart-ca, #2563eb)" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="gaz" name="Gaz" stroke="var(--cockpit-semantic-success, #059669)" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
