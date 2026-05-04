"use client";

import { useMemo } from "react";
import { cn } from "@/lib/cn";
import { Badge } from "@/components/ui/Badge";
import { Database, FileSpreadsheet, Link2, AlertTriangle, CheckCircle2 } from "lucide-react";

const STATUS_STYLE = {
  Existant: { ribbon: "bg-emerald-500", badge: "emerald", label: "Existant" },
  "À connecter": { ribbon: "bg-blue-500", badge: "blue", label: "À connecter" },
  "CSV à normaliser": { ribbon: "bg-amber-500", badge: "amber", label: "CSV" },
  "Synchro irrégulière": { ribbon: "bg-amber-500", badge: "amber", label: "Irrégulier" },
  "À évaluer": { ribbon: "bg-neutral-400", badge: "neutral", label: "À évaluer" },
  Manuel: { ribbon: "bg-neutral-400", badge: "neutral", label: "Manuel" },
  "À intégrer": { ribbon: "bg-violet-500", badge: "blue", label: "À intégrer" },
};

const PRIO_STYLE = {
  Critique: { badge: "red", icon: <AlertTriangle className="w-3 h-3" /> },
  "Élevée": { badge: "amber", icon: <AlertTriangle className="w-3 h-3" /> },
  Moyenne: { badge: "neutral", icon: <CheckCircle2 className="w-3 h-3" /> },
};

function SourceIcon({ statut }) {
  if (statut === "Existant") return <Database className="w-4 h-4" />;
  if (statut === "CSV à normaliser") return <FileSpreadsheet className="w-4 h-4" />;
  return <Link2 className="w-4 h-4" />;
}

export function SourceList({
  sources,
  selectedName,
  onSelect,
  search,
  setSearch,
  statutFilter,
  setStatutFilter,
  prioFilter,
  setPrioFilter,
  ingestSamples,
  recordsBySource,
}) {
  const stats = useMemo(() => {
    const total = sources.length;
    const existants = sources.filter((s) => s.statut === "Existant").length;
    const critiques = sources.filter((s) => s.priorite === "Critique").length;
    const aBrancher = total - existants;
    return { total, existants, aBrancher, critiques };
  }, [sources]);

  const filtered = useMemo(() => {
    const q = (search || "").trim().toLowerCase();
    return sources.filter((s) => {
      if (statutFilter !== "Tous" && s.statut !== statutFilter) return false;
      if (prioFilter !== "Toutes" && s.priorite !== prioFilter) return false;
      if (!q) return true;
      return (
        s.name.toLowerCase().includes(q) ||
        s.note?.toLowerCase().includes(q) ||
        s.frequence?.toLowerCase().includes(q)
      );
    });
  }, [sources, search, statutFilter, prioFilter]);

  const statutOptions = useMemo(() => {
    const set = new Set(sources.map((s) => s.statut));
    return ["Tous", ...Array.from(set)];
  }, [sources]);

  return (
    <aside className="col-span-12 lg:col-span-4 border-r border-neutral-200 bg-white flex flex-col min-h-0">
      <div className="shrink-0 px-4 py-4 border-b border-neutral-200">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">
              Source of truth
            </p>
            <h2 className="text-sm font-semibold text-neutral-950">Hub données — Sources</h2>
          </div>
          <div className="text-right">
            <div className="text-[11px] font-mono font-bold tabular-nums text-neutral-900">
              {stats.total}
            </div>
            <div className="text-[10px] text-neutral-500">sources</div>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-4 gap-2">
          {[
            { k: "existants", label: "Actifs", value: stats.existants, tone: "text-emerald-700 bg-emerald-50 border-emerald-200" },
            { k: "aBrancher", label: "À brancher", value: stats.aBrancher, tone: "text-blue-700 bg-blue-50 border-blue-200" },
            { k: "critiques", label: "Critiques", value: stats.critiques, tone: "text-red-700 bg-red-50 border-red-200" },
            { k: "total", label: "Total", value: stats.total, tone: "text-neutral-700 bg-neutral-50 border-neutral-200" },
          ].map((s) => (
            <div key={s.k} className={cn("rounded-lg border px-2 py-1.5", s.tone)}>
              <div className="text-[10px] uppercase tracking-wide font-bold opacity-80">{s.label}</div>
              <div className="font-mono font-extrabold tabular-nums">{s.value}</div>
            </div>
          ))}
        </div>

        <div className="mt-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher source, note, fréquence…"
            className="w-full h-9 rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-200"
          />
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <select
            value={statutFilter}
            onChange={(e) => setStatutFilter(e.target.value)}
            className="h-8 rounded-lg border border-neutral-200 bg-neutral-50 px-2 text-xs font-semibold text-neutral-700 focus:outline-none"
          >
            {statutOptions.map((o) => (
              <option key={o} value={o}>
                Statut: {o}
              </option>
            ))}
          </select>
          <select
            value={prioFilter}
            onChange={(e) => setPrioFilter(e.target.value)}
            className="h-8 rounded-lg border border-neutral-200 bg-neutral-50 px-2 text-xs font-semibold text-neutral-700 focus:outline-none"
          >
            {["Toutes", "Critique", "Élevée", "Moyenne"].map((o) => (
              <option key={o} value={o}>
                Priorité: {o}
              </option>
            ))}
          </select>
          <div className="ml-auto text-[11px] text-neutral-500">
            {filtered.length} résultat{filtered.length !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-auto">
        <div className="divide-y divide-neutral-100">
          {filtered.map((s) => {
            const st = STATUS_STYLE[s.statut] || STATUS_STYLE["À connecter"];
            const pr = PRIO_STYLE[s.priorite] || PRIO_STYLE.Moyenne;
            const isActive = selectedName === s.name;
            const lastIngest = ingestSamples?.[s.name]?.lastIngest;
            const recordCount = Array.isArray(recordsBySource?.[s.name])
              ? recordsBySource[s.name].length
              : 0;

            return (
              <button
                key={s.name}
                type="button"
                onClick={() => onSelect?.(s.name)}
                className={cn(
                  "relative w-full text-left px-4 py-3 transition-colors",
                  isActive ? "bg-neutral-50" : "hover:bg-neutral-50/80",
                )}
              >
                <span className={cn("absolute left-0 top-0 bottom-0 w-1", st.ribbon)} aria-hidden />

                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-neutral-900 text-white flex items-center justify-center shrink-0">
                      <SourceIcon statut={s.statut} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-neutral-950 truncate">{s.name}</p>
                        <Badge variant={st.badge} size="sm">
                          {st.label}
                        </Badge>
                        <Badge variant={pr.badge} size="sm" className="inline-flex items-center gap-1">
                          {pr.icon}
                          {s.priorite}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-neutral-500 mt-0.5 truncate">{s.note}</p>
                      <div className="mt-2 flex items-center gap-2 text-[10px] text-neutral-500 flex-wrap">
                        <span className="inline-flex items-center gap-1 rounded-md border border-neutral-200 bg-white px-1.5 py-0.5">
                          <span className="text-neutral-400 font-semibold">Fréq.</span> {s.frequence}
                        </span>
                        {lastIngest ? (
                          <span className="inline-flex items-center gap-1 rounded-md border border-neutral-200 bg-white px-1.5 py-0.5">
                            <span className="text-neutral-400 font-semibold">Dernier</span> {lastIngest}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="font-mono text-[12px] font-bold text-neutral-900 tabular-nums">
                      {recordCount}
                    </div>
                    <div className="text-[10px] text-neutral-500">lignes</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

