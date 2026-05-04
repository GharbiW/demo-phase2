"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { m5KPIs as baseKPIs } from "@/lib/demo-data";

const STORAGE_KEY = "parnass_phase2_demo_state_v1";

function clampNumber(n, { min = -Infinity, max = Infinity } = {}) {
  const v = typeof n === "number" && Number.isFinite(n) ? n : 0;
  return Math.min(max, Math.max(min, v));
}

function formatK(num, suffix = "k€") {
  const sign = num < 0 ? "-" : "";
  const abs = Math.abs(num);
  return `${sign}${abs.toFixed(0)} ${suffix}`;
}

function computeKPIs(state) {
  // Base: keep the same 11 KPIs list but make a few values reactive.
  // We only recompute a handful of headline metrics to keep the MVP demo coherent.
  const {
    assumptions: { salaryDayEUR, fuelGO_L_100, fuelGNC_L_100 },
    indexation: { indexationImpactKEUR },
  } = state;

  // Simple toy model (demo): higher assumptions increase costs and reduce margin.
  const salaryDelta = (salaryDayEUR - 165) * 3.2; // k€
  const fuelDelta = (fuelGO_L_100 - 28) * 18 + (fuelGNC_L_100 - 30.5) * 9; // k€
  const totalDelta = salaryDelta + fuelDelta; // k€

  const kpis = baseKPIs.map((k) => ({ ...k }));

  // KPI: Impact indexation
  const idx = kpis.findIndex((k) => k.kpi.toLowerCase().includes("indexation"));
  if (idx >= 0) {
    kpis[idx].value = `${indexationImpactKEUR >= 0 ? "+" : ""}${formatK(indexationImpactKEUR)}`;
    kpis[idx].color = indexationImpactKEUR < 200 ? "warn" : "ok";
  }

  // KPI: Marge
  const marginIdx = kpis.findIndex((k) => k.kpi.toLowerCase().includes("marge"));
  if (marginIdx >= 0) {
    // Start from a baseline 1.94M€ and reduce by totalDelta (k€)
    const baseMarginKEUR = 1940;
    const newMarginKEUR = baseMarginKEUR - totalDelta;
    const pct = clampNumber((newMarginKEUR / 17200) * 100, { min: -50, max: 50 }); // 17.2M baseline CA
    kpis[marginIdx].value = `${formatK(newMarginKEUR)} (${pct.toFixed(1)}%)`;
    kpis[marginIdx].color = newMarginKEUR < 1200 ? "warn" : "ok";
  }

  // KPI: Delta théorique vs réel
  const deltaIdx = kpis.findIndex((k) => k.kpi.toLowerCase().includes("delta théorique"));
  if (deltaIdx >= 0) {
    // Base -52k€, worsen if assumptions increase
    const baseDeltaKEUR = -52;
    const newDeltaKEUR = baseDeltaKEUR - totalDelta * 0.12;
    kpis[deltaIdx].value = `${newDeltaKEUR >= 0 ? "+" : ""}${formatK(newDeltaKEUR)}`;
    kpis[deltaIdx].color = Math.abs(newDeltaKEUR) > 70 ? "warn" : "ok";
  }

  return kpis;
}

function defaultState() {
  return {
    period: "M-1",
    agencyId: "all",
    activity: "Toutes",
    selectedContract: "FedEx",
    investigated: {},
    etlExceptions: [
      { id: "ex-1", source: "Engie", label: "Virgule sur quantité", status: "open" },
      { id: "ex-2", source: "AS24", label: "Plein dupliqué détecté", status: "open" },
      { id: "ex-3", source: "Solides", label: "Export partiel (10/04)", status: "open" },
    ],
    assumptions: {
      salaryDayEUR: 165,
      fuelGO_L_100: 28,
      fuelGNC_L_100: 30.5,
      revisionThresholdKm: 180000,
    },
    indexation: {
      base_indice: "CNR",
      type_carburant: "GO",
      mode_temporel: "M_MOINS_1",
      type_ponderation: "POURCENT_FORFAIT",
      ponderation_valeur: 0.35,
      km_contractuels: 22000,
      indexationImpactKEUR: 385,
    },
  };
}

const DemoStoreContext = createContext(null);

export function DemoStoreProvider({ children }) {
  const [state, setState] = useState(() => defaultState());

  // Load persisted state
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") return;
      setState((prev) => ({ ...prev, ...parsed }));
    } catch {
      // ignore
    }
  }, []);

  // Persist
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [state]);

  const kpis = useMemo(() => computeKPIs(state), [state]);

  const actions = useMemo(() => {
    return {
      setPeriod(period) {
        setState((s) => ({ ...s, period }));
      },
      setAgencyId(agencyId) {
        setState((s) => ({ ...s, agencyId }));
      },
      setActivity(activity) {
        setState((s) => ({ ...s, activity }));
      },
      setSelectedContract(selectedContract) {
        setState((s) => ({ ...s, selectedContract }));
      },
      updateAssumptions(patch) {
        setState((s) => ({ ...s, assumptions: { ...s.assumptions, ...patch } }));
      },
      updateIndexation(patch) {
        setState((s) => ({ ...s, indexation: { ...s.indexation, ...patch } }));
      },
      markInvestigated(key, value) {
        setState((s) => ({
          ...s,
          investigated: { ...s.investigated, [key]: Boolean(value) },
        }));
      },
      resolveException(id) {
        setState((s) => ({
          ...s,
          etlExceptions: s.etlExceptions.map((e) =>
            e.id === id ? { ...e, status: "resolved" } : e,
          ),
        }));
      },
      reset() {
        setState(defaultState());
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch {
          // ignore
        }
      },
    };
  }, []);

  const value = useMemo(
    () => ({
      state,
      kpis,
      actions,
    }),
    [state, kpis, actions],
  );

  return (
    <DemoStoreContext.Provider value={value}>
      {children}
    </DemoStoreContext.Provider>
  );
}

export function useDemoStore() {
  const ctx = useContext(DemoStoreContext);
  if (!ctx) throw new Error("useDemoStore must be used within DemoStoreProvider");
  return ctx;
}

