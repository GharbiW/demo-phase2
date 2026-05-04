"use client";

import { cn } from "@/lib/cn";
import { createContext, useContext, useState } from "react";

const TabsContext = createContext(null);

export function Tabs({ defaultTab, children, className }) {
  const [active, setActive] = useState(defaultTab);
  return (
    <TabsContext.Provider value={{ active, setActive }}>
      <div className={cn("flex flex-col", className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ children, className }) {
  return (
    <div
      className={cn(
        "flex items-center gap-0 border-b border-neutral-200 overflow-x-auto",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Tab({ id, label, icon }) {
  const { active, setActive } = useContext(TabsContext);
  const isActive = active === id;
  return (
    <button
      type="button"
      onClick={() => setActive(id)}
      className={cn(
        "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap",
        isActive
          ? "border-[#E80912] text-neutral-900"
          : "border-transparent text-neutral-500 hover:text-neutral-700",
      )}
    >
      {icon ? <span className="text-current">{icon}</span> : null}
      {label}
    </button>
  );
}

export function TabPanel({ id, children }) {
  const { active } = useContext(TabsContext);
  if (active !== id) return null;
  return <div>{children}</div>;
}
