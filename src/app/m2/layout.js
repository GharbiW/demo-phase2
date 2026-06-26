"use client";

import { BackofficeTabs } from "@/components/backoffice/BackofficeTabs";

export default function M2Layout({ children }) {
  return (
    <div className="min-h-full">
      <BackofficeTabs />
      {children}
    </div>
  );
}
