"use client";

import { RentabiliteTabs } from "@/components/rentabilite/RentabiliteTabs";

export default function RentabiliteLayout({ children }) {
  return (
    <div className="min-h-full">
      <RentabiliteTabs />
      {children}
    </div>
  );
}
