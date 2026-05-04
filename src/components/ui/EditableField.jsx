"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";

export function EditableField({
  label,
  value,
  type = "text",
  step,
  min,
  max,
  format,
  onSave,
  description,
  saveLabel = "Enregistrer",
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value ?? "");

  const display = useMemo(() => {
    if (format) return format(value);
    return String(value ?? "—");
  }, [value, format]);

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-neutral-900">{label}</div>
          {description ? (
            <div className="mt-1 text-xs text-neutral-500">{description}</div>
          ) : null}
        </div>
        {!editing ? (
          <button
            type="button"
            className="h-9 px-3 rounded-lg border border-neutral-200 bg-neutral-50 hover:bg-white text-sm text-neutral-800 transition-colors"
            onClick={() => {
              setDraft(value ?? "");
              setEditing(true);
            }}
          >
            Modifier
          </button>
        ) : null}
      </div>

      <div className="mt-3 flex items-center justify-between gap-4">
        {!editing ? (
          <div className="text-lg font-semibold text-neutral-900">{display}</div>
        ) : (
          <div className="flex items-center gap-2">
            <input
              className={cn(
                "h-10 w-[220px] rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-900",
                "focus:outline-none focus:ring-2 focus:ring-neutral-200",
              )}
              value={draft}
              type={type}
              step={step}
              min={min}
              max={max}
              onChange={(e) => setDraft(e.target.value)}
            />
            <button
              type="button"
              className="h-10 px-4 rounded-lg bg-[#E80912] hover:bg-[#c7080f] text-white text-sm font-medium transition-colors"
              onClick={() => {
                setEditing(false);
                onSave?.(draft);
              }}
            >
              {saveLabel}
            </button>
            <button
              type="button"
              className="h-10 px-4 rounded-lg border border-neutral-200 bg-neutral-50 hover:bg-white text-sm text-neutral-800 transition-colors"
              onClick={() => {
                setDraft(value ?? "");
                setEditing(false);
              }}
            >
              Annuler
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

