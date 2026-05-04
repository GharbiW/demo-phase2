"use client";

import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/cn";

export function FilterBar({
  period,
  onPeriodChange,
  activity,
  onActivityChange,
}) {
  const periods = ["M-1", "M", "M-2", "YoY"];
  const activities = ["Toutes", "National", "Régional", "Express", "Frigo"];

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
          Filtres
        </div>
        <div className="mt-1 text-xs text-neutral-500">
          Démo — filtrage local (fake)
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-500">Période</span>
          {periods.map((p) => (
            <button
              key={p}
              type="button"
              className={cn(
                "h-8 px-3 rounded-full border text-xs font-medium transition-colors",
                period === p
                  ? "bg-neutral-900 border-neutral-900 text-white"
                  : "bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50",
              )}
              onClick={() => onPeriodChange?.(p)}
            >
              {p}
            </button>
          ))}
        </div>

        <div className="h-6 w-px bg-neutral-200 mx-1 hidden md:block" />

        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-500">Activité</span>
          <select
            className="h-8 rounded-full border border-neutral-200 bg-white px-3 text-xs text-neutral-700"
            value={activity}
            onChange={(e) => onActivityChange?.(e.target.value)}
          >
            {activities.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>

        <Badge variant="neutral">Local</Badge>
      </div>
    </div>
  );
}

