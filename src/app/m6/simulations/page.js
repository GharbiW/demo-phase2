"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { PageShell, SectionCard } from "@/components/ui/PageShell";
import { Zap, ArrowLeft, TrendingUp, TrendingDown, RefreshCw } from "lucide-react";
import { m4Tournees } from "@/lib/demo-data";
import { computeTourneeCostBreakdown } from "@/lib/cockpit-mock-data";

const BASE = {
  caTotal: 17_200_000,
  margeBrute: 1_940_000,
  txMarge: 11.3,
  carburantMensuel: 142_000,
};

export default function M6SimulationsPage() {
  const [tourneeId, setTourneeId] = useState("T-0422");
  const [fuelPumpPct, setFuelPumpPct] = useState(0);
  const [replaceFleetCm, setReplaceFleetCm] = useState(false);
  const [cassePct, setCassePct] = useState(1.4);
  const [routeDeltaKm, setRouteDeltaKm] = useState(0);
  const [tarifDeltaPct, setTarifDeltaPct] = useState(0);
  const [switchToGaz, setSwitchToGaz] = useState(false);

  const result = useMemo(() => {
    const extraFuelAnnual = (fuelPumpPct / 100) * BASE.carburantMensuel * 12;
    const fleetSaving = replaceFleetCm ? 186_000 : 0;
    const casseBase = BASE.caTotal * (0.014 / 100);
    const casseNew = BASE.caTotal * (cassePct / 100);
    const casseDelta = casseNew - casseBase;
    const margeProjetee = BASE.margeBrute - extraFuelAnnual + fleetSaving - casseDelta;
    const txProjete = (margeProjetee / BASE.caTotal) * 100;
    return { extraFuelAnnual, fleetSaving, casseDelta, margeProjetee, txProjete };
  }, [fuelPumpPct, replaceFleetCm, cassePct]);

  const tournee = m4Tournees.find((t) => t.id === tourneeId) || m4Tournees[0];
  const scenario = useMemo(() => {
    if (!tournee) return null;
    const base = computeTourneeCostBreakdown(tournee, { energy: "GO", vehicleType: "SPL" });
    if (!base) return null;
    const kmReelNew = Math.max(0, base.kmReel + routeDeltaKm);
    const caNew = tournee.ca * (1 + tarifDeltaPct / 100);
    const energy = switchToGaz ? "Gaz" : "GO";
    const recalced = computeTourneeCostBreakdown(
      { ...tournee, ca: caNew, km: kmReelNew, id: tournee.id },
      { energy, vehicleType: "SPL" },
    );
    const margeNew = caNew - recalced.reel.total;
    return { base, recalced, caNew, margeNew, kmReelNew, energy };
  }, [tourneeId, routeDeltaKm, tarifDeltaPct, switchToGaz]);

  const { margeProjetee, txProjete } = result;
  const up = margeProjetee >= BASE.margeBrute;

  return (
    <PageShell
      title="M6 — Simulateur what-if"
      subtitle="Sliders & toggles en temps réel — marge brute / EBITDA projeté (proxy démo)"
      actions={
        <Link href="/m6/recommandations" className="text-sm text-[color:var(--color-parnass-red)] font-semibold hover:underline inline-flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Insights
        </Link>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <SectionCard title="Scénario par tournée (What-if)">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-neutral-600 block mb-1.5">Tournée</label>
                <select
                  value={tourneeId}
                  onChange={(e) => setTourneeId(e.target.value)}
                  className="w-full h-10 rounded-xl border border-neutral-200 bg-white text-sm px-3"
                >
                  {m4Tournees.slice(0, 12).map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.id} · {t.client} · {t.km} km
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-neutral-500 mt-2">
                  Base marge : <span className="font-mono">{tournee?.marge?.toLocaleString("fr-FR")} €</span>
                </p>
              </div>
              <label className="flex items-center justify-between gap-4 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 cursor-pointer">
                <div>
                  <p className="text-sm font-semibold text-neutral-900">Remplacer GO → Gaz</p>
                  <p className="text-xs text-neutral-500 mt-0.5">Simule un changement d’énergie sur la tournée</p>
                </div>
                <input
                  type="checkbox"
                  checked={switchToGaz}
                  onChange={(e) => setSwitchToGaz(e.target.checked)}
                  className="h-5 w-5 rounded accent-[color:var(--color-parnass-red)] shrink-0"
                />
              </label>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between gap-2 mb-2">
                  <div>
                    <p className="text-sm font-semibold text-neutral-900">Modifier itinéraire (km)</p>
                    <p className="text-xs text-neutral-500">Impact km et péages (proxy)</p>
                  </div>
                  <span className={`text-sm font-mono font-bold ${routeDeltaKm > 0 ? "text-red-600" : routeDeltaKm < 0 ? "text-emerald-600" : "text-neutral-600"}`}>
                    {routeDeltaKm > 0 ? "+" : ""}{routeDeltaKm} km
                  </span>
                </div>
                <input
                  type="range"
                  min={-60}
                  max={80}
                  step={5}
                  value={routeDeltaKm}
                  onChange={(e) => setRouteDeltaKm(parseFloat(e.target.value))}
                  className="w-full h-2 rounded-full accent-amber-600"
                />
              </div>
              <div>
                <div className="flex justify-between gap-2 mb-2">
                  <div>
                    <p className="text-sm font-semibold text-neutral-900">Ajuster tarif client</p>
                    <p className="text-xs text-neutral-500">Impact direct sur CA tournée</p>
                  </div>
                  <span className={`text-sm font-mono font-bold ${tarifDeltaPct < 0 ? "text-red-600" : tarifDeltaPct > 0 ? "text-emerald-600" : "text-neutral-600"}`}>
                    {tarifDeltaPct > 0 ? "+" : ""}{tarifDeltaPct}%
                  </span>
                </div>
                <input
                  type="range"
                  min={-8}
                  max={8}
                  step={0.5}
                  value={tarifDeltaPct}
                  onChange={(e) => setTarifDeltaPct(parseFloat(e.target.value))}
                  className="w-full h-2 rounded-full accent-[color:var(--color-parnass-red)]"
                />
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Hypothèses (macro)">
            <div className="space-y-6">
              <div>
                <div className="flex justify-between gap-2 mb-2">
                  <div>
                    <p className="text-sm font-semibold text-neutral-900">Prix carburant à la pompe</p>
                    <p className="text-xs text-neutral-500">Fourchette −10 % / +10 % (impact coût GO annuel)</p>
                  </div>
                  <span className={`text-sm font-mono font-bold ${fuelPumpPct > 0 ? "text-red-600" : fuelPumpPct < 0 ? "text-emerald-600" : "text-neutral-600"}`}>
                    {fuelPumpPct > 0 ? "+" : ""}
                    {fuelPumpPct}%
                  </span>
                </div>
                <input
                  type="range"
                  min={-10}
                  max={10}
                  step={0.5}
                  value={fuelPumpPct}
                  onChange={(e) => setFuelPumpPct(parseFloat(e.target.value))}
                  className="w-full h-2 rounded-full accent-[color:var(--color-parnass-red)]"
                />
                <div className="flex justify-between text-[10px] text-neutral-400 mt-1">
                  <span>−10%</span>
                  <span>0</span>
                  <span>+10%</span>
                </div>
              </div>

              <label className="flex items-center justify-between gap-4 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 cursor-pointer">
                <div>
                  <p className="text-sm font-semibold text-neutral-900">Remplacer 20 % de la flotte SPL par des caisses mobiles</p>
                  <p className="text-xs text-neutral-500 mt-0.5">Économie carburant sur tournées courtes (ordre de grandeur démo)</p>
                </div>
                <input
                  type="checkbox"
                  checked={replaceFleetCm}
                  onChange={(e) => setReplaceFleetCm(e.target.checked)}
                  className="h-5 w-5 rounded accent-[color:var(--color-parnass-red)] shrink-0"
                />
              </label>

              <div>
                <div className="flex justify-between gap-2 mb-2">
                  <div>
                    <p className="text-sm font-semibold text-neutral-900">Taux de casse appliqué</p>
                    <p className="text-xs text-neutral-500">Base démo 1,4 % du CA — hausse dégrade la marge</p>
                  </div>
                  <span className="text-sm font-mono font-bold text-neutral-900">{cassePct.toFixed(1)}%</span>
                </div>
                <input
                  type="range"
                  min={1.2}
                  max={2.5}
                  step={0.05}
                  value={cassePct}
                  onChange={(e) => setCassePct(parseFloat(e.target.value))}
                  className="w-full h-2 rounded-full accent-amber-600"
                />
                <div className="flex justify-between text-[10px] text-neutral-400 mt-1">
                  <span>1,2%</span>
                  <span>1,4%</span>
                  <span>2,5%</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setTourneeId("T-0422");
                  setFuelPumpPct(0);
                  setReplaceFleetCm(false);
                  setCassePct(1.4);
                  setRouteDeltaKm(0);
                  setTarifDeltaPct(0);
                  setSwitchToGaz(false);
                }}
                className="inline-flex items-center gap-2 text-xs text-neutral-500 hover:text-neutral-800"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Réinitialiser
              </button>
            </div>
          </SectionCard>
        </div>

        <div className="space-y-4">
          <SectionCard title="Résultat live" className="border-emerald-200 bg-emerald-50/30">
            <div className="flex items-center gap-2 text-xs text-neutral-500 mb-1">
              <Zap className="w-4 h-4 text-emerald-600" />
              Marge brute / EBITDA projeté (proxy)
            </div>
            <p
              className={`text-4xl font-bold font-mono tracking-tight tabular-nums transition-all duration-300 ${
                margeProjetee >= 1_800_000 ? "text-emerald-700" : margeProjetee >= 1_500_000 ? "text-amber-700" : "text-red-600"
              }`}
            >
              {(margeProjetee / 1_000_000).toFixed(2)} M€
            </p>
            <div className="flex items-center gap-2 mt-2">
              {up ? <TrendingUp className="w-4 h-4 text-emerald-600" /> : <TrendingDown className="w-4 h-4 text-red-500" />}
              <span className="text-sm font-mono font-semibold text-neutral-800">{txProjete.toFixed(2)} % du CA</span>
              <span className="text-xs text-neutral-500">vs {BASE.txMarge}% base</span>
            </div>
          </SectionCard>

          <SectionCard title="Résultat tournée (scénario)" description="Calcul via Cost Engine (proxy démo)">
            {scenario ? (
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-600">Énergie</span>
                  <span className="font-mono font-semibold text-neutral-900">{scenario.energy}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-600">CA</span>
                  <span className="font-mono font-semibold text-neutral-900">{Math.round(scenario.caNew).toLocaleString("fr-FR")} €</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-600">Coût réel (estim.)</span>
                  <span className="font-mono font-semibold text-neutral-900">{Math.round(scenario.recalced.reel.total).toLocaleString("fr-FR")} €</span>
                </div>
                <div className="flex justify-between text-xs border-t border-neutral-200 pt-2">
                  <span className="text-neutral-800 font-semibold">Marge</span>
                  <span className={`font-mono font-bold ${scenario.margeNew >= 0 ? "text-emerald-700" : "text-red-600"}`}>
                    {Math.round(scenario.margeNew).toLocaleString("fr-FR")} €
                  </span>
                </div>
                <p className="text-[11px] text-neutral-500">
                  Km : {scenario.base.kmReel} → {scenario.kmReelNew} · Δ tarif {tarifDeltaPct > 0 ? "+" : ""}{tarifDeltaPct}%.
                </p>
              </div>
            ) : (
              <p className="text-xs text-neutral-500">Tournée non calculable (données démo manquantes).</p>
            )}
          </SectionCard>

          <SectionCard title="Décomposition des leviers (k€ / an)">
            <ul className="space-y-2 text-xs">
              <li className="flex justify-between">
                <span className="text-neutral-600">Carburant (prix pompe)</span>
                <span className={`font-mono font-semibold ${result.extraFuelAnnual <= 0 ? "text-emerald-600" : "text-red-600"}`}>
                  {result.extraFuelAnnual === 0
                    ? "—"
                    : `${result.extraFuelAnnual > 0 ? "−" : "+"}${Math.abs(Math.round(result.extraFuelAnnual / 1000))} k€`}
                </span>
              </li>
              <li className="flex justify-between">
                <span className="text-neutral-600">Flotte CM (si activé)</span>
                <span className="font-mono font-semibold text-emerald-600">
                  {result.fleetSaving ? `+${Math.round(result.fleetSaving / 1000)} k€` : "—"}
                </span>
              </li>
              <li className="flex justify-between">
                <span className="text-neutral-600">Casse (Δ vs 1,4 %)</span>
                <span className={`font-mono font-semibold ${result.casseDelta <= 0 ? "text-emerald-600" : "text-red-600"}`}>
                  {Math.abs(result.casseDelta) < 1 ? "—" : `${result.casseDelta > 0 ? "−" : "+"}${Math.abs(Math.round(result.casseDelta / 1000))} k€`}
                </span>
              </li>
            </ul>
          </SectionCard>
        </div>
      </div>
    </PageShell>
  );
}
