// Configuración global de la aplicación Nexo

export const APP_CONFIG = {
  name: "Nexo",
  description: "Tu plataforma de finanzas personales",
  version: "1.0.0",
  defaultCurrency: "COP",
  defaultLocale: "es-CO",
  defaultTimezone: "America/Bogota",
  defaultUserId: "default",
} as const;

export const CURRENCY_CONFIG = {
  COP: {
    symbol: "$",
    code: "COP",
    name: "Peso colombiano",
    locale: "es-CO",
    decimals: 0,
  },
  USD: {
    symbol: "$",
    code: "USD",
    name: "Dólar estadounidense",
    locale: "en-US",
    decimals: 2,
  },
  EUR: {
    symbol: "€",
    code: "EUR",
    name: "Euro",
    locale: "es-ES",
    decimals: 2,
  },
} as const;
