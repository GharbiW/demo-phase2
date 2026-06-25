"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { Sparkles, X, ArrowRight, Lock } from "lucide-react";
import Link from "next/link";

/**
 * AiInsightBanner — dismissable inline insight (Phase 3). Style: finance-neutral + Parnass accent.
 */
export function AiInsightBanner({ insight, confidence = 85, label = "IA — Analyse automatique", action, className, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className={cn("rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-neutral-50 transition-colors"
      >
        <div className="w-6 h-6 rounded-md bg-neutral-900 flex items-center justify-center shrink-0 border border-neutral-800">
          <Sparkles className="w-3.5 h-3.5 text-[color:var(--color-parnass-red)]" />
        </div>
        <span className="text-xs font-semibold text-neutral-800 flex-1 text-left">{label}</span>
        <span className="text-[10px] text-neutral-500 font-money tabular-nums shrink-0">{confidence}%</span>
        <div className="flex items-center gap-1 rounded-full border border-neutral-200 bg-neutral-100 px-2 py-0.5 text-[9px] font-bold text-neutral-600 uppercase tracking-wider shrink-0">
          <Lock className="w-2.5 h-2.5" />
          Phase 3
        </div>
        <span className={cn("text-neutral-400 transition-transform shrink-0", open ? "rotate-90" : "")}>
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); setDismissed(true); }}
          className="p-1 rounded hover:bg-neutral-200 text-neutral-400 hover:text-neutral-700 transition-colors shrink-0"
        >
          <X className="w-3 h-3" />
        </button>
      </button>

      {open && (
        <div className="px-4 pb-3 border-t border-neutral-100 bg-neutral-50/60">
          <p className="text-sm text-neutral-800 mt-2 leading-relaxed">{insight}</p>
          {action && (
            <div className="mt-2">
              <Link
                href={action.href || "/rentabilite/analyse-ecarts"}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[color:var(--color-parnass-red)] hover:underline"
              >
                {action.label}
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          )}
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 h-1 rounded-full bg-neutral-200 overflow-hidden">
              <div className="h-full rounded-full bg-[color:var(--color-parnass-red)]" style={{ width: `${confidence}%` }} />
            </div>
            <span className="text-[10px] text-neutral-500 font-money">Confiance {confidence}%</span>
          </div>
        </div>
      )}
    </div>
  );
}

export function AiBadge({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 rounded-full bg-neutral-100 border border-neutral-200 px-2 py-0.5 text-[10px] font-bold text-neutral-800 hover:bg-neutral-200 transition-colors"
    >
      <Sparkles className="w-2.5 h-2.5 text-[color:var(--color-parnass-red)]" />
      IA
    </button>
  );
}
