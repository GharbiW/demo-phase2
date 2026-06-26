"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { BACKOFFICE_TABS } from "@/config/backoffice-tabs";

export function BackofficeTabs() {
  const pathname = usePathname();

  return (
    <div className="sticky top-0 z-[100] border-b border-neutral-200/90 bg-white/90 backdrop-blur-md shadow-sm">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-3 py-3">
          <div className="shrink-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-500">Module</p>
            <p className="text-sm font-bold text-neutral-950 leading-tight">Back office</p>
          </div>
          <div className="h-10 w-px bg-neutral-200 shrink-0 hidden sm:block" />
          <nav className="flex-1 min-w-0 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1 pb-0.5 min-w-max pr-2">
              {BACKOFFICE_TABS.map((t) => {
                const active = pathname === t.href || pathname.startsWith(`${t.href}/`);
                return (
                  <Link
                    key={t.slug}
                    href={t.href}
                    className={cn(
                      "shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold border transition-all",
                      active
                        ? "border-[color:var(--color-parnass-red)] bg-red-50 text-red-950 shadow-sm"
                        : "border-transparent bg-neutral-100/80 text-neutral-700 hover:bg-neutral-200/80 hover:border-neutral-200",
                    )}
                  >
                    <span className="hidden lg:inline">{t.label}</span>
                    <span className="lg:hidden">{t.short}</span>
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}
