"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { demoSidebarModules } from "@/config/navigation";
import { useSidebarContext } from "@/context/SidebarContext";
import { Lock } from "lucide-react";

const W_NAV_WIDE = 272;
const W_NAV_NARROW = 72;

export { W_NAV_WIDE, W_NAV_NARROW };

export function Sidebar() {
  const pathname = usePathname();
  const { navWide } = useSidebarContext();

  const isModuleActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const isSectionActive = (href) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <aside
      className={cn(
        "fixed left-0 z-50 flex flex-col border-r border-neutral-800/90",
        "bg-gradient-to-b from-neutral-950 via-[#0a0a0a] to-neutral-950",
        "transition-[width] duration-300 ease-out overflow-hidden shadow-[4px_0_24px_rgba(0,0,0,0.35)]",
      )}
      style={{
        width: navWide ? W_NAV_WIDE : W_NAV_NARROW,
        top: "calc(3.5rem + var(--staging-banner-height, 0px))",
        height: "calc(100vh - 3.5rem - var(--staging-banner-height, 0px))",
      }}
    >
      <nav className="flex flex-col py-3 flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
        {demoSidebarModules.map((module) => {
          // ── Group separator ─────────────────────────────────────
          if (module.type === "separator") {
            return (
              <div key={module.label} className="mt-3 mb-1 mx-2 flex items-center gap-2">
                <div className="h-px flex-1 bg-white/[0.07]" />
                {navWide && (
                  <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-neutral-600 shrink-0 px-1">
                    {module.label}
                  </span>
                )}
                <div className="h-px flex-1 bg-white/[0.07]" />
              </div>
            );
          }

          const Icon = module.icon;
          const active = isModuleActive(module.href);
          const visibleSections = module.sections ?? [];
          const targetHref =
            active && pathname.startsWith(module.href)
              ? pathname
              : visibleSections?.length > 0
                ? visibleSections[0].href
                : module.href;

          return (
            <div key={module.href} className="flex flex-col flex-shrink-0 mb-0.5">
              <Link
                href={targetHref}
                className={cn(
                  "group relative flex items-center rounded-lg transition-all duration-200 cursor-pointer mx-2",
                  navWide ? "gap-3 px-3 h-10" : "justify-center h-11 w-11 mx-auto",
                  active
                    ? "text-white bg-white/[0.08] ring-1 ring-white/10"
                    : "text-neutral-500 hover:text-white hover:bg-white/[0.05]",
                )}
              >
                {active && (
                  <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full bg-[color:var(--color-parnass-red)] shadow-[0_0_12px_rgba(232,9,18,0.45)]"
                    aria-hidden
                  />
                )}
                <Icon className={cn("shrink-0", navWide ? "h-[18px] w-[18px]" : "h-5 w-5")} strokeWidth={active ? 2 : 1.5} />
                {navWide ? (
                  <span className="text-[13px] font-medium tracking-tight truncate flex items-center gap-1.5">
                    {module.name}
                    {module.locked && (
                      <span className="inline-flex items-center gap-0.5 rounded-full bg-violet-900/50 border border-violet-600/40 px-1.5 py-0.5 text-[9px] font-bold text-violet-200 leading-none">
                        <Lock className="w-2 h-2" />
                        {module.badge}
                      </span>
                    )}
                  </span>
                ) : null}
              </Link>

              {navWide && active && visibleSections.length > 0 && (
                <div className="mt-1.5 mx-2 rounded-lg border border-white/5 bg-white/[0.03] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                  <div className="flex flex-col gap-0.5">
                    {visibleSections.map((section) => {
                      const SectionIcon = section.icon;
                      const sectionActive = isSectionActive(section.href);
                      return (
                        <Link
                          key={section.href}
                          href={section.href}
                          className={cn(
                            "group relative flex items-center gap-2.5 py-2 px-2.5 rounded-md text-[12px] transition-colors min-w-0",
                            sectionActive
                              ? "text-white bg-white/[0.08] font-medium"
                              : "text-neutral-400 hover:text-white hover:bg-white/[0.05]",
                          )}
                        >
                          {sectionActive && (
                            <span
                              className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-full bg-[color:var(--color-parnass-red)] shadow-[0_0_10px_rgba(232,9,18,0.35)]"
                              aria-hidden
                            />
                          )}
                          <SectionIcon
                            className={cn(
                              "h-3.5 w-3.5 shrink-0 opacity-70 transition-opacity",
                              sectionActive ? "opacity-90" : "group-hover:opacity-90",
                            )}
                            strokeWidth={1.75}
                          />
                          <span className="truncate">{section.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </nav>

    </aside>
  );
}
