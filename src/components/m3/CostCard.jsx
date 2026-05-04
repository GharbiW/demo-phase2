"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { ChevronDown, ChevronUp, Tag, Database, Calendar, Repeat, Pencil, Check, X } from "lucide-react";

const TYPE_STYLES = {
  Fixe: {
    ribbon: "bg-slate-400",
    pill: "bg-slate-50 text-slate-700 border-slate-200",
    label: "Fixe",
  },
  Variable: {
    ribbon: "bg-amber-500",
    pill: "bg-amber-50 text-amber-800 border-amber-200",
    label: "Variable",
  },
  "Semi-var.": {
    ribbon: "bg-sky-500",
    pill: "bg-sky-50 text-sky-700 border-sky-200",
    label: "Semi-variable",
  },
  "Var. lissé": {
    ribbon: "bg-violet-500",
    pill: "bg-violet-50 text-violet-700 border-violet-200",
    label: "Var. lissé",
  },
  Exceptionnel: {
    ribbon: "bg-rose-500",
    pill: "bg-rose-50 text-rose-700 border-rose-200",
    label: "Exceptionnel",
  },
};

function severityOf(pct) {
  const a = Math.abs(pct ?? 0);
  if (a >= 10)
    return {
      key: "alert",
      chip: "bg-red-50 text-red-700 border-red-200",
      glow: "from-red-100/70",
      label: "Forte dérive",
    };
  if (a >= 4)
    return {
      key: "watch",
      chip: "bg-amber-50 text-amber-800 border-amber-200",
      glow: "from-amber-100/70",
      label: "À surveiller",
    };
  return {
    key: "calm",
    chip: "bg-emerald-50 text-emerald-700 border-emerald-200",
    glow: "from-emerald-50/40",
    label: "Sous contrôle",
  };
}

function fmtKEur(v, signed = false) {
  const sign = signed ? (v > 0 ? "+" : v < 0 ? "−" : "") : "";
  const abs = Math.abs(v);
  return `${sign}${(abs / 1000).toLocaleString("fr-FR", { maximumFractionDigits: 1 })} k€`;
}

export function CostCard({ row, onSave, expanded, onToggle, totalReel, hint }) {
  const delta = row.coutReelMensuel - row.coutTheoMensuel;
  const dpct = row.coutTheoMensuel ? (delta / row.coutTheoMensuel) * 100 : 0;
  const isOver = delta > 0;
  const isUnder = delta < 0;
  const sev = severityOf(dpct);
  const ts = TYPE_STYLES[row.type] || TYPE_STYLES.Fixe;
  const weightPct = totalReel ? (row.coutReelMensuel / totalReel) * 100 : 0;

  const maxLocal = Math.max(row.coutTheoMensuel, row.coutReelMensuel) * 1.18 || 1;
  const theoX = (row.coutTheoMensuel / maxLocal) * 100;
  const reelX = (row.coutReelMensuel / maxLocal) * 100;

  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState("");

  const startEdit = (field) => {
    setEditing(field);
    setDraft(String(field === "coutTheoMensuel" ? row.coutTheoMensuel : row.coutReelMensuel));
  };

  const commit = () => {
    if (editing) onSave?.(editing, draft);
    setEditing(null);
  };

  return (
    <article
      className={cn(
        "group relative rounded-2xl border bg-white transition-all overflow-hidden",
        expanded
          ? "border-neutral-300 shadow-md ring-1 ring-neutral-200/60"
          : "border-neutral-200 shadow-sm hover:shadow-md hover:border-neutral-300",
      )}
    >
      <span className={cn("absolute left-0 top-0 bottom-0 w-1", ts.ribbon)} aria-hidden />

      {sev.key !== "calm" && (
        <span
          className={cn(
            "absolute -right-16 -top-16 w-40 h-40 rounded-full blur-2xl pointer-events-none opacity-70",
            "bg-gradient-to-br to-transparent",
            sev.glow,
          )}
          aria-hidden
        />
      )}

      <button type="button" onClick={onToggle} className="relative w-full text-left pl-5 pr-10 py-4">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-wide",
              ts.pill,
            )}
          >
            <Tag className="w-2.5 h-2.5" />
            {ts.label}
          </span>
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold tabular-nums",
              sev.chip,
            )}
            title={sev.label}
          >
            {dpct > 0 ? "+" : dpct < 0 ? "−" : ""}
            {Math.abs(dpct).toFixed(1)}%
          </span>
        </div>

        <h3 className="text-[15px] font-semibold text-neutral-950 leading-snug pr-2 mb-3 tracking-tight">
          {row.poste}
        </h3>

        <div className="flex items-end justify-between gap-3 mb-4">
          <div>
            <div className="text-[10px] uppercase tracking-[0.16em] font-bold text-neutral-400 mb-0.5">
              Réel / mois
            </div>
            <div className="font-mono font-semibold text-[26px] text-neutral-950 leading-none tabular-nums">
              {(row.coutReelMensuel / 1000).toLocaleString("fr-FR", { maximumFractionDigits: 1 })}
              <span className="text-neutral-400 text-base ml-1 font-medium">k€</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-[0.16em] font-bold text-neutral-400 mb-0.5">
              Théo
            </div>
            <div className="font-mono text-sm text-neutral-500 tabular-nums">
              {(row.coutTheoMensuel / 1000).toLocaleString("fr-FR", { maximumFractionDigits: 1 })} k€
            </div>
          </div>
        </div>

        <div className="relative h-7 mb-2 px-1">
          <div className="absolute inset-x-1 top-1/2 -translate-y-1/2 h-px bg-neutral-200" />
          {row.coutTheoMensuel > 0 && (
            <div
              className={cn(
                "absolute top-1/2 -translate-y-1/2 h-1.5 rounded-full",
                isOver ? "bg-red-300/80" : isUnder ? "bg-emerald-300/80" : "bg-neutral-200",
              )}
              style={{
                left: `${Math.min(theoX, reelX)}%`,
                width: `${Math.abs(reelX - theoX)}%`,
              }}
            />
          )}
          {row.coutTheoMensuel > 0 && (
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 group/pin"
              style={{ left: `${theoX}%` }}
            >
              <span className="block w-2.5 h-2.5 rounded-full bg-blue-600 ring-2 ring-blue-100" />
              <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[9px] font-semibold uppercase tracking-wider text-blue-600">
                T
              </span>
            </div>
          )}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
            style={{ left: `${reelX}%` }}
          >
            <span
              className={cn(
                "block w-3.5 h-3.5 rounded-full ring-2",
                isOver
                  ? "bg-red-600 ring-red-100"
                  : isUnder
                    ? "bg-emerald-600 ring-emerald-100"
                    : "bg-neutral-700 ring-neutral-100",
              )}
            />
            <span
              className={cn(
                "absolute -bottom-4 left-1/2 -translate-x-1/2 text-[9px] font-semibold uppercase tracking-wider",
                isOver ? "text-red-600" : isUnder ? "text-emerald-700" : "text-neutral-700",
              )}
            >
              R
            </span>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between text-[11px]">
          <span
            className={cn(
              "font-mono font-semibold tabular-nums",
              isOver ? "text-red-600" : isUnder ? "text-emerald-700" : "text-neutral-400",
            )}
          >
            {delta === 0 ? "—" : fmtKEur(delta, true)}
          </span>
          <span className="text-neutral-400 tabular-nums">{weightPct.toFixed(1)}% du total</span>
        </div>

        {hint ? (
          <div className="mt-2 inline-flex items-center gap-1 rounded-md border border-amber-200 bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800">
            <span className="w-1 h-1 rounded-full bg-amber-500" />
            {hint}
          </div>
        ) : null}

        <div className="mt-3 pt-3 border-t border-neutral-100 text-[11px] text-neutral-500 leading-relaxed space-y-0.5">
          <div className="truncate">
            <span className="text-neutral-400 font-semibold">Méth.</span> {row.methode}
          </div>
          <div className="truncate">
            <span className="text-neutral-400 font-semibold">Source</span> {row.source}
          </div>
        </div>

        <div className="absolute top-4 right-3 text-neutral-300 group-hover:text-neutral-500 transition-colors">
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </div>
      </button>

      {expanded && (
        <div
          className="border-t border-neutral-100 bg-neutral-50/70 px-5 py-4 space-y-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="grid grid-cols-2 gap-3">
            <EditCell
              label="Coût théorique"
              accent="blue"
              value={row.coutTheoMensuel}
              field="coutTheoMensuel"
              editing={editing === "coutTheoMensuel"}
              draft={draft}
              setDraft={setDraft}
              onStart={() => startEdit("coutTheoMensuel")}
              onCommit={commit}
              onCancel={() => setEditing(null)}
            />
            <EditCell
              label="Coût réel"
              accent="emerald"
              value={row.coutReelMensuel}
              field="coutReelMensuel"
              editing={editing === "coutReelMensuel"}
              draft={draft}
              setDraft={setDraft}
              onStart={() => startEdit("coutReelMensuel")}
              onCommit={commit}
              onCancel={() => setEditing(null)}
            />
          </div>

          <div className="grid grid-cols-3 gap-2 text-[11px]">
            <Meta icon={<Repeat className="w-3 h-3" />} label="Fréquence" value={row.frequence} />
            <Meta icon={<Calendar className="w-3 h-3" />} label="Date d'effet" value={row.dateEffet} />
            <Meta icon={<Database className="w-3 h-3" />} label="Source flux" value={row.source} />
          </div>
        </div>
      )}
    </article>
  );
}

function EditCell({ label, accent, value, editing, draft, setDraft, onStart, onCommit, onCancel }) {
  const accentText = accent === "blue" ? "text-blue-700" : "text-emerald-700";
  const accentRing = accent === "blue" ? "focus:ring-blue-200" : "focus:ring-emerald-200";
  return (
    <div className="rounded-xl border border-neutral-200 bg-white px-3 py-2.5">
      <div className="flex items-center justify-between gap-2 mb-1">
        <span className="text-[10px] uppercase tracking-wider font-bold text-neutral-500">{label}</span>
        {!editing && (
          <button
            type="button"
            onClick={onStart}
            className="inline-flex items-center gap-1 text-[10px] text-neutral-400 hover:text-neutral-700 font-semibold"
          >
            <Pencil className="w-2.5 h-2.5" />
            Modifier
          </button>
        )}
      </div>
      {editing ? (
        <div className="flex items-center gap-1">
          <input
            type="number"
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onCommit();
              if (e.key === "Escape") onCancel();
            }}
            className={cn(
              "flex-1 h-9 rounded-lg border border-neutral-200 bg-white px-2 font-mono text-right text-sm focus:outline-none focus:ring-2",
              accentRing,
            )}
          />
          <button
            type="button"
            onClick={onCommit}
            className="h-9 w-9 rounded-lg bg-neutral-900 text-white inline-flex items-center justify-center hover:bg-neutral-800"
          >
            <Check className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="h-9 w-9 rounded-lg border border-neutral-200 bg-white inline-flex items-center justify-center text-neutral-500 hover:bg-neutral-50"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className={cn("font-mono text-base font-semibold tabular-nums", accentText)}>
          {value.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} €
        </div>
      )}
    </div>
  );
}

function Meta({ icon, label, value }) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5">
      <div className="flex items-center gap-1 text-[9px] uppercase tracking-wider font-bold text-neutral-400">
        {icon}
        {label}
      </div>
      <div className="text-[11px] text-neutral-700 mt-0.5 leading-tight">{value || "—"}</div>
    </div>
  );
}
