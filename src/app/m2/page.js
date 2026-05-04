"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { M2ZoneHeader } from "@/components/m2/M2ZoneHeader";
import { cn } from "@/lib/cn";
import { getM2Grille14HubTabs } from "@/lib/m2-grille-14-hub-data";
import {
  m2ConnectorsDemo,
  m2EtlSteps,
  m2Governance,
  m2HistorizationMonthlyVolume,
  m2HistorizationPolicy,
} from "@/lib/demo-data";
import { cockpitApiConnectors, cockpitQualityRejections } from "@/lib/cockpit-mock-data";
import {
  Activity,
  ChevronRight,
  Database,
  Grid3X3,
  History,
  ShieldAlert,
  Sparkles,
} from "lucide-react";

function formatHeaderKey(k) {
  return String(k)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function cellValue(v) {
  if (v === null || v === undefined) return "—";
  if (typeof v === "number" && Number.isFinite(v)) {
    if (Math.abs(v) >= 1000 && Number.isInteger(v)) return v.toLocaleString("fr-FR");
    return v.toLocaleString("fr-FR", { maximumFractionDigits: 2 });
  }
  if (typeof v === "boolean") return v ? "Oui" : "Non";
  return String(v);
}

export default function M2GrilleHubPage() {
  const tabs = useMemo(() => getM2Grille14HubTabs(), []);
  const [slug, setSlug] = useState(tabs[8]?.slug ?? tabs[0].slug);
  const active = tabs.find((t) => t.slug === slug) ?? tabs[0];
  const columns = useMemo(() => {
    const first = active.rows?.[0];
    if (!first || typeof first !== "object") return [];
    return Object.keys(first);
  }, [active.rows]);

  return (
    <div className="px-4 sm:px-6 py-6 max-w-[1680px] mx-auto space-y-5">
      <M2ZoneHeader
        eyebrow="M2 — Hub données & coûts"
        title="Grille 14 postes — données par onglet"
        subtitle="Un seul écran : chaque poste de la grille M3 affiche sa provenance (Factorial pour la paie, plateforme Parnass Phase 1 pour les 13 autres) et un extrait de lignes prêt pour l’API / le backoffice."
      >
        <Link
          href="/m3/grille-couts"
          className="inline-flex items-center gap-2 h-10 px-4 rounded-lg border border-neutral-200 bg-white text-sm font-semibold text-neutral-800 hover:bg-neutral-50"
        >
          <Grid3X3 className="w-4 h-4" />
          Cost Atlas M3
        </Link>
        <span className="inline-flex items-center gap-2 h-10 px-4 rounded-full border border-neutral-200 bg-white text-sm font-semibold text-neutral-800">
          <Sparkles className="w-4 h-4 text-[color:var(--color-parnass-red)]" />
          14 postes
        </span>
      </M2ZoneHeader>

      <details className="rounded-2xl border border-neutral-200 bg-white shadow-sm group">
        <summary className="cursor-pointer list-none flex items-center justify-between gap-3 px-4 py-3 sm:px-5">
          <span className="flex items-center gap-2 text-sm font-bold text-neutral-900">
            <Database className="w-4 h-4 text-neutral-500" />
            Synthèse flux (sources, connecteurs, monitoring, ETL, qualité)
          </span>
          <ChevronRight className="w-4 h-4 text-neutral-400 transition-transform group-open:rotate-90" />
        </summary>
        <div className="border-t border-neutral-100 px-4 py-4 sm:px-5 space-y-6">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-2">Connecteurs (spec M2)</p>
            <div className="overflow-x-auto rounded-xl border border-neutral-100">
              <table className="min-w-full text-xs">
                <thead className="bg-neutral-50 text-left text-neutral-600">
                  <tr>
                    <th className="px-3 py-2 font-semibold">Connecteur</th>
                    <th className="px-3 py-2 font-semibold">Protocole</th>
                    <th className="px-3 py-2 font-semibold">Statut</th>
                    <th className="px-3 py-2 font-semibold">Fréquence</th>
                    <th className="px-3 py-2 font-semibold">Owner</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {m2ConnectorsDemo.map((c) => (
                    <tr key={c.key} className="bg-white">
                      <td className="px-3 py-2 font-medium text-neutral-900">{c.name}</td>
                      <td className="px-3 py-2 text-neutral-600">{c.protocol}</td>
                      <td className="px-3 py-2 text-neutral-700">{c.status}</td>
                      <td className="px-3 py-2 text-neutral-600">{c.freq}</td>
                      <td className="px-3 py-2 text-neutral-600">{c.owner}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-2">Monitoring API (démo cockpit)</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
              {cockpitApiConnectors.map((c) => (
                <div
                  key={c.key}
                  className={cn(
                    "rounded-lg border px-3 py-2 text-[11px]",
                    c.status === "ok" ? "border-emerald-200 bg-emerald-50/40" : "border-amber-200 bg-amber-50/40",
                  )}
                >
                  <p className="font-bold text-neutral-900 truncate">{c.name}</p>
                  <p className="text-neutral-500 truncate">{c.vendor}</p>
                  <p className="mt-1 font-mono tabular-nums text-neutral-700">{c.volumeLabel}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-2 flex items-center gap-1">
                <Activity className="w-3.5 h-3.5" /> Pipeline ETL
              </p>
              <ul className="space-y-2 text-sm text-neutral-700">
                {m2EtlSteps.map((s) => (
                  <li key={s.step} className="flex gap-2">
                    <span className="text-emerald-600 font-bold shrink-0">{s.status === "ok" ? "✓" : "○"}</span>
                    <span>
                      <strong className="text-neutral-900">{s.step}</strong> {s.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-2 flex items-center gap-1">
                <History className="w-3.5 h-3.5" /> Historisation
              </p>
              <p className="text-sm text-neutral-700">
                {m2HistorizationPolicy.label} — {m2HistorizationPolicy.retentionMonths} mois · {m2HistorizationPolicy.sla}
              </p>
              <p className="text-xs text-neutral-500 mt-1">
                Dernier mois :{" "}
                <strong>{m2HistorizationMonthlyVolume[m2HistorizationMonthlyVolume.length - 1]?.lignes?.toLocaleString("fr-FR")}</strong>{" "}
                lignes ingérées (démo).
              </p>
            </div>
          </div>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-2 flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" /> Qualité & alertes (extraits)
            </p>
            <ul className="space-y-2 text-sm">
              {cockpitQualityRejections.map((r) => (
                <li key={r.id} className="rounded-lg border border-amber-100 bg-amber-50/50 px-3 py-2 text-neutral-800">
                  <span className="text-[10px] font-bold text-amber-800">{r.source}</span> — {r.message}
                  <span className="block text-[10px] text-neutral-500 mt-0.5">{r.detectedAt}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </details>

      <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-neutral-100 bg-neutral-50/80 px-2 py-2 overflow-x-auto">
          <div className="flex gap-1 min-w-max">
            {tabs.map((t) => (
              <button
                key={t.slug}
                type="button"
                onClick={() => setSlug(t.slug)}
                className={cn(
                  "shrink-0 rounded-lg px-2.5 py-2 text-[11px] sm:text-xs font-semibold transition-colors",
                  t.slug === slug
                    ? "bg-neutral-900 text-white shadow-sm"
                    : "text-neutral-600 hover:bg-white hover:text-neutral-900",
                )}
              >
                {t.tabShort}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 sm:p-5 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="min-w-0 space-y-2">
              <h2 className="text-lg sm:text-xl font-bold text-neutral-950 tracking-tight">{active.grid.poste}</h2>
              <p className="text-sm text-neutral-600">
                <span className="font-semibold text-neutral-800">{active.grid.type}</span> · {active.grid.methode}
              </p>
              <p className="text-xs text-neutral-500">
                Grille — source documentaire : <strong>{active.grid.source}</strong> · {active.grid.frequence}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 shrink-0">
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-3 py-1 text-xs font-bold border",
                  active.provenanceCanal === "factorial"
                    ? "border-violet-200 bg-violet-50 text-violet-900"
                    : "border-sky-200 bg-sky-50 text-sky-900",
                )}
              >
                {active.provenanceLabel}
              </span>
              <span className="inline-flex items-center rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-mono tabular-nums text-neutral-800">
                Théo {(active.grid.coutTheoMensuel / 1000).toLocaleString("fr-FR", { maximumFractionDigits: 1 })} k€/m
              </span>
              <span className="inline-flex items-center rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-mono tabular-nums text-neutral-900">
                Réel {(active.grid.coutReelMensuel / 1000).toLocaleString("fr-FR", { maximumFractionDigits: 1 })} k€/m
              </span>
            </div>
          </div>

          <p className="text-sm text-neutral-600 leading-relaxed border-l-2 border-[color:var(--color-parnass-red)] pl-3">
            {active.provenanceDetail}
          </p>

          <div className="rounded-xl border border-neutral-100 overflow-hidden">
            <div className="overflow-x-auto max-h-[min(52vh,560px)] overflow-y-auto">
              {columns.length === 0 ? (
                <p className="p-6 text-sm text-neutral-500">Aucune ligne de démonstration pour ce poste.</p>
              ) : (
                <table className="min-w-full text-xs">
                  <thead className="sticky top-0 z-[1] bg-neutral-100 text-left text-neutral-700 shadow-sm">
                    <tr>
                      {columns.map((col) => (
                        <th key={col} className="px-3 py-2 font-semibold whitespace-nowrap">
                          {formatHeaderKey(col)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {active.rows.map((row, ri) => (
                      <tr key={ri} className="bg-white hover:bg-neutral-50/80">
                        {columns.map((col) => (
                          <td key={col} className="px-3 py-2 text-neutral-800 whitespace-nowrap max-w-[220px] truncate">
                            {cellValue(row[col])}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm p-4 sm:p-5">
        <h3 className="text-sm font-bold text-neutral-900 mb-3">Gouvernance data (RACI synthétique)</h3>
        <div className="overflow-x-auto rounded-lg border border-neutral-100">
          <table className="min-w-full text-xs">
            <thead className="bg-neutral-50 text-left text-neutral-600">
              <tr>
                <th className="px-3 py-2 font-semibold">Domaine</th>
                <th className="px-3 py-2 font-semibold">Source</th>
                <th className="px-3 py-2 font-semibold">Owner</th>
                <th className="px-3 py-2 font-semibold">Fréquence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {m2Governance.map((g, i) => (
                <tr key={i} className="bg-white">
                  <td className="px-3 py-2 font-medium text-neutral-900">{g.domaine}</td>
                  <td className="px-3 py-2 text-neutral-600">{g.source}</td>
                  <td className="px-3 py-2 text-neutral-600">{g.owner}</td>
                  <td className="px-3 py-2 text-neutral-600">{g.frequence}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
