"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Bell, Maximize2, PanelLeftClose, PanelLeft, RotateCcw } from "lucide-react";
import { useSidebarContext } from "@/context/SidebarContext";
import { cn } from "@/lib/cn";
import { useDemoStore } from "@/stores/demoStore";
import { cockpitAgencies, cockpitPeriodOptions } from "@/lib/cockpit-mock-data";

function formatDateLabel(d) {
  try {
    return d.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      timeZone: "Europe/Paris",
    });
  } catch {
    return "—";
  }
}

function formatTimeLabel(d) {
  try {
    return d.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Europe/Paris",
    });
  } catch {
    return "—";
  }
}

export function TopBar() {
  const [now, setNow] = useState(null);
  const { state, actions } = useDemoStore();
  const { navWide, toggleNavWide } = useSidebarContext();

  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const dateLabel = useMemo(() => (now ? formatDateLabel(now) : "—"), [now]);
  const timeLabel = useMemo(() => (now ? formatTimeLabel(now) : "—"), [now]);

  return (
    <header
      className="fixed left-0 right-0 z-50 h-14 bg-[#0a0a0a] border-b border-neutral-800"
      style={{ top: "var(--staging-banner-height, 0px)" }}
    >
      <div className="flex items-center justify-between h-full px-4">
        <div className="hidden lg:flex items-center gap-4 min-w-[280px]">
          <div className="flex flex-col">
            <span className="text-white text-xs font-medium capitalize">
              {dateLabel}
            </span>
            <span className="text-neutral-500 text-[10px]">
              {timeLabel} · Paris (UTC+1)
            </span>
          </div>

          <div className="h-8 w-px bg-neutral-800" />

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-neutral-400 text-xs">
              Démo statique (aucune donnée réelle)
            </span>
          </div>
        </div>

        <div className="flex items-center justify-center flex-1">
          <Link href="/" className="cursor-pointer">
            <Image
              src="/logo-parnass/parnass-transport-logo.webp"
              alt="Parnass"
              width={140}
              height={36}
              className="h-8 w-auto min-w-[120px] brightness-0 invert"
              priority
            />
          </Link>
        </div>

        <div className="flex items-center justify-end gap-2 min-w-[220px] flex-wrap sm:flex-nowrap">
          <div className="hidden md:flex items-center gap-2 mr-1">
            <select
              value={state.period}
              onChange={(e) => actions.setPeriod(e.target.value)}
              aria-label="Période"
              title="Période"
              className="h-8 rounded-lg border border-neutral-700 bg-neutral-900 text-neutral-100 text-[11px] px-2 max-w-[112px] focus:outline-none focus:ring-1 focus:ring-[color:var(--color-parnass-red)]"
            >
              {cockpitPeriodOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <select
              value={state.agencyId}
              onChange={(e) => actions.setAgencyId(e.target.value)}
              aria-label="Agence"
              title="Agence"
              className="h-8 rounded-lg border border-neutral-700 bg-neutral-900 text-neutral-100 text-[11px] px-2 max-w-[130px] focus:outline-none focus:ring-1 focus:ring-[color:var(--color-parnass-red)]"
            >
              {cockpitAgencies.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.label}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={toggleNavWide}
            className={cn(
              "flex items-center justify-center h-9 w-9 rounded-xl border transition-colors shrink-0 mr-1",
              "border-neutral-700 bg-neutral-900/80 text-neutral-300 hover:text-white hover:border-neutral-500",
            )}
            aria-label={navWide ? "Réduire le menu latéral" : "Agrandir le menu latéral"}
          >
            {navWide ? <PanelLeftClose className="w-4 h-4" strokeWidth={1.75} /> : <PanelLeft className="w-4 h-4" strokeWidth={1.75} />}
          </button>

          <button
            type="button"
            className={cn(
              "hidden md:flex items-center gap-1.5 h-8 px-3 rounded-lg",
              "text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer text-xs",
            )}
            aria-label="Réinitialiser la démo"
            onClick={() => { actions.reset(); window.location.href = "/"; }}
          >
            <RotateCcw className="w-3.5 h-3.5" strokeWidth={2} />
            Reset démo
          </button>

          <button
            type="button"
            className={cn(
              "hidden md:flex items-center justify-center h-8 w-8 rounded-lg",
              "text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer",
            )}
            aria-label="Plein écran"
            onClick={() => {
              if (document.fullscreenElement) document.exitFullscreen();
              else document.documentElement.requestFullscreen();
            }}
          >
            <Maximize2 className="w-4 h-4" strokeWidth={1.5} />
          </button>

          <button
            type="button"
            className={cn(
              "relative flex items-center justify-center h-8 w-8 rounded-lg",
              "text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer",
            )}
            aria-label="Notifications (démo)"
            onClick={() => {}}
          >
            <Bell className="w-4 h-4" strokeWidth={1.5} />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#E80912]" />
          </button>

          <div className="h-5 w-px bg-neutral-700 mx-2" />

          <div className="flex items-center gap-2 rounded-lg border border-neutral-800 bg-neutral-900/40 px-2 py-1">
            <div className="h-6 w-6 rounded-full bg-[#E80912] text-white text-[10px] font-semibold flex items-center justify-center">
              WD
            </div>
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="text-xs text-neutral-200">Wael Demo</span>
              <span className="text-[10px] text-neutral-500 uppercase tracking-wide">
                Conception
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

