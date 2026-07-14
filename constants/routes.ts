// Rutas de la aplicación — Nexo

export const ROUTES = {
  HOME: "/",
  DASHBOARD: "/dashboard",
  TRANSACTIONS: "/transacciones",
  CATEGORIES: "/categorias",
  GOALS: "/objetivos",
  STATS: "/estadisticas",
  CALENDAR: "/calendario",
  PROFILE: "/perfil",
  SETTINGS: "/configuracion",
  AI_ASSISTANT: "/asistente",
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
