"use client";

import { useMemo, useState } from "react";
import { PageShell } from "@/components/ui/PageShell";
import Toast from "@/components/ui/Toast";
import { CostCard } from "@/components/m3/CostCard";
import { DriftHeatmap } from "@/components/m3/DriftHeatmap";
import { AiInsightBanner } from "@/components/ui/AiInsightBanner";
import { m3CostGrid, m3TheoreticalInputs } from "@/lib/demo-data";
import { cockpitCostStandardsDefaults } from "@/lib/cockpit-mock-data";
import {
  Save, ArrowRight, Flame, TrendingUp, TrendingDown,
  ChevronDown, Filter, ArrowDownAZ, Settings2, Info,
  BarChart2, AlertTriangle, CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/cn";

const TYPE_FILTERS = [
  { key: "all", label: "Tous", color: "bg-neutral-100 text-neutral-700 border-neutral-200" },
  { key: "Fixe", label: "Fixe", color: "bg-slate-100 text-slate-700 border-slate-200" },
  { key: "Variable", label: "Variable", color: "bg-amber-50 text-amber-800 border-amber-200" },
  { key: "Semi-var.", label: "Semi-var.", color: "bg-sky-50 text-sky-700 border-sky-200" },
  { key: "Var. lissé", label: "Var. lissé", color: "bg-violet-50 text-violet-700 border-violet-200" },
  { key: "Exceptionnel", label: "Exceptionnel", color: "bg-rose-50 text-rose-700 border-rose-200" },
];

const SORTS = [
  { key: "drift-desc", label: "Dérive (forte → faible)" },
  { key: "drift-abs", label: "Dérive absolue (€)" },
  { key: "size", label: "Taille du poste" },
  { key: "alpha", label: "Alphabétique" },
];

const fmtKEur = (v, signed = false) => {
  const sign = signed ? (v > 0 ? "+" : v < 0 ? "−" : "") : "";
  return `${sign}${(Math.abs(v) / 1000).toLocaleString("fr-FR", { maximumFractionDigits: 1 })} k€`;
};

const POSTE_HINTS = {
  "Salaires & charges RH": "H1 — diviseur jours à arbitrer",
};

const TYPE_DOT_COLORS = {
  Fixe: "bg-slate-400",
  Variable: "bg-amber-500",
  "Semi-var.": "bg-sky-500",
  "Var. lissé": "bg-violet-500",
  Exceptionnel: "bg-rose-500",
};

export default function GrilleCoutsPage() {
  const [grid, setGrid] = useState(m3CostGrid);
  const [toast, setToast] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortKey, setSortKey] = useState("drift-desc");
  const [showStandards, setShowStandards] = useState(false);

  const [stdRh, setStdRh] = useState(() => cockpitCostStandardsDefaults.rh.map((r) => ({ ...r })));
  const [stdMat, setStdMat] = useState(() => cockpitCostStandardsDefaults.materiel.map((r) => ({ ...r })));
  const [stdFuel, setStdFuel] = useState(() =>
    cockpitCostStandardsDefaults.carburantTheo.map((r) => ({ ...r })),
  );

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  };

  const totals = useMemo(() => {
    const t = grid.reduce((s, g) => s + g.coutTheoMensuel, 0);
    const r = grid.reduce((s, g) => s + g.coutReelMensuel, 0);
    return { theo: t, reel: r, delta: r - t, pct: t ? ((r - t) / t) * 100 : 0 };
  }, [grid]);

  const totalDeltaAbs = useMemo(
    () => grid.reduce((s, g) => s + Math.abs(g.coutReelMensuel - g.coutTheoMensuel), 0),
    [grid],
  );

  const visibleRows = useMemo(() => {
    let arr = grid.map((row, idx) => ({ ...row, idx }));
    if (typeFilter !== "all") arr = arr.filter((r) => r.type === typeFilter);
    arr.sort((a, b) => {
      const dA = (a.coutReelMensuel - a.coutTheoMensuel) / (a.coutTheoMensuel || 1);
      const dB = (b.coutReelMensuel - b.coutTheoMensuel) / (b.coutTheoMensuel || 1);
      const aA = Math.abs(a.coutReelMensuel - a.coutTheoMensuel);
      const aB = Math.abs(b.coutReelMensuel - b.coutTheoMensuel);
      switch (sortKey) {
        case "drift-desc": return Math.abs(dB) - Math.abs(dA);
        case "drift-abs": return aB - aA;
        case "size": return b.coutReelMensuel - a.coutReelMensuel;
        case "alpha": return a.poste.localeCompare(b.poste, "fr");
        default: return 0;
      }
    });
    return arr;
  }, [grid, typeFilter, sortKey]);

  const counts = useMemo(() => {
    const c = { all: grid.length };
    for (const r of grid) c[r.type] = (c[r.type] || 0) + 1;
    return c;
  }, [grid]);

  const topDerives = useMemo(() => {
    return [...grid]
      .map((row, idx) => ({
        ...row, idx,
        delta: row.coutReelMensuel - row.coutTheoMensuel,
        pct: row.coutTheoMensuel ? ((row.coutReelMensuel - row.coutTheoMensuel) / row.coutTheoMensuel) * 100 : 0,
      }))
      .filter((r) => r.delta > 0)
      .sort((a, b) => b.delta - a.delta)
      .slice(0, 3);
  }, [grid]);

  const driftSegments = useMemo(() => {
    const denom = Math.max(totalDeltaAbs, 1);
    const groups = {};
    for (const r of grid) {
      const d = Math.abs(r.coutReelMensuel - r.coutTheoMensuel);
      groups[r.type] = (groups[r.type] || 0) + d;
    }
    return Object.entries(groups)
      .filter(([, v]) => v > 0)
      .map(([type, v]) => ({
        type,
        share: (v / denom) * 100,
        color: TYPE_DOT_COLORS[type] || "bg-neutral-400",
        amount: v,
      }))
      .sort((a, b) => b.share - a.share);
  }, [grid, totalDeltaAbs]);

  const handleSave = (idx, field, val) => {
    const numVal = parseFloat(String(val).replace(",", ".")) || 0;
    setGrid((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: numVal };
      return next;
    });
    const lbl = field === "coutTheoMensuel" ? "Théorique" : "Réel";
    showToast(`✓ ${grid[idx].poste} — ${lbl} mis à jour`);
  };

  const isOver = totals.delta > 0;

  return (
    <PageShell
      moduleLabel="Module 3 · Cost Engine"
      title="Cost Atlas — Grille 13 postes"
      description="Réconciliation théorique vs réel. Chaque poste est une carte explorable — pas une ligne d'Excel."
      bare
      actions={
        <>
          <span className="hidden md:inline-flex items-center gap-1.5 h-9 px-3 rounded-full border border-neutral-200 bg-white text-xs font-semibold text-neutral-600 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Mars 2026 · M-1
          </span>
          <button
            onClick={() => showToast("✓ Grille sauvegardée — recalcul Cost Engine en cours…")}
            className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-[#E80912] hover:bg-[#c7080f] text-white text-sm font-semibold transition-colors shadow-sm"
          >
            <Save className="w-4 h-4" />
            Sauvegarder
          </button>
        </>
      }
    >
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      <div className="space-y-5">

        {/* ── Reconciliation Panel ─────────────────────────────────── */}
        <section className="rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
          {/* Top bar */}
          <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-neutral-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
                <BarChart2 className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-neutral-400">Réconciliation du mois</p>
                <p className="text-sm font-semibold text-neutral-900">13 postes · base mensuelle</p>
              </div>
            </div>
            <div className={cn(
              "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border",
              isOver
                ? "bg-red-50 text-red-700 border-red-200"
                : "bg-emerald-50 text-emerald-700 border-emerald-200"
            )}>
              {isOver ? <AlertTriangle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
              {isOver ? "Surcoût constaté" : "Sous le budget"}
            </div>
          </div>

          {/* Three KPI blocks */}
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-neutral-100">
            {/* Théorique */}
            <div className="px-6 py-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">Théorique</span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl font-bold text-neutral-900 tabular-nums font-mono">
                  {(totals.theo / 1000).toLocaleString("fr-FR", { maximumFractionDigits: 0 })}
                </span>
                <span className="text-lg font-semibold text-neutral-400">k€</span>
              </div>
              <p className="mt-2 text-xs text-neutral-500 leading-relaxed">
                Coût attendu si le mois s&apos;était passé comme la grille.
              </p>
              <div className="mt-3 h-1.5 rounded-full bg-blue-100 overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: "100%" }} />
              </div>
            </div>

            {/* Delta */}
            <div className={cn(
              "px-6 py-5 flex flex-col items-center justify-center text-center",
              isOver ? "bg-red-50/60" : "bg-emerald-50/60"
            )}>
              <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-3">
                Écart à expliquer
              </p>
              <div className="flex items-center gap-2 mb-1">
                {isOver
                  ? <TrendingUp className="w-5 h-5 text-red-500" />
                  : <TrendingDown className="w-5 h-5 text-emerald-600" />
                }
                <span className={cn(
                  "text-4xl font-bold tabular-nums font-mono",
                  isOver ? "text-red-600" : "text-emerald-700"
                )}>
                  {totals.delta > 0 ? "+" : "−"}{(Math.abs(totals.delta) / 1000).toLocaleString("fr-FR", { maximumFractionDigits: 1 })} k€
                </span>
              </div>
              <span className={cn(
                "mt-1 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border",
                isOver ? "bg-red-100 text-red-700 border-red-200" : "bg-emerald-100 text-emerald-700 border-emerald-200"
              )}>
                {totals.pct > 0 ? "+" : ""}{totals.pct.toFixed(1)}% vs théorique
              </span>
            </div>

            {/* Réel */}
            <div className="px-6 py-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">Réel constaté</span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl font-bold text-neutral-900 tabular-nums font-mono">
                  {(totals.reel / 1000).toLocaleString("fr-FR", { maximumFractionDigits: 0 })}
                </span>
                <span className="text-lg font-semibold text-neutral-400">k€</span>
              </div>
              <p className="mt-2 text-xs text-neutral-500 leading-relaxed">
                Mesuré à partir des flux M2 — AS24, paie, garage, télématique.
              </p>
              <div className="mt-3 h-1.5 rounded-full bg-emerald-100 overflow-hidden">
                <div
                  className={cn("h-full rounded-full", isOver ? "bg-red-400" : "bg-emerald-500")}
                  style={{ width: `${Math.min(100, (totals.reel / totals.theo) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Composition bar */}
          <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/60">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-neutral-500">Composition de la dérive par type</span>
              <span className="text-xs font-semibold text-neutral-700 tabular-nums">{fmtKEur(totalDeltaAbs)} cumulés</span>
            </div>
            <div className="h-2.5 rounded-full bg-neutral-200 overflow-hidden flex gap-px">
              {driftSegments.map((s) => (
                <span
                  key={s.type}
                  className={cn("h-full first:rounded-l-full last:rounded-r-full", s.color)}
                  style={{ width: `${s.share}%` }}
                  title={`${s.type} · ${fmtKEur(s.amount)} (${s.share.toFixed(0)}%)`}
                />
              ))}
            </div>
            <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1.5">
              {driftSegments.map((s) => (
                <span key={s.type} className="inline-flex items-center gap-1.5 text-xs text-neutral-600">
                  <span className={cn("inline-block w-2 h-2 rounded-full shrink-0", s.color)} />
                  <span className="font-medium">{s.type}</span>
                  <span className="text-neutral-400 tabular-nums">{s.share.toFixed(0)}%</span>
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── Top 3 dérives ──────────────────────────────────────── */}
        {topDerives.length > 0 && (
          <section>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center">
                <Flame className="w-3.5 h-3.5 text-orange-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-900">Les 3 postes qui dérapent le plus</p>
                <p className="text-xs text-neutral-500">Cliquer pour ouvrir la carte correspondante</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {topDerives.map((row, rank) => (
                <button
                  key={row.poste}
                  type="button"
                  onClick={() => {
                    setExpanded(row.idx);
                    document.getElementById(`cost-${row.idx}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
                  }}
                  className="group rounded-xl border border-neutral-200 bg-white p-4 text-left hover:border-red-200 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#E80912] text-white text-[11px] font-bold shrink-0">
                      {rank + 1}
                    </span>
                    <span className="text-xs font-bold text-red-600 tabular-nums bg-red-50 border border-red-100 px-2 py-0.5 rounded-full">
                      {row.pct > 0 ? "+" : ""}{row.pct.toFixed(1)}%
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-neutral-900 leading-snug mb-1">{row.poste}</p>
                  <div className="flex items-baseline gap-1.5 mb-2">
                    <span className="text-xl font-bold text-red-600 tabular-nums font-mono">
                      {fmtKEur(row.delta, true)}
                    </span>
                    <span className="text-xs text-neutral-400">vs théo</span>
                  </div>
                  {/* Mini progress */}
                  <div className="h-1 rounded-full bg-red-100 overflow-hidden">
                    <div
                      className="h-full bg-red-400 rounded-full transition-all"
                      style={{ width: `${Math.min(100, Math.abs(row.pct) * 3)}%` }}
                    />
                  </div>
                  <div className="mt-2.5 flex items-center gap-1 text-xs text-[#E80912] font-semibold group-hover:gap-2 transition-all">
                    Inspecter <ArrowRight className="w-3 h-3" />
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* ── Heatmap ─────────────────────────────────────────────── */}
        <DriftHeatmap
          rows={grid}
          activeId={expanded}
          onSelect={(idx) => {
            setExpanded((v) => (v === idx ? null : idx));
            document.getElementById(`cost-${idx}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
          }}
        />

        {/* ── AI insight ──────────────────────────────────────────── */}
        <AiInsightBanner
          label="IA — Carburant +10.7% vs théorique · révision recommandée"
          insight="Le poste « Carburant tracteur » dépasse de 10.7% le théorique (157 k€ vs 142 k€). Pattern de surconsommation cohérent avec deux véhicules au-delà du seuil km. Action suggérée : revoir le standard GO et planifier les révisions AB-421-PL et IJ-556-PL."
          confidence={91}
          action={{ label: "Voir recommandations IA", href: "/m6/recommandations" }}
        />

        {/* ── Hypothesis note ─────────────────────────────────────── */}
        <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3.5">
          <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
          <p className="text-sm text-blue-800 leading-relaxed">
            <strong>H1 — Hypothèse en attente :</strong> diviseur jours ouvrés (21 ou 26) à arbitrer pour le calcul RH. La carte « Salaires &amp; charges RH » sera réajustée après validation.
          </p>
        </div>

        {/* ── Atlas — filters + cards ─────────────────────────────── */}
        <section>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-4 p-4 rounded-xl border border-neutral-200 bg-white shadow-sm">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-0.5">Atlas des coûts</p>
              <p className="text-sm font-semibold text-neutral-900">
                {visibleRows.length} poste{visibleRows.length > 1 ? "s" : ""}
                <span className="text-neutral-400 font-normal"> · cliquez pour éditer théo / réel</span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-1 text-xs text-neutral-500 mr-1">
                <Filter className="w-3.5 h-3.5" />
                <span className="font-semibold">Type</span>
              </div>
              {TYPE_FILTERS.map((f) => {
                const active = typeFilter === f.key;
                const c = counts[f.key] ?? 0;
                if (f.key !== "all" && c === 0) return null;
                return (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => setTypeFilter(f.key)}
                    className={cn(
                      "inline-flex items-center gap-1.5 h-7 px-2.5 rounded-full border text-[11px] font-semibold transition-all",
                      active
                        ? "border-neutral-900 bg-neutral-900 text-white shadow-sm"
                        : f.color + " hover:border-neutral-300",
                    )}
                  >
                    <span>{f.label}</span>
                    <span className={cn(
                      "rounded-full px-1.5 text-[10px] font-bold tabular-nums",
                      active ? "bg-white/20 text-white" : "bg-white/80 text-neutral-600",
                    )}>
                      {c}
                    </span>
                  </button>
                );
              })}

              <div className="ml-1 inline-flex items-center gap-1.5 h-7 pl-2.5 pr-2 rounded-full border border-neutral-200 bg-white text-[11px] font-semibold text-neutral-700">
                <ArrowDownAZ className="w-3.5 h-3.5 text-neutral-400" />
                <select
                  value={sortKey}
                  onChange={(e) => setSortKey(e.target.value)}
                  className="bg-transparent text-[11px] font-semibold focus:outline-none cursor-pointer"
                >
                  {SORTS.map((s) => (
                    <option key={s.key} value={s.key}>{s.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {visibleRows.map((row) => (
              <div key={row.poste} id={`cost-${row.idx}`}>
                <CostCard
                  row={row}
                  totalReel={totals.reel}
                  expanded={expanded === row.idx}
                  hint={POSTE_HINTS[row.poste]}
                  onToggle={() => setExpanded((v) => (v === row.idx ? null : row.idx))}
                  onSave={(field, val) => handleSave(row.idx, field, val)}
                />
              </div>
            ))}
          </div>
        </section>

        {/* ── Standards (collapsible) ─────────────────────────────── */}
        <section className="rounded-xl border border-neutral-200 bg-white overflow-hidden">
          <button
            type="button"
            onClick={() => setShowStandards((v) => !v)}
            className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-neutral-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="inline-flex w-8 h-8 rounded-lg bg-neutral-100 border border-neutral-200 text-neutral-600 items-center justify-center shrink-0">
                <Settings2 className="w-4 h-4" />
              </span>
              <div>
                <p className="text-sm font-semibold text-neutral-900">Standards de calcul (RH · Matériel · Carburant)</p>
                <p className="text-xs text-neutral-500 mt-0.5">Hypothèses qui alimentent les coûts théoriques.</p>
              </div>
            </div>
            <span className="flex items-center gap-1 text-xs font-semibold text-neutral-500 shrink-0">
              {showStandards ? "Replier" : "Déplier"}
              <ChevronDown className={cn("w-4 h-4 transition-transform", showStandards && "rotate-180")} />
            </span>
          </button>

          {showStandards && (
            <div className="border-t border-neutral-100 px-5 py-5 space-y-6">
              <StandardsBlock title="RH — forfait journalier" desc="Coût employeur par jour (salaire + charges + congés).">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {stdRh.map((row) => (
                    <StandardInput
                      key={row.id} label={row.role} value={row.dailyEUR} suffix="€/j"
                      onChange={(v) => setStdRh((s) => s.map((x) => (x.id === row.id ? { ...x, dailyEUR: v } : x)))}
                    />
                  ))}
                </div>
              </StandardsBlock>

              <StandardsBlock title="Matériel — loyer / 26 j" desc="Loyers d'équipement répartis sur 26 jours ouvrés.">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {stdMat.map((row) => (
                    <StandardInput
                      key={row.id} label={row.label} value={row.monthlyRent} suffix="€/mois"
                      hint={`${row.dailyEUR.toFixed(0)} €/j`}
                      onChange={(v) =>
                        setStdMat((s) =>
                          s.map((x) => x.id === row.id ? { ...x, monthlyRent: v, dailyEUR: Math.round((v / 26) * 100) / 100 } : x)
                        )
                      }
                    />
                  ))}
                </div>
              </StandardsBlock>

              <StandardsBlock title="Carburant théorique" desc="Consommations standards pour le calcul du coût théorique.">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {stdFuel.map((row) => (
                    <StandardInput
                      key={row.id} label={row.label}
                      value={row.lPer100 ?? row.kgPer100}
                      suffix={row.lPer100 !== undefined ? "L/100" : "kg/100"}
                      step={0.1}
                      onChange={(v) =>
                        setStdFuel((s) =>
                          s.map((x) =>
                            x.id === row.id
                              ? row.lPer100 !== undefined ? { ...x, lPer100: v } : { ...x, kgPer100: v }
                              : x
                          )
                        )
                      }
                    />
                  ))}
                </div>
              </StandardsBlock>

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={() => showToast("✓ Standards enregistrés — recalcul théorique en cours…")}
                  className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-neutral-900 text-white text-sm font-semibold hover:bg-neutral-800 transition-colors"
                >
                  Mettre à jour les standards
                </button>
              </div>
            </div>
          )}
        </section>

        {/* ── Theoretical inputs ─────────────────────────────────── */}
        <section className="rounded-xl border border-neutral-200 bg-white p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-3">
            Inputs théoriques de référence
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {Object.entries(m3TheoreticalInputs).map(([k, v]) => (
              <div key={k} className="rounded-lg border border-neutral-100 bg-neutral-50 px-3 py-2.5">
                <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">{k}</div>
                <div className="text-xs text-neutral-700 mt-0.5 leading-snug font-medium">{v}</div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </PageShell>
  );
}

// ── Standards subcomponents ─────────────────────────────────────────

function StandardsBlock({ title, desc, children }) {
  return (
    <div>
      <div className="mb-3">
        <p className="text-xs font-bold uppercase tracking-wider text-neutral-700">{title}</p>
        <p className="text-xs text-neutral-500 mt-0.5">{desc}</p>
      </div>
      {children}
    </div>
  );
}

function StandardInput({ label, value, suffix, hint, step = 1, onChange }) {
  return (
    <label className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-white px-3 py-2.5 hover:border-neutral-300 transition-colors cursor-pointer">
      <span className="flex-1 min-w-0">
        <span className="block text-xs font-medium text-neutral-800 truncate">{label}</span>
        {hint && <span className="block text-[10px] text-neutral-400 mt-0.5">{hint}</span>}
      </span>
      <span className="flex items-center gap-1.5 shrink-0">
        <input
          type="number"
          step={step}
          value={value}
          onChange={(e) => onChange?.(Number(e.target.value))}
          className="w-24 h-8 rounded-md border border-neutral-200 bg-neutral-50 px-2 font-mono text-right text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-colors"
        />
        <span className="text-[10px] text-neutral-500 font-semibold w-12">{suffix}</span>
      </span>
    </label>
  );
}
