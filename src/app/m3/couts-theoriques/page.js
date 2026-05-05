"use client";

import { useState, useMemo } from "react";
import { Save, RefreshCw, Info, TrendingUp, TrendingDown } from "lucide-react";
import { PageShell, SectionCard, KpiGrid, KpiTile } from "@/components/ui/PageShell";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import { useDemoStore } from "@/stores/demoStore";
import { m3CostGrid } from "@/lib/demo-data";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";

const TYPE_COLOR = {
  "Fixe": "#64748b",
  "Variable": "#f59e0b",
  "Semi-var.": "#0ea5e9",
  "Var. lissé": "#8b5cf6",
  "Exceptionnel": "#f43f5e",
};

const SCENARIOS = [
  { label: "Carburant GO +5%", key: "fuel5", delta: 0.05, base: "fuel" },
  { label: "Carburant GO +10%", key: "fuel10", delta: 0.10, base: "fuel" },
  { label: "Carburant GO −5%", key: "fuel-5", delta: -0.05, base: "fuel" },
  { label: "Forfait RH +5%", key: "rh5", delta: 0.05, base: "rh" },
  { label: "Forfait RH +10%", key: "rh10", delta: 0.10, base: "rh" },
  { label: "Forfait RH −5%", key: "rh-5", delta: -0.05, base: "rh" },
  { label: "Km/mois +10%", key: "km10", delta: 0.10, base: "km" },
  { label: "Km/mois −10%", key: "km-10", delta: -0.10, base: "km" },
];

function AssumptionRow({ label, hint, children, unit }) {
  return (
    <div className="grid grid-cols-3 gap-4 items-center py-3 border-b border-neutral-100 last:border-0">
      <div>
        <div className="text-sm font-medium text-neutral-900">{label}</div>
        {hint && <div className="text-xs text-neutral-400 mt-0.5">{hint}</div>}
      </div>
      <div className="col-span-2 flex items-center gap-2">
        {children}
        {unit && <span className="text-sm text-neutral-500 shrink-0">{unit}</span>}
      </div>
    </div>
  );
}

export default function CoutsTheoriquesPage() {
  const { state, actions } = useDemoStore();
  const { showToast } = useToast();
  const [local, setLocal] = useState({ ...state.assumptions });
  const [dirty, setDirty] = useState(false);

  function set(key, val) {
    setLocal((prev) => ({ ...prev, [key]: val }));
    setDirty(true);
  }

  function handleSave() {
    actions.updateAssumptions(local);
    setDirty(false);
    showToast("Hypothèses de coûts mises à jour — KPIs M5 recalculés", "success");
  }

  function handleReset() {
    setLocal({ ...state.assumptions });
    setDirty(false);
  }

  // ── Aggregate computations ─────────────────────────────────────────
  const totalTheo = useMemo(() => m3CostGrid.reduce((s, r) => s + r.coutTheoMensuel, 0), []);

  const partRH = useMemo(() => {
    const rh = m3CostGrid
      .filter((r) => r.poste.includes("Salaire") || r.poste.includes("Primes"))
      .reduce((s, r) => s + r.coutTheoMensuel, 0);
    return ((rh / totalTheo) * 100).toFixed(1);
  }, [totalTheo]);

  const partCarburant = useMemo(() => {
    const fuel = m3CostGrid
      .filter((r) => r.poste.includes("Carburant") || r.poste.includes("AdBlue"))
      .reduce((s, r) => s + r.coutTheoMensuel, 0);
    return ((fuel / totalTheo) * 100).toFixed(1);
  }, [totalTheo]);

  const costPerKm = useMemo(() => ((totalTheo / 150000) * 100).toFixed(3), [totalTheo]);

  const salaryImpact = ((local.salaryDayEUR - 165) * 3.2).toFixed(0);
  const fuelImpact = ((local.fuelGO_L_100 - 28) * 18 + (local.fuelGNC_L_100 - 30.5) * 9).toFixed(0);
  const totalImpact = (parseFloat(salaryImpact) + parseFloat(fuelImpact)).toFixed(0);

  // ── Chart data ─────────────────────────────────────────────────────
  const chartData = useMemo(() =>
    [...m3CostGrid]
      .sort((a, b) => b.coutTheoMensuel - a.coutTheoMensuel)
      .map((r) => ({
        name: r.poste.length > 18 ? r.poste.slice(0, 17) + "…" : r.poste,
        fullName: r.poste,
        value: Math.round(r.coutTheoMensuel / 1000),
        type: r.type,
        color: TYPE_COLOR[r.type] ?? "#6b7280",
      })),
  []);

  // ── Sensitivity scenarios ─────────────────────────────────────────
  const sensitivityRows = useMemo(() => {
    // base values from m3CostGrid
    const fuelBase = m3CostGrid
      .filter((r) => r.poste.includes("Carburant tracteur"))
      .reduce((s, r) => s + r.coutTheoMensuel, 0);
    const rhBase = m3CostGrid
      .filter((r) => r.poste.includes("Salaire") || r.poste.includes("Primes"))
      .reduce((s, r) => s + r.coutTheoMensuel, 0);
    const kmBase = m3CostGrid
      .filter((r) => r.type === "Variable")
      .reduce((s, r) => s + r.coutTheoMensuel, 0);

    return SCENARIOS.map((sc) => {
      const base = sc.base === "fuel" ? fuelBase : sc.base === "rh" ? rhBase : kmBase;
      const impact = Math.round((base * sc.delta) / 1000);
      return { ...sc, impact, margeImpact: -impact };
    });
  }, []);

  return (
    <PageShell
      moduleLabel="M3 — Moteur de coûts"
      title="Hypothèses de coûts théoriques"
      description="Paramètres de référence pour le calcul des coûts théoriques. Toute modification recalcule les KPIs M5."
      actions={
        <>
          {dirty && (
            <Button variant="ghost" size="sm" icon={<RefreshCw className="w-4 h-4" />} onClick={handleReset}>
              Annuler
            </Button>
          )}
          <Button
            variant={dirty ? "primary" : "outline"}
            size="sm"
            icon={<Save className="w-4 h-4" />}
            onClick={handleSave}
          >
            {dirty ? "Sauvegarder" : "Sauvegardé"}
          </Button>
        </>
      }
      bare
    >
      <div className="space-y-6">

        {/* ── 6 KPI tiles ──────────────────────────────────────────── */}
        <KpiGrid cols={6}>
          <KpiTile
            label="Coût théo total / mois"
            value={`${(totalTheo / 1000).toFixed(0)} k€`}
            sub="13 postes consolidés"
          />
          <KpiTile
            label="Coût théo / 100 km"
            value={`${costPerKm} €`}
            sub="Base 150 000 km/an"
          />
          <KpiTile
            label="Part RH"
            value={`${partRH}%`}
            sub="Salaires + primes"
          />
          <KpiTile
            label="Part carburant"
            value={`${partCarburant}%`}
            sub="GO + frigo + AdBlue"
          />
          <KpiTile
            label="Impact salaires"
            value={`${salaryImpact >= 0 ? "+" : ""}${salaryImpact} k€`}
            sub={dirty ? "⚠ Non sauvegardé" : "vs réf. 165 €/j"}
            accent={Math.abs(parseFloat(salaryImpact)) > 30}
            trend={parseFloat(salaryImpact) > 0 ? "down" : "up"}
          />
          <KpiTile
            label="Impact carburant"
            value={`${fuelImpact >= 0 ? "+" : ""}${fuelImpact} k€`}
            sub={dirty ? "⚠ Non sauvegardé" : "vs réf. 28 L/100"}
            accent={Math.abs(parseFloat(fuelImpact)) > 30}
            trend={parseFloat(fuelImpact) > 0 ? "down" : "up"}
          />
        </KpiGrid>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

          {/* ── Assumptions form ──────────────────────────────────── */}
          <div className="xl:col-span-2">
            <SectionCard
              title="Paramètres de coûts variables"
              description="Ces valeurs alimentent le modèle M3 et propagent leur impact sur M5."
              actions={dirty && <Badge variant="amber">Modifications en attente</Badge>}
            >
              <AssumptionRow label="Forfait jour conducteurs" hint="Base de calcul coûts RH quotidiens" unit="€/j">
                <input
                  type="number" step="5" min="100" max="300"
                  className="h-10 w-28 rounded-lg border border-neutral-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-200"
                  value={local.salaryDayEUR}
                  onChange={(e) => set("salaryDayEUR", parseFloat(e.target.value) || 165)}
                />
                <span className="text-xs text-neutral-400">(réf. 165 €)</span>
              </AssumptionRow>
              <AssumptionRow label="Conso. tracteur GO" hint="L/100km standard flotte GO" unit="L/100km">
                <input
                  type="number" step="0.5" min="20" max="45"
                  className="h-10 w-28 rounded-lg border border-neutral-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-200"
                  value={local.fuelGO_L_100}
                  onChange={(e) => set("fuelGO_L_100", parseFloat(e.target.value) || 28)}
                />
                <span className="text-xs text-neutral-400">(réf. 28 L)</span>
              </AssumptionRow>
              <AssumptionRow label="Conso. tracteur GNC" hint="L/100km standard flotte GNC" unit="L/100km">
                <input
                  type="number" step="0.5" min="20" max="50"
                  className="h-10 w-28 rounded-lg border border-neutral-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-200"
                  value={local.fuelGNC_L_100}
                  onChange={(e) => set("fuelGNC_L_100", parseFloat(e.target.value) || 30.5)}
                />
                <span className="text-xs text-neutral-400">(réf. 30,5 L)</span>
              </AssumptionRow>
              <AssumptionRow label="Seuil alerte révision" hint="Km avant déclenchement alerte révision" unit="km">
                <input
                  type="number" step="5000" min="50000" max="300000"
                  className="h-10 w-32 rounded-lg border border-neutral-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-200"
                  value={local.revisionThresholdKm}
                  onChange={(e) => set("revisionThresholdKm", parseInt(e.target.value) || 180000)}
                />
                <span className="text-xs text-neutral-400">(réf. 180 000 km)</span>
              </AssumptionRow>
              <div className="mt-5 pt-4 border-t border-neutral-100 flex justify-end gap-2">
                {dirty && (
                  <Button variant="ghost" size="sm" onClick={handleReset}>Annuler les modifications</Button>
                )}
                <Button variant="primary" size="sm" icon={<Save className="w-4 h-4" />} onClick={handleSave}>
                  Sauvegarder et recalculer M5
                </Button>
              </div>
            </SectionCard>
          </div>

          {/* ── Impact panel ─────────────────────────────────────── */}
          <div className="xl:col-span-1 space-y-4">
            <SectionCard title="Impact estimé sur la marge">
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-neutral-100">
                  <span className="text-xs text-neutral-500">Impact salaires (vs réf.)</span>
                  <span className={`text-sm font-semibold ${parseFloat(salaryImpact) > 0 ? "text-red-600" : "text-emerald-600"}`}>
                    {salaryImpact >= 0 ? "+" : ""}{salaryImpact} k€
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-neutral-100">
                  <span className="text-xs text-neutral-500">Impact carburant (vs réf.)</span>
                  <span className={`text-sm font-semibold ${parseFloat(fuelImpact) > 0 ? "text-red-600" : "text-emerald-600"}`}>
                    {fuelImpact >= 0 ? "+" : ""}{fuelImpact} k€
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-xs font-semibold text-neutral-700">Total impact marge</span>
                  <span className={`text-sm font-bold ${parseFloat(totalImpact) > 0 ? "text-red-600" : "text-emerald-600"}`}>
                    {totalImpact >= 0 ? "+" : ""}{totalImpact} k€
                  </span>
                </div>
              </div>
              <div className="mt-3 flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-700">Après sauvegarde, les KPIs <strong>Marge</strong> et <strong>Delta théorique</strong> dans M5 se recalculent automatiquement.</p>
              </div>
            </SectionCard>
          </div>
        </div>

        {/* ── Breakdown chart — anatomy of theoretical costs ─────── */}
        <SectionCard
          title="Anatomie du coût théorique — 13 postes"
          description="Coût mensuel théorique par poste, trié par taille. Couleur = type de charge."
        >
          {/* Type legend */}
          <div className="flex flex-wrap gap-3 mb-4">
            {Object.entries(TYPE_COLOR).map(([type, color]) => (
              <span key={type} className="inline-flex items-center gap-1.5 text-xs text-neutral-600">
                <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: color }} />
                {type}
              </span>
            ))}
          </div>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={chartData}
                margin={{ top: 0, right: 60, bottom: 0, left: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                <XAxis
                  type="number"
                  tick={{ fontSize: 10, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${v}k€`}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 10, fill: "#374151" }}
                  width={140}
                  axisLine={false}
                  tickLine={false}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} name="Coût théo (k€)">
                  {chartData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} opacity={0.85} />
                  ))}
                </Bar>
                <Tooltip
                  formatter={(v, name, props) => [`${v} k€/mois`, props.payload?.fullName ?? name]}
                  contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #e5e7eb" }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        {/* ── Sensitivity table ─────────────────────────────────── */}
        <SectionCard
          title="Analyse de sensibilité"
          description="Impact sur le coût théorique mensuel et sur la marge si les paramètres clés varient."
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200 text-[10px] uppercase tracking-wider text-neutral-500">
                  <th className="py-2 text-left font-semibold">Scénario</th>
                  <th className="py-2 text-right font-semibold">Impact coût théo (k€)</th>
                  <th className="py-2 text-right font-semibold">Impact marge (k€)</th>
                  <th className="py-2 text-right font-semibold">Sens</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {sensitivityRows.map((sc) => (
                  <tr key={sc.key} className="hover:bg-neutral-50 transition-colors">
                    <td className="py-2.5 text-xs text-neutral-700 font-medium">{sc.label}</td>
                    <td className={`py-2.5 text-right font-mono text-xs font-semibold tabular-nums ${sc.impact > 0 ? "text-red-600" : sc.impact < 0 ? "text-emerald-700" : "text-neutral-400"}`}>
                      {sc.impact > 0 ? "+" : ""}{sc.impact} k€
                    </td>
                    <td className={`py-2.5 text-right font-mono text-xs font-semibold tabular-nums ${sc.margeImpact < 0 ? "text-red-600" : "text-emerald-700"}`}>
                      {sc.margeImpact > 0 ? "+" : ""}{sc.margeImpact} k€
                    </td>
                    <td className="py-2.5 text-right">
                      {sc.impact > 0
                        ? <TrendingUp className="w-3.5 h-3.5 text-red-500 inline" />
                        : <TrendingDown className="w-3.5 h-3.5 text-emerald-500 inline" />
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[11px] text-neutral-400">
            Les impacts sont calculés sur la base des valeurs théoriques actuelles de la grille 13 postes.
          </p>
        </SectionCard>

        {/* ── Per-poste reference table ─────────────────────────── */}
        <SectionCard
          title="Référentiel théorique — 13 postes"
          description="Tableau complet des coûts théoriques mensuels avec méthode de calcul et source."
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200 text-[10px] uppercase tracking-wider text-neutral-500">
                  <th className="py-2 text-left font-semibold">Poste</th>
                  <th className="py-2 text-left font-semibold">Type</th>
                  <th className="py-2 text-right font-semibold">Coût théo / mois</th>
                  <th className="py-2 text-right font-semibold">Part du total</th>
                  <th className="py-2 text-left font-semibold pl-4">Méthode</th>
                  <th className="py-2 text-left font-semibold">Fréquence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {[...m3CostGrid]
                  .sort((a, b) => b.coutTheoMensuel - a.coutTheoMensuel)
                  .map((row) => {
                    const pct = ((row.coutTheoMensuel / totalTheo) * 100).toFixed(1);
                    return (
                      <tr key={row.poste} className="hover:bg-neutral-50 transition-colors">
                        <td className="py-2.5 text-xs font-semibold text-neutral-900">{row.poste}</td>
                        <td className="py-2.5">
                          <span
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border"
                            style={{
                              backgroundColor: (TYPE_COLOR[row.type] ?? "#6b7280") + "18",
                              borderColor: (TYPE_COLOR[row.type] ?? "#6b7280") + "40",
                              color: TYPE_COLOR[row.type] ?? "#6b7280",
                            }}
                          >
                            {row.type}
                          </span>
                        </td>
                        <td className="py-2.5 text-right font-mono text-xs font-semibold tabular-nums text-neutral-800">
                          {(row.coutTheoMensuel / 1000).toFixed(1)} k€
                        </td>
                        <td className="py-2.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <div className="w-16 h-1.5 rounded-full bg-neutral-100 overflow-hidden">
                              <div
                                className="h-full rounded-full"
                                style={{ width: `${pct}%`, backgroundColor: TYPE_COLOR[row.type] ?? "#6b7280" }}
                              />
                            </div>
                            <span className="text-[10px] font-semibold text-neutral-500 tabular-nums w-8 text-right">{pct}%</span>
                          </div>
                        </td>
                        <td className="py-2.5 text-xs text-neutral-500 pl-4 max-w-[220px]">
                          <span className="line-clamp-1">{row.methode}</span>
                        </td>
                        <td className="py-2.5 text-[11px] text-neutral-400 whitespace-nowrap">{row.frequence}</td>
                      </tr>
                    );
                  })}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-neutral-200 bg-neutral-50">
                  <td colSpan={2} className="py-2.5 text-xs font-bold text-neutral-900">Total</td>
                  <td className="py-2.5 text-right font-mono text-xs font-bold text-neutral-900 tabular-nums">
                    {(totalTheo / 1000).toFixed(0)} k€
                  </td>
                  <td colSpan={3} />
                </tr>
              </tfoot>
            </table>
          </div>
        </SectionCard>

      </div>
    </PageShell>
  );
}
