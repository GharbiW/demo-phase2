"use client";

import { useState, useMemo } from "react";
import { PageShell } from "@/components/ui/PageShell";
import Toast from "@/components/ui/Toast";
import { m1Contracts } from "@/lib/demo-data";
import {
  MapPin, Truck, Calendar, ArrowRight, Calculator,
  TrendingUp, CheckCircle2, AlertTriangle, ChevronDown,
  Zap, BarChart3,
} from "lucide-react";
import { cn } from "@/lib/cn";

// ── Unit costs derived from m3CostGrid fleet averages ──────────────
// Fleet baseline: 15 SPL trucks, ~150,000 km/month, 21 driver-days each
const FLEET_KM_MONTH = 150000;
const FLEET_DRIVER_DAYS = 315; // 15 drivers × 21 days

const UNIT_COSTS_SPL = {
  loyerTracteur: { perDay: 152, label: "Loyer tracteur", type: "Fixe" },
  loyerRemorque: { perDay: 44, label: "Loyer semi-remorque", type: "Fixe" },
  assurance: { perDay: 38, label: "Assurance flotte", type: "Fixe" },
  salaire: { perDay: 552, label: "Salaires & charges RH", type: "Variable" },
  primesRH: { perDay: 57, label: "Primes & variables RH", type: "Variable" },
  carburant: { perKm: 0.947, label: "Carburant tracteur", type: "Variable" },
  peages: { perKm: 0.079, label: "Péages", type: "Variable" },
  pneumatiques: { perKm: 0.057, label: "Pneumatiques", type: "Variable" },
  entretien: { perKm: 0.147, label: "Entretien & maintenance", type: "Semi-var." },
  adblue: { perKm: 0.021, label: "AdBlue", type: "Variable" },
};

// Vehicle type multipliers on base SPL costs
const VEHICLE_PROFILES = [
  { id: "SPL", label: "SPL — Super Poids Lourd", sublabel: "Tracteur + semi (44T) · CE", multiplier: 1.0, icon: "🚛" },
  { id: "CM", label: "CM — Porteur Messagerie", sublabel: "Porteur léger · C/C1", multiplier: 0.68, icon: "🚚" },
  { id: "VL", label: "VL — Véhicule Léger", sublabel: "Livraison < 3,5T · B", multiplier: 0.32, icon: "🚐" },
];

// Casse rate (% of CA)
const CASSE_RATE = 0.017;

const CASSE_ENTRY = { label: "Casse / sinistres non assurés", type: "Var. lissé" };

const TYPE_COLORS = {
  Fixe: "text-slate-600 bg-slate-50 border-slate-200",
  Variable: "text-amber-700 bg-amber-50 border-amber-200",
  "Semi-var.": "text-sky-700 bg-sky-50 border-sky-200",
  "Var. lissé": "text-violet-700 bg-violet-50 border-violet-200",
};

function computeBreakdown(km, jours, vehicleMultiplier, margeCible) {
  const m = vehicleMultiplier;
  const lines = [
    { label: UNIT_COSTS_SPL.loyerTracteur.label, type: UNIT_COSTS_SPL.loyerTracteur.type, cost: UNIT_COSTS_SPL.loyerTracteur.perDay * jours * m },
    { label: UNIT_COSTS_SPL.loyerRemorque.label, type: UNIT_COSTS_SPL.loyerRemorque.type, cost: UNIT_COSTS_SPL.loyerRemorque.perDay * jours * m },
    { label: UNIT_COSTS_SPL.assurance.label, type: UNIT_COSTS_SPL.assurance.type, cost: UNIT_COSTS_SPL.assurance.perDay * jours * m },
    { label: UNIT_COSTS_SPL.salaire.label, type: UNIT_COSTS_SPL.salaire.type, cost: UNIT_COSTS_SPL.salaire.perDay * jours * m },
    { label: UNIT_COSTS_SPL.primesRH.label, type: UNIT_COSTS_SPL.primesRH.type, cost: UNIT_COSTS_SPL.primesRH.perDay * jours * m },
    { label: UNIT_COSTS_SPL.carburant.label, type: UNIT_COSTS_SPL.carburant.type, cost: UNIT_COSTS_SPL.carburant.perKm * km * m },
    { label: UNIT_COSTS_SPL.peages.label, type: UNIT_COSTS_SPL.peages.type, cost: UNIT_COSTS_SPL.peages.perKm * km * m },
    { label: UNIT_COSTS_SPL.pneumatiques.label, type: UNIT_COSTS_SPL.pneumatiques.type, cost: UNIT_COSTS_SPL.pneumatiques.perKm * km * m },
    { label: UNIT_COSTS_SPL.entretien.label, type: UNIT_COSTS_SPL.entretien.type, cost: UNIT_COSTS_SPL.entretien.perKm * km * m },
    { label: UNIT_COSTS_SPL.adblue.label, type: UNIT_COSTS_SPL.adblue.type, cost: UNIT_COSTS_SPL.adblue.perKm * km * m },
  ];

  const subtotal = lines.reduce((s, l) => s + l.cost, 0);
  const casse = subtotal * CASSE_RATE;
  lines.push({ label: CASSE_ENTRY.label, type: CASSE_ENTRY.type, cost: casse });

  const totalCost = subtotal + casse;
  const prixConseilleHT = totalCost / (1 - margeCible / 100);
  const margeEuros = prixConseilleHT - totalCost;

  return { lines, totalCost, prixConseilleHT, margeEuros };
}

const fmtEuro = (v) =>
  v.toLocaleString("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

export default function ChiffrageSpotPage() {
  const [depart, setDepart] = useState("Paris CDG");
  const [arrivee, setArrivee] = useState("Lyon Perrache");
  const [km, setKm] = useState(480);
  const [jours, setJours] = useState(2);
  const [vehicleId, setVehicleId] = useState("SPL");
  const [client, setClient] = useState("Nouveau client");
  const [margeCible, setMargeCible] = useState(18);
  const [toast, setToast] = useState(null);
  const [saved, setSaved] = useState(false);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  };

  const vehicle = VEHICLE_PROFILES.find((v) => v.id === vehicleId);

  const { lines, totalCost, prixConseilleHT, margeEuros } = useMemo(
    () => computeBreakdown(km, jours, vehicle.multiplier, margeCible),
    [km, jours, vehicle.multiplier, margeCible],
  );

  // Benchmark: 3 closest contracts by CA range
  const benchmarks = useMemo(() => {
    const annualEstimate = prixConseilleHT * 12;
    return [...m1Contracts]
      .sort((a, b) => Math.abs(a.caAnnuel - annualEstimate) - Math.abs(b.caAnnuel - annualEstimate))
      .slice(0, 3)
      .map((c) => ({
        ...c,
        tauxMarge: ((c.caAnnuel * 0.16) / c.caAnnuel) * 100,
        caParJour: Math.round(c.caAnnuel / 12 / 21),
      }));
  }, [prixConseilleHT]);

  const handleSave = () => {
    setSaved(true);
    showToast(`✓ Devis enregistré — ${client} · ${fmtEuro(prixConseilleHT)} HT`);
    setTimeout(() => setSaved(false), 3000);
  };

  const margePct = ((margeEuros / prixConseilleHT) * 100).toFixed(1);
  const isHealthy = margeCible >= 15;

  return (
    <PageShell
      moduleLabel="Module 1 · Commercial & Tarification"
      title="Chiffrage Spot"
      description="Estimez le coût théorique d'une prestation spot et obtenez un prix conseillé avec marge cible."
      bare
      actions={
        <button
          onClick={handleSave}
          disabled={saved}
          className={cn(
            "inline-flex items-center gap-2 h-9 px-4 rounded-lg text-white text-sm font-semibold transition-all shadow-sm",
            saved
              ? "bg-emerald-600 cursor-default"
              : "bg-[#E80912] hover:bg-[#c7080f]",
          )}
        >
          {saved ? <CheckCircle2 className="w-4 h-4" /> : <Calculator className="w-4 h-4" />}
          {saved ? "Devis enregistré" : "Enregistrer le devis"}
        </button>
      }
    >
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      <div className="space-y-5">

        {/* ── Input + Summary layout ───────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-5">

          {/* Input Panel */}
          <div className="rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-neutral-100 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#E80912] flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-900">Paramètres de la prestation</p>
                <p className="text-xs text-neutral-500">Renseignez le trajet, le type de véhicule et la durée</p>
              </div>
            </div>

            <div className="p-5 space-y-5">
              {/* Route */}
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-3 items-center">
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
                    Départ
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
                    <input
                      type="text"
                      value={depart}
                      onChange={(e) => setDepart(e.target.value)}
                      className="w-full h-10 pl-8 pr-3 rounded-lg border border-neutral-200 bg-neutral-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-colors"
                    />
                  </div>
                </div>
                <div className="hidden sm:flex items-center justify-center mt-5">
                  <ArrowRight className="w-4 h-4 text-neutral-400" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
                    Arrivée
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
                    <input
                      type="text"
                      value={arrivee}
                      onChange={(e) => setArrivee(e.target.value)}
                      className="w-full h-10 pl-8 pr-3 rounded-lg border border-neutral-200 bg-neutral-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Distance, Jours, Client */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
                    Distance (km)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={10}
                      max={5000}
                      value={km}
                      onChange={(e) => setKm(Math.max(10, Number(e.target.value)))}
                      className="w-full h-10 pl-3 pr-10 rounded-lg border border-neutral-200 bg-neutral-50 text-sm font-mono text-right focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-colors"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 font-semibold">km</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
                    Durée (jours)
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
                    <input
                      type="number"
                      min={1}
                      max={30}
                      value={jours}
                      onChange={(e) => setJours(Math.max(1, Number(e.target.value)))}
                      className="w-full h-10 pl-8 pr-10 rounded-lg border border-neutral-200 bg-neutral-50 text-sm font-mono text-right focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-colors"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 font-semibold">j</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
                    Client
                  </label>
                  <input
                    type="text"
                    value={client}
                    onChange={(e) => setClient(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-neutral-200 bg-neutral-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-colors"
                  />
                </div>
              </div>

              {/* Vehicle type */}
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                  Type de véhicule
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {VEHICLE_PROFILES.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setVehicleId(v.id)}
                      className={cn(
                        "flex items-start gap-3 p-3 rounded-xl border text-left transition-all",
                        vehicleId === v.id
                          ? "border-[#E80912] bg-red-50 ring-1 ring-[#E80912]/20"
                          : "border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50",
                      )}
                    >
                      <span className="text-xl shrink-0 mt-0.5">{v.icon}</span>
                      <div className="min-w-0">
                        <p className={cn("text-xs font-semibold leading-tight", vehicleId === v.id ? "text-[#E80912]" : "text-neutral-900")}>
                          {v.id}
                        </p>
                        <p className="text-[10px] text-neutral-500 leading-tight mt-0.5 truncate">{v.sublabel}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Panel */}
          <div className="flex flex-col gap-4">
            {/* Price result */}
            <div className={cn(
              "rounded-xl border shadow-sm overflow-hidden",
              isHealthy ? "border-emerald-200 bg-emerald-50/60" : "border-amber-200 bg-amber-50/60",
            )}>
              <div className="px-5 py-4 border-b border-white/60 flex items-center gap-3">
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", isHealthy ? "bg-emerald-600" : "bg-amber-600")}>
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-neutral-900">Prix conseillé HT</p>
                  <p className="text-xs text-neutral-500">Basé sur coût théorique + marge cible</p>
                </div>
              </div>
              <div className="px-5 py-5">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-4xl font-bold text-neutral-900 tabular-nums font-mono">
                    {fmtEuro(prixConseilleHT)}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1 mb-4">
                  <span className={cn(
                    "inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border",
                    isHealthy ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-amber-100 text-amber-700 border-amber-200",
                  )}>
                    {isHealthy ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                    {margePct}% marge · {fmtEuro(margeEuros)}
                  </span>
                </div>

                {/* Margin slider */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-neutral-600">Marge cible</label>
                    <span className={cn(
                      "text-sm font-bold tabular-nums",
                      isHealthy ? "text-emerald-700" : "text-amber-700",
                    )}>
                      {margeCible}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={35}
                    step={1}
                    value={margeCible}
                    onChange={(e) => setMargeCible(Number(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer accent-[#E80912]"
                  />
                  <div className="flex justify-between text-[10px] text-neutral-400 mt-1">
                    <span>5%</span>
                    <span className="text-amber-600 font-semibold">≥15% cible</span>
                    <span>35%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cost summary */}
            <div className="rounded-xl border border-neutral-200 bg-white shadow-sm p-4">
              <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-3">Coût théorique estimé</p>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-2xl font-bold text-neutral-900 tabular-nums font-mono">
                  {fmtEuro(totalCost)}
                </span>
              </div>
              <div className="flex gap-4 mt-2 text-xs text-neutral-500">
                <span><span className="font-semibold text-neutral-700">{fmtEuro(totalCost / km)}</span> /km</span>
                <span><span className="font-semibold text-neutral-700">{fmtEuro(totalCost / jours)}</span> /jour</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Cost Breakdown ───────────────────────────────────────── */}
        <section className="rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center shrink-0">
                <BarChart3 className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-900">Décomposition par poste</p>
                <p className="text-xs text-neutral-500">
                  {depart} → {arrivee} · {km} km · {jours} j · {vehicle.id}
                </p>
              </div>
            </div>
            <span className="text-sm font-bold text-neutral-900 tabular-nums shrink-0">{fmtEuro(totalCost)}</span>
          </div>

          <div className="divide-y divide-neutral-50">
            {lines.map((line, i) => {
              const pct = (line.cost / totalCost) * 100;
              return (
                <div key={i} className="flex items-center gap-4 px-5 py-3 hover:bg-neutral-50/60 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-neutral-800">{line.label}</span>
                      <span className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded-full border shrink-0", TYPE_COLORS[line.type])}>
                        {line.type}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-neutral-100 overflow-hidden">
                      <div
                        className="h-full bg-[#E80912]/60 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, pct * 3)}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-right shrink-0 w-24">
                    <div className="text-sm font-semibold text-neutral-900 tabular-nums font-mono">{fmtEuro(line.cost)}</div>
                    <div className="text-[10px] text-neutral-400 tabular-nums">{pct.toFixed(1)}%</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Totals row */}
          <div className="border-t border-neutral-200 bg-neutral-50 px-5 py-3 flex items-center justify-between">
            <span className="text-sm font-bold text-neutral-900">Total coût théorique</span>
            <div className="text-right">
              <div className="text-lg font-bold text-neutral-900 tabular-nums font-mono">{fmtEuro(totalCost)}</div>
              <div className="text-[11px] text-neutral-500">Prix conseillé : <span className="font-semibold text-emerald-700">{fmtEuro(prixConseilleHT)}</span></div>
            </div>
          </div>
        </section>

        {/* ── Benchmark strip ──────────────────────────────────────── */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-900">Benchmark contrats similaires</p>
              <p className="text-xs text-neutral-500">3 contrats actifs les plus proches par CA annuel estimé</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {benchmarks.map((c) => {
              const mensuel = c.caAnnuel / 12;
              const margeApprox = mensuel * 0.16;
              const txMarge = 16;
              return (
                <div key={c.id} className="rounded-xl border border-neutral-200 bg-white p-4 hover:border-neutral-300 hover:shadow-sm transition-all">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <p className="text-sm font-semibold text-neutral-900">{c.client}</p>
                      <p className="text-[10px] text-neutral-500">{c.type}</p>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                      Actif
                    </span>
                  </div>
                  <div className="space-y-1.5 mt-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-500">CA mensuel moyen</span>
                      <span className="font-semibold text-neutral-900 tabular-nums font-mono">{fmtEuro(mensuel)}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-500">Taux marge brute</span>
                      <span className="font-semibold text-emerald-700 tabular-nums">{txMarge}%</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-500">Indice base</span>
                      <span className="font-medium text-neutral-700">{c.indexation.base_indice}</span>
                    </div>
                  </div>
                  <div className="mt-3 h-1.5 rounded-full bg-neutral-100 overflow-hidden">
                    <div
                      className="h-full bg-emerald-400 rounded-full"
                      style={{ width: `${Math.min(100, (mensuel / (prixConseilleHT * 2)) * 100)}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-neutral-400 mt-1">
                    {mensuel > prixConseilleHT
                      ? `CA moyen ${Math.round(((mensuel - prixConseilleHT) / prixConseilleHT) * 100)}% au-dessus de ce devis`
                      : `CA moyen ${Math.round(((prixConseilleHT - mensuel) / prixConseilleHT) * 100)}% en-dessous de ce devis`}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Info note ────────────────────────────────────────────── */}
        <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3.5">
          <Truck className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
          <p className="text-sm text-blue-800 leading-relaxed">
            <strong>Coûts théoriques basés sur les standards de la grille M3.</strong>{" "}
            Les taux unitaires (carburant, RH, loyers) sont calculés depuis les moyennes de flotte — 15 tracteurs SPL, 150 000 km/mois, 21 jours conducteur. Ajustez les hypothèses dans{" "}
            <a href="/m3/couts-theoriques" className="underline font-semibold">M3 · Coûts théoriques</a>.
          </p>
        </div>

      </div>
    </PageShell>
  );
}
