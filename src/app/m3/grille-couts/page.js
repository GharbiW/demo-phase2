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
  Save,
  ArrowRight,
  Flame,
  TrendingUp,
  TrendingDown,
  ChevronDown,
  Filter,
  ArrowDownAZ,
  Settings2,
  Info,
} from "lucide-react";
import { cn } from "@/lib/cn";

const TYPE_FILTERS = [
  { key: "all", label: "Tous", color: "bg-neutral-100 text-neutral-700 border-neutral-300" },
  { key: "Fixe", label: "Fixe", color: "bg-slate-50 text-slate-700 border-slate-200" },
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

const fmtEur = (v) => `${v.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} €`;

const POSTE_HINTS = {
  "Salaires & charges RH": "H1 — diviseur jours à arbitrer",
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
        case "drift-desc":
          return Math.abs(dB) - Math.abs(dA);
        case "drift-abs":
          return aB - aA;
        case "size":
          return b.coutReelMensuel - a.coutReelMensuel;
        case "alpha":
          return a.poste.localeCompare(b.poste, "fr");
        default:
          return 0;
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
        ...row,
        idx,
        delta: row.coutReelMensuel - row.coutTheoMensuel,
        pct: row.coutTheoMensuel ? ((row.coutReelMensuel - row.coutTheoMensuel) / row.coutTheoMensuel) * 100 : 0,
      }))
      .filter((r) => r.delta > 0)
      .sort((a, b) => b.delta - a.delta)
      .slice(0, 3);
  }, [grid]);

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

  // Composition for hero stack bar
  const driftSegments = useMemo(() => {
    const denom = Math.max(totalDeltaAbs, 1);
    const groups = {};
    for (const r of grid) {
      const d = Math.abs(r.coutReelMensuel - r.coutTheoMensuel);
      groups[r.type] = (groups[r.type] || 0) + d;
    }
    const colorByType = {
      Fixe: "bg-slate-400",
      Variable: "bg-amber-500",
      "Semi-var.": "bg-sky-500",
      "Var. lissé": "bg-violet-500",
      Exceptionnel: "bg-rose-500",
    };
    return Object.entries(groups)
      .filter(([, v]) => v > 0)
      .map(([type, v]) => ({
        type,
        share: (v / denom) * 100,
        color: colorByType[type] || "bg-neutral-400",
        amount: v,
      }))
      .sort((a, b) => b.share - a.share);
  }, [grid, totalDeltaAbs]);

  return (
    <PageShell
      moduleLabel="Module 3 · Cost Engine"
      title="Cost Atlas — Grille 14 postes"
      description="Réconciliation théorique vs réel. Chaque poste est une carte explorable — pas une ligne d'Excel."
      bare
      actions={
        <>
          <span className="hidden md:inline-flex items-center gap-1.5 h-9 px-3 rounded-full border border-neutral-200 bg-white text-xs font-semibold text-neutral-700">
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

      <div className="space-y-6">
        {/* ── Hero — La réconciliation du mois ───────────────────── */}
        <section className="relative overflow-hidden rounded-3xl border border-neutral-900 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-white shadow-xl">
          <div
            className="absolute inset-0 opacity-60 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(800px 400px at 0% 0%, rgba(232,9,18,0.18), transparent 60%), radial-gradient(700px 500px at 100% 100%, rgba(59,130,246,0.12), transparent 55%)",
            }}
          />
          <div className="relative px-6 sm:px-10 py-8 sm:py-10">
            <div className="flex items-center gap-2 mb-6">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-700 bg-neutral-900/60 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-300">
                Réconciliation du mois
              </span>
              <span className="text-[10px] text-neutral-500 uppercase tracking-wider">
                14 postes · base mensuelle
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-6 md:gap-10">
              <HeroNumber
                eyebrow="Théorique"
                value={totals.theo}
                accent="text-blue-300"
                tagline="Coût attendu si le mois s'était passé exactement comme la grille."
              />
              <HeroDelta delta={totals.delta} pct={totals.pct} />
              <HeroNumber
                eyebrow="Réel constaté"
                value={totals.reel}
                accent="text-emerald-300"
                tagline="Coût mesuré à partir des flux M2 — AS24, paie, garage, télématique."
                align="right"
              />
            </div>

            <div className="mt-8">
              <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.16em] font-bold text-neutral-400 mb-2">
                <span>Composition de la dérive (par type)</span>
                <span>{fmtKEur(totalDeltaAbs)} cumulés</span>
              </div>
              <div className="h-3 rounded-full bg-neutral-800 overflow-hidden flex">
                {driftSegments.map((s) => (
                  <span
                    key={s.type}
                    className={cn("h-full first:rounded-l-full last:rounded-r-full", s.color)}
                    style={{ width: `${s.share}%` }}
                    title={`${s.type} · ${fmtKEur(s.amount)} (${s.share.toFixed(0)}%)`}
                  />
                ))}
              </div>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-neutral-300">
                {driftSegments.map((s) => (
                  <span key={s.type} className="inline-flex items-center gap-1.5">
                    <span className={cn("inline-block w-2 h-2 rounded-sm", s.color)} />
                    <span className="font-semibold text-neutral-200">{s.type}</span>
                    <span className="text-neutral-500 tabular-nums">{s.share.toFixed(0)}%</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Top 3 dérives ────────────────────────────────────── */}
        {topDerives.length > 0 && (
          <section>
            <SectionHeader
              eyebrow="Hot list"
              title="Les 3 postes qui dérapent le plus"
              subtitle="Cliquer pour ouvrir la carte correspondante."
              icon={<Flame className="w-4 h-4 text-rose-500" />}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {topDerives.map((row, rank) => (
                <button
                  key={row.poste}
                  type="button"
                  onClick={() => {
                    setExpanded(row.idx);
                    document.getElementById(`cost-${row.idx}`)?.scrollIntoView({
                      behavior: "smooth",
                      block: "center",
                    });
                  }}
                  className="group relative overflow-hidden rounded-2xl border border-rose-200 bg-gradient-to-br from-rose-50/80 via-white to-white p-4 text-left hover:shadow-md transition-all"
                >
                  <span className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-rose-200/50 blur-2xl" />
                  <div className="relative flex items-start justify-between gap-2 mb-2">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-rose-600 text-white text-[11px] font-bold">
                      {rank + 1}
                    </span>
                    <span className="font-mono font-bold text-rose-700 tabular-nums text-sm">
                      {row.pct > 0 ? "+" : ""}
                      {row.pct.toFixed(1)}%
                    </span>
                  </div>
                  <h3 className="relative text-sm font-semibold text-neutral-950 leading-snug mb-2">
                    {row.poste}
                  </h3>
                  <div className="relative flex items-baseline gap-2">
                    <span className="font-mono text-xl font-bold text-rose-700 tabular-nums">
                      {fmtKEur(row.delta, true)}
                    </span>
                    <span className="text-[10px] text-neutral-500">vs théo</span>
                  </div>
                  <div className="relative mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 group-hover:gap-2 transition-all">
                    Inspecter <ArrowRight className="w-3 h-3" />
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* ── Heatmap ──────────────────────────────────────────── */}
        <DriftHeatmap
          rows={grid}
          activeId={expanded}
          onSelect={(idx) => {
            setExpanded((v) => (v === idx ? null : idx));
            if (typeof document !== "undefined") {
              document.getElementById(`cost-${idx}`)?.scrollIntoView({
                behavior: "smooth",
                block: "center",
              });
            }
          }}
        />

        {/* ── AI insight + hypothesis ──────────────────────────── */}
        <AiInsightBanner
          label="IA — Carburant +10.7% vs théorique · révision recommandée"
          insight="Le poste « Carburant tracteur » dépasse de 10.7% le théorique (157 k€ vs 142 k€). Pattern de surconsommation cohérent avec deux véhicules au-delà du seuil km. Action suggérée : revoir le standard GO et planifier les révisions AB-421-PL et IJ-556-PL."
          confidence={91}
          action={{ label: "Voir recommandations IA", href: "/m6/recommandations" }}
        />

        <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50/70 px-4 py-3">
          <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
          <p className="text-[13px] text-blue-800 leading-relaxed">
            <strong>H1 — Hypothèse en attente :</strong> diviseur jours ouvrés (21 ou 26) à arbitrer pour le calcul RH. La carte « Salaires &amp; charges RH » sera réajustée après validation.
          </p>
        </div>

        {/* ── Atlas — filters + cards ──────────────────────────── */}
        <section>
          <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-4 mb-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 mb-1">
                Atlas des coûts
              </p>
              <h2 className="text-lg font-semibold text-neutral-950 tracking-tight">
                {visibleRows.length} carte{visibleRows.length > 1 ? "s" : ""} ·{" "}
                <span className="text-neutral-500 font-normal">cliquez pour éditer théo / réel</span>
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 text-[10px] text-neutral-500">
                <Filter className="w-3 h-3" />
                <span className="uppercase font-bold tracking-wider">Type</span>
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
                        : f.color + " hover:bg-neutral-50",
                    )}
                  >
                    <span>{f.label}</span>
                    <span
                      className={cn(
                        "rounded-full px-1.5 text-[10px] font-bold tabular-nums",
                        active ? "bg-white/20 text-white" : "bg-white/70 text-neutral-700",
                      )}
                    >
                      {c}
                    </span>
                  </button>
                );
              })}

              <div className="ml-2 inline-flex items-center gap-1.5 h-7 pl-2 pr-1 rounded-full border border-neutral-200 bg-white text-[11px] font-semibold text-neutral-700">
                <ArrowDownAZ className="w-3 h-3 text-neutral-400" />
                <select
                  value={sortKey}
                  onChange={(e) => setSortKey(e.target.value)}
                  className="bg-transparent text-[11px] font-semibold focus:outline-none cursor-pointer"
                >
                  {SORTS.map((s) => (
                    <option key={s.key} value={s.key}>
                      {s.label}
                    </option>
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

        {/* ── Standards éditables (collapsed accordion) ────────── */}
        <section className="rounded-2xl border border-neutral-200 bg-white">
          <button
            type="button"
            onClick={() => setShowStandards((v) => !v)}
            className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="inline-flex w-8 h-8 rounded-lg bg-neutral-900 text-white items-center justify-center shrink-0">
                <Settings2 className="w-4 h-4" />
              </span>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-neutral-950">
                  Standards de calcul (RH · Matériel · Carburant)
                </div>
                <p className="text-[12px] text-neutral-500 mt-0.5">
                  Hypothèses qui alimentent les coûts théoriques. À éditer en arbitrage finance.
                </p>
              </div>
            </div>
            <span className="flex items-center gap-1 text-[11px] font-semibold text-neutral-500">
              {showStandards ? "Replier" : "Déplier"}
              <ChevronDown
                className={cn("w-4 h-4 transition-transform", showStandards && "rotate-180")}
              />
            </span>
          </button>

          {showStandards && (
            <div className="border-t border-neutral-100 px-5 py-5 space-y-6">
              <StandardsBlock
                title="RH — forfait journalier"
                desc="Coût employeur par jour (salaire + charges + congés)."
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {stdRh.map((row) => (
                    <StandardInput
                      key={row.id}
                      label={row.role}
                      value={row.dailyEUR}
                      suffix="€/j"
                      onChange={(v) =>
                        setStdRh((s) => s.map((x) => (x.id === row.id ? { ...x, dailyEUR: v } : x)))
                      }
                    />
                  ))}
                </div>
              </StandardsBlock>

              <StandardsBlock
                title="Matériel — loyer / 26 j"
                desc="Loyers d'équipement répartis sur 26 jours ouvrés."
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {stdMat.map((row) => (
                    <StandardInput
                      key={row.id}
                      label={row.label}
                      value={row.monthlyRent}
                      suffix="€/mois"
                      hint={`${row.dailyEUR.toFixed(0)} €/j`}
                      onChange={(v) =>
                        setStdMat((s) =>
                          s.map((x) =>
                            x.id === row.id
                              ? { ...x, monthlyRent: v, dailyEUR: Math.round((v / 26) * 100) / 100 }
                              : x,
                          ),
                        )
                      }
                    />
                  ))}
                </div>
              </StandardsBlock>

              <StandardsBlock
                title="Carburant théorique"
                desc="Consommations standards utilisées pour le calcul du coût théorique."
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {stdFuel.map((row) => (
                    <StandardInput
                      key={row.id}
                      label={row.label}
                      value={row.lPer100 ?? row.kgPer100}
                      suffix={row.lPer100 !== undefined ? "L/100" : "kg/100"}
                      step={0.1}
                      onChange={(v) =>
                        setStdFuel((s) =>
                          s.map((x) =>
                            x.id === row.id
                              ? row.lPer100 !== undefined
                                ? { ...x, lPer100: v }
                                : { ...x, kgPer100: v }
                              : x,
                          ),
                        )
                      }
                    />
                  ))}
                </div>
              </StandardsBlock>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => showToast("✓ Standards enregistrés — recalcul théorique en cours…")}
                  className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-neutral-900 text-white text-sm font-semibold hover:bg-neutral-800"
                >
                  Mettre à jour les standards
                </button>
              </div>
            </div>
          )}
        </section>

        {/* ── Inputs théoriques de référence ─────────────────────── */}
        <section className="rounded-2xl border border-neutral-200 bg-white p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 mb-3">
            Inputs théoriques de référence
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {Object.entries(m3TheoreticalInputs).map(([k, v]) => (
              <div key={k} className="rounded-lg border border-neutral-100 bg-neutral-50 px-3 py-2">
                <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                  {k}
                </div>
                <div className="text-[12px] text-neutral-700 mt-0.5 leading-snug">{v}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </PageShell>
  );
}

// ── Hero subcomponents ──────────────────────────────────────────────

function HeroNumber({ eyebrow, value, accent = "text-white", tagline, align = "left" }) {
  return (
    <div className={cn(align === "right" && "md:text-right")}>
      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-neutral-400 mb-2">
        {eyebrow}
      </p>
      <div className="flex items-baseline gap-1.5 leading-none">
        {align === "right" ? (
          <>
            <span className={cn("font-mono font-bold tabular-nums text-[44px] md:text-[52px]", accent)}>
              {(value / 1000).toLocaleString("fr-FR", { maximumFractionDigits: 0 })}
            </span>
            <span className="font-mono text-xl text-neutral-500 font-medium">k€</span>
          </>
        ) : (
          <>
            <span className={cn("font-mono font-bold tabular-nums text-[44px] md:text-[52px]", accent)}>
              {(value / 1000).toLocaleString("fr-FR", { maximumFractionDigits: 0 })}
            </span>
            <span className="font-mono text-xl text-neutral-500 font-medium">k€</span>
          </>
        )}
      </div>
      {tagline && (
        <p className="mt-2 text-[12px] text-neutral-400 max-w-xs leading-relaxed">{tagline}</p>
      )}
    </div>
  );
}

function HeroDelta({ delta, pct }) {
  const isOver = delta > 0;
  const isUnder = delta < 0;
  const tone = isOver ? "text-rose-300" : isUnder ? "text-emerald-300" : "text-neutral-300";
  const TrendIcon = isOver ? TrendingUp : isUnder ? TrendingDown : ArrowRight;
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="hidden md:flex items-center gap-2 text-neutral-600 mb-2">
        <span className="block w-10 h-px bg-neutral-700" />
        <ArrowRight className="w-3 h-3" />
        <span className="block w-10 h-px bg-neutral-700" />
      </div>
      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-neutral-400 mb-2">
        Écart à expliquer
      </p>
      <div className={cn("flex items-center gap-2", tone)}>
        <TrendIcon className="w-5 h-5" />
        <span className="font-mono font-bold tabular-nums text-3xl md:text-4xl">
          {delta > 0 ? "+" : delta < 0 ? "−" : ""}
          {(Math.abs(delta) / 1000).toLocaleString("fr-FR", { maximumFractionDigits: 1 })} k€
        </span>
      </div>
      <span className="mt-1 inline-flex items-center gap-1 rounded-full border border-neutral-700 bg-neutral-900/60 px-2 py-0.5 text-[10px] font-semibold text-neutral-300 tabular-nums">
        {pct > 0 ? "+" : ""}
        {pct.toFixed(1)}% vs théo
      </span>
    </div>
  );
}

// ── Section header ──────────────────────────────────────────────

function SectionHeader({ eyebrow, title, subtitle, icon }) {
  return (
    <div className="flex items-end justify-between gap-3 mb-3">
      <div className="flex items-center gap-3">
        {icon && (
          <span className="inline-flex w-8 h-8 rounded-lg bg-rose-50 border border-rose-100 items-center justify-center shrink-0">
            {icon}
          </span>
        )}
        <div>
          {eyebrow && (
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 mb-0.5">
              {eyebrow}
            </p>
          )}
          <h2 className="text-[15px] font-semibold text-neutral-950 tracking-tight">{title}</h2>
          {subtitle && <p className="text-[11px] text-neutral-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}

// ── Standards subcomponents ──────────────────────────────────────────────

function StandardsBlock({ title, desc, children }) {
  return (
    <div>
      <div className="mb-2">
        <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">{title}</p>
        <p className="text-[11px] text-neutral-500">{desc}</p>
      </div>
      {children}
    </div>
  );
}

function StandardInput({ label, value, suffix, hint, step = 1, onChange }) {
  return (
    <label className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-white px-3 py-2">
      <span className="flex-1 min-w-0">
        <span className="block text-[12px] font-medium text-neutral-800 truncate">{label}</span>
        {hint && <span className="block text-[10px] text-neutral-400">{hint}</span>}
      </span>
      <span className="flex items-center gap-1 shrink-0">
        <input
          type="number"
          step={step}
          value={value}
          onChange={(e) => onChange?.(Number(e.target.value))}
          className="w-24 h-8 rounded-md border border-neutral-200 bg-neutral-50 px-2 font-mono text-right text-sm focus:outline-none focus:ring-2 focus:ring-neutral-200"
        />
        <span className="text-[10px] text-neutral-500 font-semibold w-12">{suffix}</span>
      </span>
    </label>
  );
}
