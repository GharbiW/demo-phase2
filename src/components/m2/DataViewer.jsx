"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { Badge } from "@/components/ui/Badge";
import { Copy, RefreshCw, ArrowUpDown, Search, Braces, Columns3 } from "lucide-react";

function inferType(v) {
  if (v === null || v === undefined) return "null";
  if (Array.isArray(v)) return "array";
  if (v instanceof Date) return "date";
  return typeof v;
}

function keyLabel(key) {
  return String(key).replaceAll("_", " ");
}

function looksLikeMoneyKey(k) {
  const key = String(k).toLowerCase();
  return (
    key.includes("salaire") ||
    key.includes("cout") ||
    key.includes("prix") ||
    key.includes("total") ||
    key.includes("montant") ||
    key.includes("tva") ||
    key.includes("peage") ||
    key.includes("ca")
  );
}

function fmtCell(key, value) {
  if (value === null || value === undefined) return "—";
  if (typeof value === "number") {
    if (looksLikeMoneyKey(key)) {
      // Heuristic: treat < 6 as unit price, else euros
      const isUnit = value > 0 && value < 10 && String(key).toLowerCase().includes("prix");
      const digits = isUnit ? 2 : 0;
      return `${value.toLocaleString("fr-FR", { maximumFractionDigits: digits })}${isUnit ? "" : " €"}`;
    }
    return value.toLocaleString("fr-FR", { maximumFractionDigits: 2 });
  }
  return String(value);
}

function computeSchema(rows, columns) {
  const schema = columns.map((c) => {
    let sample = null;
    for (const r of rows) {
      if (r && r[c] !== undefined && r[c] !== null) {
        sample = r[c];
        break;
      }
    }
    return {
      column: c,
      type: inferType(sample),
      example: sample,
      note: looksLikeMoneyKey(c) ? "Montant € (démo)" : null,
    };
  });
  return schema;
}

function headerTone(statut) {
  if (statut === "Existant") return "bg-emerald-50 border-emerald-200";
  if (statut === "CSV à normaliser" || statut === "Synchro irrégulière") return "bg-amber-50 border-amber-200";
  if (statut === "À connecter") return "bg-blue-50 border-blue-200";
  if (statut === "À intégrer") return "bg-violet-50 border-violet-200";
  return "bg-neutral-50 border-neutral-200";
}

export function DataViewer({
  source,
  records,
  ingestSample,
  onSimulateSync,
  onCopyJson,
}) {
  const [tab, setTab] = useState("data");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState({ key: null, dir: "desc" });

  const columns = useMemo(() => {
    if (ingestSample?.columns?.length) return ingestSample.columns;
    if (!records?.length) return [];
    const keys = new Set();
    records.forEach((r) => Object.keys(r || {}).forEach((k) => keys.add(k)));
    return Array.from(keys);
  }, [records, ingestSample]);

  const filtered = useMemo(() => {
    if (!records?.length) return [];
    const q = query.trim().toLowerCase();
    let out = records;
    if (q) {
      out = records.filter((r) => {
        const raw = JSON.stringify(r ?? {}).toLowerCase();
        return raw.includes(q);
      });
    }
    if (sort.key) {
      const dir = sort.dir === "asc" ? 1 : -1;
      out = [...out].sort((a, b) => {
        const av = a?.[sort.key];
        const bv = b?.[sort.key];
        if (av === bv) return 0;
        if (av === null || av === undefined) return 1 * dir;
        if (bv === null || bv === undefined) return -1 * dir;
        if (typeof av === "number" && typeof bv === "number") return (av - bv) * dir;
        return String(av).localeCompare(String(bv), "fr") * dir;
      });
    }
    return out;
  }, [records, query, sort]);

  const schema = useMemo(() => computeSchema(records || [], columns), [records, columns]);

  const lastIngest = ingestSample?.lastIngest;

  if (!source) {
    return (
      <section className="col-span-12 lg:col-span-8 bg-neutral-50 flex items-center justify-center p-10">
        <div className="max-w-md text-center">
          <div className="text-[11px] uppercase tracking-[0.2em] font-bold text-neutral-400 mb-2">
            Data viewer
          </div>
          <div className="text-lg font-semibold text-neutral-900">Sélectionnez une source</div>
          <p className="mt-1 text-sm text-neutral-500">
            À gauche : inventaire des connecteurs. À droite : les tables complètes « source of truth ».
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="col-span-12 lg:col-span-8 bg-neutral-50 flex flex-col min-h-0">
      <div className={cn("shrink-0 border-b p-4 bg-white", headerTone(source.statut))}>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-semibold text-neutral-950 tracking-tight truncate">{source.name}</h2>
              <Badge variant="neutral" size="sm" className="font-mono">
                {records?.length ?? 0} lignes
              </Badge>
              <Badge
                variant={
                  source.priorite === "Critique" ? "red" : source.priorite === "Élevée" ? "amber" : "neutral"
                }
                size="sm"
              >
                {source.priorite}
              </Badge>
              <Badge
                variant={
                  source.statut === "Existant"
                    ? "emerald"
                    : source.statut === "À connecter"
                      ? "blue"
                      : source.statut === "CSV à normaliser" || source.statut === "Synchro irrégulière"
                        ? "amber"
                        : "neutral"
                }
                size="sm"
              >
                {source.statut}
              </Badge>
            </div>
            <p className="text-[12px] text-neutral-600 mt-1 leading-relaxed">{source.note}</p>
            <div className="mt-2 flex items-center gap-2 text-[11px] text-neutral-500 flex-wrap">
              <span className="inline-flex items-center gap-1 rounded-md border border-neutral-200 bg-white px-2 py-0.5">
                <span className="text-neutral-400 font-semibold">Fréq.</span> {source.frequence}
              </span>
              {lastIngest ? (
                <span className="inline-flex items-center gap-1 rounded-md border border-neutral-200 bg-white px-2 py-0.5">
                  <span className="text-neutral-400 font-semibold">Dernier ingest</span> {lastIngest}
                </span>
              ) : null}
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <button
              type="button"
              onClick={onSimulateSync}
              className="inline-flex items-center gap-2 h-9 px-3 rounded-lg border border-neutral-200 bg-white text-sm font-semibold text-neutral-800 hover:bg-neutral-50"
            >
              <RefreshCw className="w-4 h-4 text-neutral-500" />
              Simuler synchro
            </button>
            <button
              type="button"
              onClick={() => onCopyJson?.(filtered)}
              className="inline-flex items-center gap-2 h-9 px-3 rounded-lg bg-neutral-900 text-white text-sm font-semibold hover:bg-neutral-800"
            >
              <Copy className="w-4 h-4" />
              Copier JSON
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-col md:flex-row md:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher dans les lignes… (full-text)"
              className="w-full h-10 rounded-xl border border-neutral-200 bg-white pl-10 pr-3 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-200"
            />
          </div>
          <div className="flex items-center gap-2">
            <TabButton active={tab === "data"} onClick={() => setTab("data")} icon={<Columns3 className="w-4 h-4" />} label="Données" />
            <TabButton active={tab === "schema"} onClick={() => setTab("schema")} icon={<ArrowUpDown className="w-4 h-4" />} label="Schéma" />
            <TabButton active={tab === "json"} onClick={() => setTab("json")} icon={<Braces className="w-4 h-4" />} label="JSON" />
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-auto p-4">
        {tab === "data" && (
          <DataTable
            columns={columns}
            rows={filtered}
            sort={sort}
            setSort={setSort}
          />
        )}
        {tab === "schema" && (
          <SchemaTable schema={schema} />
        )}
        {tab === "json" && (
          <JsonPanel value={filtered} onCopy={() => onCopyJson?.(filtered)} />
        )}
      </div>
    </section>
  );
}

function TabButton({ active, onClick, icon, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 h-9 px-3 rounded-xl border text-sm font-semibold transition-colors",
        active
          ? "border-neutral-900 bg-neutral-900 text-white"
          : "border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50",
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function DataTable({ columns, rows, sort, setSort }) {
  if (!rows?.length) {
    return (
      <div className="rounded-2xl border border-dashed border-neutral-200 bg-white p-10 text-center">
        <div className="text-sm font-semibold text-neutral-800">Aucune ligne</div>
        <div className="text-xs text-neutral-500 mt-1">Ajustez la recherche ou vérifiez le connecteur.</div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden">
      <div className="overflow-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-[5] bg-white border-b border-neutral-200">
            <tr>
              {columns.map((c) => {
                const active = sort.key === c;
                return (
                  <th key={c} className="px-3 py-2 text-left text-[11px] font-bold uppercase tracking-wider text-neutral-500 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => {
                        if (!active) setSort({ key: c, dir: "desc" });
                        else setSort({ key: c, dir: sort.dir === "desc" ? "asc" : "desc" });
                      }}
                      className={cn(
                        "inline-flex items-center gap-1.5 hover:text-neutral-800",
                        active && "text-neutral-900",
                      )}
                      title="Trier"
                    >
                      {keyLabel(c)}
                      <ArrowUpDown className={cn("w-3.5 h-3.5", active ? "opacity-100" : "opacity-40")} />
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {rows.map((r, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-neutral-50/40"}>
                {columns.map((c) => (
                  <td key={c} className={cn("px-3 py-2 align-top", looksLikeMoneyKey(c) && "font-mono tabular-nums")}>
                    {fmtCell(c, r?.[c])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SchemaTable({ schema }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-neutral-50 border-b border-neutral-200">
          <tr>
            <th className="px-3 py-2 text-left text-[11px] font-bold uppercase tracking-wider text-neutral-500">
              Colonne
            </th>
            <th className="px-3 py-2 text-left text-[11px] font-bold uppercase tracking-wider text-neutral-500">
              Type
            </th>
            <th className="px-3 py-2 text-left text-[11px] font-bold uppercase tracking-wider text-neutral-500">
              Exemple
            </th>
            <th className="px-3 py-2 text-left text-[11px] font-bold uppercase tracking-wider text-neutral-500">
              Note
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {schema.map((s) => (
            <tr key={s.column}>
              <td className="px-3 py-2 font-mono text-[12px] text-neutral-900">{s.column}</td>
              <td className="px-3 py-2">
                <Badge variant="neutral" size="sm">
                  {s.type}
                </Badge>
              </td>
              <td className="px-3 py-2 text-neutral-700">{s.example == null ? "—" : String(s.example)}</td>
              <td className="px-3 py-2 text-neutral-500 text-[12px]">{s.note || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function JsonPanel({ value, onCopy }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden">
      <div className="px-4 py-3 border-b border-neutral-100 flex items-center justify-between">
        <div className="text-sm font-semibold text-neutral-900">JSON brut (filtré)</div>
        <button
          type="button"
          onClick={onCopy}
          className="inline-flex items-center gap-2 h-8 px-3 rounded-lg border border-neutral-200 bg-white text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
        >
          <Copy className="w-3.5 h-3.5" />
          Copier
        </button>
      </div>
      <pre className="p-4 text-[12px] overflow-auto max-h-[520px] bg-neutral-950 text-neutral-100">
        {JSON.stringify(value ?? [], null, 2)}
      </pre>
    </div>
  );
}

