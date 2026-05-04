"use client";

import { useState } from "react";
import { PageShell, KpiGrid, KpiTile } from "@/components/ui/PageShell";
import { HealthChip, HealthChipRow } from "@/components/ui/HealthChip";
import { AiInsightBanner } from "@/components/ui/AiInsightBanner";
import { Badge } from "@/components/ui/Badge";
import Toast from "@/components/ui/Toast";
import { m5Alerts } from "@/lib/demo-data";
import {
  AlertTriangle, CheckCircle2, ChevronRight, Fuel, Truck, Wrench, TrendingDown, Activity, Sparkles,
} from "lucide-react";
import Link from "next/link";

const SEVERITY_CONFIG = {
  high: { chip: "red", label: "Élevé", cardBorder: "border-red-200 bg-red-50/40", iconColor: "text-red-500", badgeColor: "red" },
  medium: { chip: "amber", label: "Moyen", cardBorder: "border-amber-200 bg-amber-50/30", iconColor: "text-amber-500", badgeColor: "amber" },
  low: { chip: "neutral", label: "Bas", cardBorder: "border-neutral-200 bg-white", iconColor: "text-neutral-400", badgeColor: "neutral" },
};

const TYPE_ICONS = {
  "Tournée déficitaire": <TrendingDown className="w-4 h-4" />,
  "Multi-semi-remorque": <Truck className="w-4 h-4" />,
  "Dépassement km révision": <Wrench className="w-4 h-4" />,
  "Surconsommation carburant": <Fuel className="w-4 h-4" />,
  "Client sous-performant": <TrendingDown className="w-4 h-4" />,
  "Exception ETL non résolue": <Activity className="w-4 h-4" />,
};

const AI_DETECTED = ["Surconsommation carburant", "Tournée déficitaire"];
const LINK_TO_M4 = ["Tournée déficitaire", "Client sous-performant"];

const EXTENDED_ALERTS = [
  ...m5Alerts,
  { type: "Amplitude excessive", detail: "Bernard P. — amplitude 12.1h sur T-0425, T-0435, T-0445. Dépasse seuil légal 13h mais attention fatigue.", severity: "medium" },
  { type: "Péages sous-estimés", detail: "CEVA route Est — péages réels 12 600€ vs 11 800€ théorique (+6.8%). PTV route à recalibrer.", severity: "medium" },
  { type: "Véhicule en alerte km", detail: "IJ-556-PL — 221 600 km. Deuxième véhicule dépassant le seuil de révision majeure 180 000 km.", severity: "high" },
];

export default function AlertesPage() {
  const [alerts, setAlerts] = useState(EXTENDED_ALERTS.map((a, i) => ({ ...a, id: i, resolved: false })));
  const [filter, setFilter] = useState("all");
  const [toast, setToast] = useState(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const resolve = (id) => {
    setAlerts((prev) => prev.map((a) => a.id === id ? { ...a, resolved: true } : a));
    showToast("✓ Alerte résolue et archivée");
  };

  const active = alerts.filter((a) => !a.resolved);
  const resolved = alerts.filter((a) => a.resolved);
  const highCount = active.filter((a) => a.severity === "high").length;
  const medCount = active.filter((a) => a.severity === "medium").length;
  const lowCount = active.filter((a) => a.severity === "low").length;

  const filtered = filter === "all" ? active
    : filter === "resolved" ? resolved
    : active.filter((a) => a.severity === filter);

  return (
    <PageShell
      title="P5.6 — Alertes opérationnelles"
      subtitle="Anomalies détectées · Actions requises · Suivi résolution"
      bare
      noPad
    >
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      <div className="px-6 pt-6 space-y-5">

        <KpiGrid cols={4}>
          <KpiTile label="Alertes actives" value={active.length} sub="Toutes sévérités" />
          <KpiTile label="Élevées" value={highCount} sub="Requièrent action immédiate" color="warn" />
          <KpiTile label="Moyennes" value={medCount} sub="À traiter sous 48h" />
          <KpiTile label="Résolues" value={resolved.length} sub="Archivées cette session" color="ok" />
        </KpiGrid>

        {/* AI banner */}
        <AiInsightBanner
          label="IA — 2 patterns récurrents détectés automatiquement"
          insight="Moteur d'analyse : surconsommation carburant GO détectée sur 4 tournées Dupont A. et Bernard P. (+18% et +15% vs théorique). Pattern cohérent avec diagnostic moteur. Recommandation préventive : maintenance GO avant prochain cycle (Phase 3 — IA non activée)."
          confidence={84}
          action={{ label: "Voir les recommandations IA détaillées", href: "/m6/recommandations" }}
          defaultOpen
        />

        {/* Health chips */}
        <HealthChipRow>
          <HealthChip label="Toutes" value={active.length} color="neutral" isActive={filter === "all"} onClick={() => setFilter("all")} />
          <HealthChip label="Élevé" value={highCount} color="red" isActive={filter === "high"} onClick={() => setFilter(filter === "high" ? "all" : "high")} />
          <HealthChip label="Moyen" value={medCount} color="amber" isActive={filter === "medium"} onClick={() => setFilter(filter === "medium" ? "all" : "medium")} />
          <HealthChip label="Bas" value={lowCount} color="neutral" isActive={filter === "low"} onClick={() => setFilter(filter === "low" ? "all" : "low")} />
          <HealthChip label="Résolues" value={resolved.length} color="emerald" isActive={filter === "resolved"} onClick={() => setFilter(filter === "resolved" ? "all" : "resolved")} />
        </HealthChipRow>

        {/* Alert cards */}
        <div className="space-y-3">
          {filtered.length === 0 && (
            <div className="rounded-xl border border-dashed border-neutral-200 p-10 text-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <div className="text-sm font-semibold text-neutral-700">
                {filter === "resolved" ? "Aucune alerte résolue dans cette session" : "Aucune alerte active dans cette catégorie"}
              </div>
            </div>
          )}

          {filtered.map((alert) => {
            const cfg = SEVERITY_CONFIG[alert.severity] || SEVERITY_CONFIG.low;
            const Icon = TYPE_ICONS[alert.type] || <AlertTriangle className="w-4 h-4" />;
            const isAiDetected = AI_DETECTED.includes(alert.type);
            const hasM4Link = LINK_TO_M4.includes(alert.type);

            return (
              <div
                key={alert.id}
                className={`rounded-xl border ${cfg.cardBorder} p-4 transition-all ${alert.resolved ? "opacity-50" : ""}`}
              >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className={`w-9 h-9 rounded-lg border ${alert.severity === "high" ? "bg-red-100 border-red-200" : alert.severity === "medium" ? "bg-amber-100 border-amber-200" : "bg-neutral-100 border-neutral-200"} flex items-center justify-center shrink-0 ${cfg.iconColor}`}>
                    {Icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-sm font-semibold text-neutral-900">{alert.type}</span>
                      <Badge color={cfg.badgeColor} size="sm">{cfg.label}</Badge>
                      {isAiDetected && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 border border-neutral-200 px-1.5 py-0.5 text-[9px] font-bold text-neutral-800">
                          <Sparkles className="w-2.5 h-2.5 text-[color:var(--color-parnass-red)]" />
                          Détecté automatiquement
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-600 leading-relaxed">{alert.detail}</p>

                    {/* Actions row */}
                    <div className="flex items-center gap-3 mt-3 flex-wrap">
                      {hasM4Link && (
                        <Link
                          href="/m6/analyse-ecarts"
                          className="flex items-center gap-1 text-xs text-[#E80912] hover:underline font-medium"
                        >
                          Voir dans M4 <ChevronRight className="w-3 h-3" />
                        </Link>
                      )}
                      {alert.type === "Surconsommation carburant" && (
                        <Link href="/m3/grille-couts" className="flex items-center gap-1 text-xs text-neutral-600 hover:text-neutral-900">
                          Grille coûts <ChevronRight className="w-3 h-3" />
                        </Link>
                      )}
                      {!alert.resolved && (
                        <button
                          onClick={() => resolve(alert.id)}
                          className="ml-auto flex items-center gap-1.5 h-7 px-3 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 text-xs font-semibold hover:bg-emerald-100 transition-colors"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          Résoudre
                        </button>
                      )}
                      {alert.resolved && (
                        <span className="ml-auto flex items-center gap-1 text-xs text-emerald-600 font-semibold">
                          <CheckCircle2 className="w-3 h-3" />
                          Résolu
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Resolved archive */}
        {filter !== "resolved" && resolved.length > 0 && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 px-4 py-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className="text-sm font-semibold text-emerald-700">{resolved.length} alerte{resolved.length !== 1 ? "s" : ""} résolue{resolved.length !== 1 ? "s" : ""} cette session</span>
              </div>
              <button onClick={() => setFilter("resolved")} className="text-xs text-emerald-600 hover:underline">Voir →</button>
            </div>
            <div className="space-y-0.5">
              {resolved.map((a) => (
                <div key={a.id} className="flex items-center gap-2 text-xs text-neutral-400 line-through">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" style={{ textDecoration: "none" }} />
                  <span style={{ textDecoration: "none" }}>{a.type}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </PageShell>
  );
}
