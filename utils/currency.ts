import { CURRENCY_CONFIG } from "@/config/app.config";

/**
 * Formatea un número como moneda colombiana (COP) por defecto.
 * Nexo usa COP como moneda principal del MVP.
 */
export function formatCurrency(
  amount: number,
  currency: string = "COP",
  options?: Intl.NumberFormatOptions
): string {
  const config = CURRENCY_CONFIG[currency as keyof typeof CURRENCY_CONFIG] ?? CURRENCY_CONFIG.COP;

  return new Intl.NumberFormat(config.locale, {
    style: "currency",
    currency: config.code,
    minimumFractionDigits: config.decimals,
    maximumFractionDigits: config.decimals,
    ...options,
  }).format(amount);
}

/**
 * Formatea de forma compacta: $1.200.000 → $1,2M
 */
export function formatCurrencyCompact(amount: number, currency: string = "COP"): string {
  const config = CURRENCY_CONFIG[currency as keyof typeof CURRENCY_CONFIG] ?? CURRENCY_CONFIG.COP;

  if (Math.abs(amount) >= 1_000_000) {
    return `${config.symbol}${(amount / 1_000_000).toFixed(1)}M`;
  }
  if (Math.abs(amount) >= 1_000) {
    return `${config.symbol}${(amount / 1_000).toFixed(0)}K`;
  }
  return formatCurrency(amount, currency);
}

/**
 * Parsea un string de moneda a número
 */
export function parseCurrencyString(value: string): number {
  const cleaned = value.replace(/[^0-9,-]/g, "").replace(",", ".");
  return parseFloat(cleaned) || 0;
}

/**
 * Calcula el porcentaje de cambio entre dos valores
 */
export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / Math.abs(previous)) * 100);
}

/**
 * Formatea un porcentaje: 0.143 → "14.3%"
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}
