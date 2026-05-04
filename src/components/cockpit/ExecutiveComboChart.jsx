"use client";

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cockpitExecutiveWeekly } from "@/lib/cockpit-mock-data";

export function ExecutiveComboChart({ data = cockpitExecutiveWeekly }) {
  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
          <XAxis dataKey="week" tick={{ fontSize: 10 }} />
          <YAxis yAxisId="left" tick={{ fontSize: 10 }} tickFormatter={(v) => `${v}`} width={32} />
          <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} width={32} />
          <Tooltip
            contentStyle={{ borderRadius: 12, fontSize: 12 }}
            formatter={(value, name) => [`${value} k€`, name === "ca" ? "CA" : "Marge nette"]}
          />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Bar yAxisId="left" dataKey="ca" name="CA" fill="var(--cockpit-chart-ca, #3b82f6)" radius={[4, 4, 0, 0]} maxBarSize={28} />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="margeNette"
            name="Marge nette"
            stroke="var(--cockpit-chart-marge, #059669)"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
