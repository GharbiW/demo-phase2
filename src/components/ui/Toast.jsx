"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/cn";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(1);

  const push = useCallback((toast) => {
    const id = idRef.current++;
    const t = { id, variant: "success", title: "Enregistré", description: "", durationMs: 2200, ...toast };
    setToasts((prev) => [...prev, t]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((x) => x.id !== id));
    }, t.durationMs);
  }, []);

  const value = useMemo(() => ({ push }), [push]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-[calc(3.5rem+1rem)] z-[90] space-y-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "w-[320px] rounded-2xl border shadow-lg p-4 bg-white",
              t.variant === "success"
                ? "border-emerald-200"
                : t.variant === "warning"
                  ? "border-amber-200"
                  : "border-red-200",
            )}
          >
            <div className="text-sm font-semibold text-neutral-900">{t.title}</div>
            {t.description ? (
              <div className="mt-1 text-xs text-neutral-600">{t.description}</div>
            ) : null}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

// Simple inline toast for pages that manage their own state
export default function Toast({ message, onClose }) {
  if (!message) return null;
  return (
    <div className="fixed right-4 top-[calc(3.5rem+1rem)] z-[90] w-[340px] rounded-xl border border-emerald-200 bg-white shadow-lg p-4 animate-in slide-in-from-right-4 duration-300">
      <div className="flex items-start gap-3">
        <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
        <div className="flex-1 text-sm text-neutral-900">{message}</div>
        {onClose && (
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600 text-xs ml-2 shrink-0">✕</button>
        )}
      </div>
    </div>
  );
}

