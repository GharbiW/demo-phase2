"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "parnass-demo-nav-wide";

const SidebarContext = createContext(null);

export function SidebarProvider({ children }) {
  const [navWide, setNavWideState] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw === "0") setNavWideState(false);
      if (raw === "1") setNavWideState(true);
    } catch {
      /* ignore */
    }
  }, []);

  const persist = useCallback((wide) => {
    try {
      localStorage.setItem(STORAGE_KEY, wide ? "1" : "0");
    } catch {
      /* ignore */
    }
  }, []);

  const setNavWide = useCallback(
    (wide) => {
      setNavWideState(wide);
      persist(wide);
    },
    [persist],
  );

  const toggleNavWide = useCallback(() => {
    setNavWideState((w) => {
      const next = !w;
      try {
        localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      navWide,
      setNavWide,
      toggleNavWide,
      isExpanded: navWide,
      setIsExpanded: setNavWide,
    }),
    [navWide, setNavWide, toggleNavWide],
  );

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}

export function useSidebarContext() {
  const ctx = useContext(SidebarContext);
  if (!ctx) {
    throw new Error("useSidebarContext must be used within SidebarProvider");
  }
  return ctx;
}
