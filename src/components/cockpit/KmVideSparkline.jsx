"use client";

import { Line, LineChart, ResponsiveContainer, YAxis } from "recharts";

const DATA = [
  { i: 0, v: 7.1 },
  { i: 1, v: 7.4 },
  { i: 2, v: 7.8 },
  { i: 3, v: 8.2 },
];

export function KmVideSparkline() {
  return (
    <div className="h-10 w-full mt-2">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={DATA} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
          <YAxis domain={["dataMin - 0.5", "dataMax + 0.3"]} hide />
          <Line type="monotone" dataKey="v" stroke="var(--cockpit-semantic-danger, #dc2626)" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
