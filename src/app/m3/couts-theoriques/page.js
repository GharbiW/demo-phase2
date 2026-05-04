"use client";

import { useState } from "react";
import { Save, RefreshCw, Info, TrendingUp } from "lucide-react";
import { PageShell, SectionCard, KpiGrid, KpiTile } from "@/components/ui/PageShell";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import { useDemoStore } from "@/stores/demoStore";

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

  const salaryImpact = ((local.salaryDayEUR - 165) * 3.2).toFixed(0);
  const fuelImpact = ((local.fuelGO_L_100 - 28) * 18 + (local.fuelGNC_L_100 - 30.5) * 9).toFixed(0);
  const totalImpact = (parseFloat(salaryImpact) + parseFloat(fuelImpact)).toFixed(0);

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
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Impact preview */}
        <div className="xl:col-span-3">
          <KpiGrid cols={4}>
            <KpiTile label="Forfait jour conducteur" value={`${local.salaryDayEUR} €/j`} sub="Charges + congés SPL" />
            <KpiTile label="Conso. tracteur GO" value={`${local.fuelGO_L_100} L/100km`} sub="Norme flotte actuelle" />
            <KpiTile label="Conso. tracteur GNC" value={`${local.fuelGNC_L_100} L/100km`} sub="Norme flotte GNC" />
            <KpiTile
              label="Impact sur marge (k€)"
              value={`${totalImpact >= 0 ? "+" : ""}${totalImpact} k€`}
              sub={dirty ? "⚠ Non sauvegardé" : "vs référence"}
              accent={Math.abs(parseFloat(totalImpact)) > 50}
              trend={parseFloat(totalImpact) > 0 ? "down" : "up"}
            />
          </KpiGrid>
        </div>

        {/* Assumptions form */}
        <div className="xl:col-span-2">
          <SectionCard
            title="Paramètres de coûts variables"
            description="Ces valeurs alimentent le modèle M3 et propagent leur impact sur M5."
            actions={dirty && <Badge variant="amber">Modifications en attente</Badge>}
          >
            <AssumptionRow label="Forfait jour conducteurs" hint="Base de calcul coûts RH quotidiens" unit="€/j">
              <input
                type="number"
                step="5"
                min="100"
                max="300"
                className="h-10 w-28 rounded-lg border border-neutral-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-200"
                value={local.salaryDayEUR}
                onChange={(e) => set("salaryDayEUR", parseFloat(e.target.value) || 165)}
              />
              <span className="text-xs text-neutral-400">(réf. 165 €)</span>
            </AssumptionRow>

            <AssumptionRow label="Conso. tracteur GO" hint="L/100km standard flotte GO" unit="L/100km">
              <input
                type="number"
                step="0.5"
                min="20"
                max="45"
                className="h-10 w-28 rounded-lg border border-neutral-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-200"
                value={local.fuelGO_L_100}
                onChange={(e) => set("fuelGO_L_100", parseFloat(e.target.value) || 28)}
              />
              <span className="text-xs text-neutral-400">(réf. 28 L)</span>
            </AssumptionRow>

            <AssumptionRow label="Conso. tracteur GNC" hint="L/100km standard flotte GNC" unit="L/100km">
              <input
                type="number"
                step="0.5"
                min="20"
                max="50"
                className="h-10 w-28 rounded-lg border border-neutral-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-200"
                value={local.fuelGNC_L_100}
                onChange={(e) => set("fuelGNC_L_100", parseFloat(e.target.value) || 30.5)}
              />
              <span className="text-xs text-neutral-400">(réf. 30,5 L)</span>
            </AssumptionRow>

            <AssumptionRow label="Seuil alerte révision" hint="Km avant déclenchement alerte révision" unit="km">
              <input
                type="number"
                step="5000"
                min="50000"
                max="300000"
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

        {/* Side panel */}
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

          <SectionCard title="Autres hypothèses (fixes)">
            <div className="space-y-2 text-sm">
              {[
                ["Carburant frigo", "2 L/h fonctionnement"],
                ["Km/an (moyen)", "≈ 150 000 km/an"],
                ["Diviseur jours", "22 h/jour véhicule"],
                ["Casse/sinistres", "1,7% du CA"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between py-1.5 border-b border-neutral-100 last:border-0">
                  <span className="text-neutral-500">{k}</span>
                  <span className="text-neutral-700 font-medium">{v}</span>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </PageShell>
  );
}
