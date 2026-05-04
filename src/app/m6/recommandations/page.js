"use client";

import Link from "next/link";
import { PageShell, SectionCard } from "@/components/ui/PageShell";
import { Brain, ArrowRight, Sparkles } from "lucide-react";
import { cockpitM6Insights } from "@/lib/cockpit-mock-data";
import { RECO_DATA } from "./reco-data";
import { m4Tournees } from "@/lib/demo-data";
import { computeTourneeCostBreakdown, getTourneeProduction } from "@/lib/cockpit-mock-data";

export default function M6RecommandationsPage() {
  const anomalies = m4Tournees
    .map((t) => {
      const prod = getTourneeProduction(t.id);
      const breakdown = computeTourneeCostBreakdown(t);
      const kmDelta = breakdown?.ecarts?.km ?? 0;
      const fuelDelta = t.ecart?.carburant ?? 0;
      const flags = [];
      if (t.marge < 0) flags.push({ level: "red", label: "Marge négative" });
      if (fuelDelta < -700) flags.push({ level: "orange", label: "Surconsommation carburant" });
      if (kmDelta > 20) flags.push({ level: "orange", label: "Détour / km en excès" });
      if ((prod?.hs ?? 0) > 1.0) flags.push({ level: "blue", label: "Heures sup." });
      return { t, prod, breakdown, flags };
    })
    .filter((x) => x.flags.length > 0)
    .slice(0, 8);

  return (
    <PageShell
      title="M6 — Recommandations proactives"
      subtitle="Fil d’insights type assistant — démo interactive (données mock)"
      actions={
        <Link
          href="/m6/simulations"
          className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-neutral-900 text-white text-sm font-semibold hover:bg-neutral-800"
        >
          Simulateur what-if <ArrowRight className="w-4 h-4" />
        </Link>
      }
    >
      <SectionCard title="Insights rapides (prompt)" description="Cartes priorisées — rouge / orange / bleu">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {cockpitM6Insights.map((ins) => (
            <div
              key={ins.id}
              className={`rounded-xl border p-4 shadow-sm ${
                ins.level === "red"
                  ? "border-red-200 bg-[var(--cockpit-semantic-danger-soft)]"
                  : ins.level === "orange"
                    ? "border-orange-200 bg-[var(--cockpit-semantic-warn-soft)]"
                    : "border-blue-200 bg-[var(--cockpit-semantic-info-soft)]"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-neutral-700 shrink-0" />
                <span className="text-xs font-bold text-neutral-900">{ins.title}</span>
              </div>
              <p className="text-xs text-neutral-700 leading-relaxed">{ins.body}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Détection d’anomalies (automatique — démo)" description="Les tournées à marge négative ou patterns atypiques remontent ici.">
        <div className="space-y-3">
          {anomalies.map(({ t, flags, breakdown }) => (
            <div key={t.id} className="rounded-xl border border-neutral-200 bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold text-neutral-900">{t.id} · {t.client} · {t.chauffeur}</p>
                  <p className="text-[11px] text-neutral-500 mt-1">
                    Marge: <span className={`font-mono font-semibold ${t.marge < 0 ? "text-red-600" : "text-emerald-700"}`}>{t.marge.toLocaleString("fr-FR")} €</span>
                    {breakdown ? (
                      <span className="ml-2 text-neutral-500">· Δ km {breakdown.ecarts.km >= 0 ? "+" : ""}{breakdown.ecarts.km} · Δ coût {breakdown.ecarts.total >= 0 ? "+" : ""}{Math.round(breakdown.ecarts.total).toLocaleString("fr-FR")}€</span>
                    ) : null}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 justify-end">
                  {flags.map((f) => (
                    <span
                      key={f.label}
                      className={`inline-flex rounded-full border px-2 py-1 text-[10px] font-bold ${
                        f.level === "red"
                          ? "border-red-200 bg-red-50 text-red-700"
                          : f.level === "orange"
                            ? "border-amber-200 bg-amber-50 text-amber-800"
                            : "border-blue-200 bg-blue-50 text-blue-800"
                      }`}
                    >
                      {f.label}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <Link
                  href={`/rentabilite/par-tournee`}
                  className="inline-flex items-center gap-2 h-9 px-3 rounded-lg border border-neutral-200 bg-white text-xs font-semibold text-neutral-800 hover:bg-neutral-50"
                >
                  Voir la tournée (variance) <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href={`/m6/simulations`}
                  className="inline-flex items-center gap-2 h-9 px-3 rounded-lg bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800"
                >
                  Tester un what-if <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 h-9 px-3 rounded-lg border border-emerald-200 bg-emerald-50 text-xs font-semibold text-emerald-800 hover:bg-emerald-100"
                  onClick={() => {}}
                >
                  Suggérer regroupement prestations
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 h-9 px-3 rounded-lg border border-amber-200 bg-amber-50 text-xs font-semibold text-amber-900 hover:bg-amber-100"
                  onClick={() => {}}
                >
                  Recommander itinéraire alternatif
                </button>
              </div>
            </div>
          ))}
          {anomalies.length === 0 && <p className="text-xs text-neutral-500">Aucune anomalie détectée sur l’échantillon.</p>}
        </div>
      </SectionCard>

      <SectionCard title="Recommandations détaillées (scénarios démo)" description="Confiance % · leviers · impact estimé">
        <div className="space-y-4">
          {RECO_DATA.map((r) => (
            <div
              key={r.id}
              className={`rounded-xl border p-5 ${
                r.priority === "Critique"
                  ? "border-red-200 bg-red-50/40"
                  : r.priority === "Élevée"
                    ? "border-amber-200 bg-amber-50/40"
                    : "border-blue-200 bg-blue-50/40"
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-3 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${r.badge}`}>{r.priority}</span>
                  <span className="text-[10px] text-neutral-500 border border-neutral-200 rounded px-2 py-0.5 bg-white">{r.type}</span>
                  <span className="text-[10px] text-neutral-500">{r.module}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-neutral-500">Confiance</span>
                  <div className="flex items-center gap-1">
                    <div className="w-20 h-1.5 rounded-full bg-neutral-200 overflow-hidden">
                      <div className="h-full rounded-full bg-violet-500" style={{ width: `${r.confidence}%` }} />
                    </div>
                    <span className="text-xs text-violet-700 font-mono">{r.confidence}%</span>
                  </div>
                </div>
              </div>
              <h3 className="text-sm font-semibold text-neutral-900 mb-2">{r.titre}</h3>
              <p className="text-xs text-neutral-600 leading-relaxed mb-3">{r.analyse}</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 rounded-lg bg-white border border-neutral-200 px-3 py-2">
                  <div className="text-[10px] text-violet-700 font-semibold mb-1">LEVIER PROPOSÉ</div>
                  <div className="text-xs text-neutral-700">{r.levier}</div>
                </div>
                <div className="sm:w-48 rounded-lg bg-white border border-neutral-200 px-3 py-2">
                  <div className="text-[10px] text-emerald-700 font-semibold mb-1">IMPACT ESTIMÉ</div>
                  <div className="text-xs font-mono text-emerald-800">{r.impact}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 flex items-start gap-3">
        <Brain className="w-5 h-5 text-neutral-600 shrink-0 mt-0.5" />
        <p className="text-xs text-neutral-600">
          <strong className="text-neutral-800">Démo Phase 2.</strong> Les scores de confiance et impacts sont calculés côté client sur fixtures ; aucun appel modèle réel.
        </p>
      </div>
    </PageShell>
  );
}
