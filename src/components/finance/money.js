/**
 * Format monétaire / % pour le cockpit rentabilité (démo FR).
 */

const EUR_FMT = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

const EUR_FMT_1 = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 1,
});

const NUM_FMT = new Intl.NumberFormat("fr-FR", {
  maximumFractionDigits: 0,
});

export function formatEuro(value, { compact = false } = {}) {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  if (compact && Math.abs(value) >= 1000) {
    const k = value / 1000;
    return `${k >= 0 ? "" : "−"}${Math.abs(k).toLocaleString("fr-FR", { maximumFractionDigits: 1 })} k€`;
  }
  return EUR_FMT.format(Math.round(value));
}

export function formatEuro1(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  return EUR_FMT_1.format(value);
}

export function formatSignedEuro(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  const sign = value > 0 ? "+" : value < 0 ? "−" : "";
  const abs = Math.abs(Math.round(value));
  return `${sign}${EUR_FMT.format(abs).replace("€", "").trim()} €`.replace(/\s+/g, " ").trim() || `${sign}${EUR_FMT.format(abs)}`;
}

export function formatPct(value, digits = 1) {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toLocaleString("fr-FR", { maximumFractionDigits: digits })} %`;
}

export function formatKEuro(valueK) {
  if (valueK === null || valueK === undefined || Number.isNaN(valueK)) return "—";
  return `${NUM_FMT.format(Math.round(valueK * 1000) / 1000).replace(/\s/g, "\u00a0")} k€`;
}
