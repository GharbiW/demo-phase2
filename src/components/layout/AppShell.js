"use client";

import { usePathname } from "next/navigation";
import { Sidebar, W_NAV_NARROW, W_NAV_WIDE } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { SidebarProvider, useSidebarContext } from "@/context/SidebarContext";
import { ToastProvider } from "@/components/ui/Toast";

const PUBLIC_PAGES = [];

function AppShellInner({ children }) {
  const pathname = usePathname();
  const { navWide } = useSidebarContext();

  const isPublicPage = PUBLIC_PAGES.some((page) => pathname?.startsWith(page));
  if (isPublicPage) return children;

  return (
    <div className="h-screen overflow-hidden bg-[#f8f8f8]">
      <TopBar />
      <Sidebar />
      <main
        className="h-full overflow-y-auto overflow-x-hidden transition-all duration-300 ease-out"
        style={{
          paddingLeft: navWide ? `${W_NAV_WIDE}px` : `${W_NAV_NARROW}px`,
          paddingTop: "calc(3.5rem + var(--staging-banner-height, 0px))",
        }}
      >
        <div className="h-full min-w-0 max-w-full overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}

export function AppShell({ children }) {
  return (
    <ToastProvider>
      <SidebarProvider>
        <AppShellInner>{children}</AppShellInner>
      </SidebarProvider>
    </ToastProvider>
  );
}

