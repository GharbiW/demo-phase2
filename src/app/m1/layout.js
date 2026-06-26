"use client";

import { BackofficeTabs } from "@/components/backoffice/BackofficeTabs";

export default function M1Layout({ children }) {
  return (
    <div className="min-h-full">
      <BackofficeTabs />
      {children}
    </div>
  );
}
