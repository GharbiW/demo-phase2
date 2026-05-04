"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";

export function DemoCard({ title, description, href }) {
  return (
    <Link
      href={href}
      className={cn(
        "group rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm",
        "hover:shadow-md hover:-translate-y-[1px] transition-all",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-semibold text-neutral-900">{title}</div>
          <div className="mt-1 text-xs text-neutral-500">{description}</div>
        </div>
        <div className="h-9 w-9 rounded-xl border border-neutral-200 bg-neutral-50 flex items-center justify-center text-neutral-500 group-hover:text-neutral-900 group-hover:bg-white transition-colors">
          <ArrowRight className="h-4 w-4" />
        </div>
      </div>
    </Link>
  );
}

