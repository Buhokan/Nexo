// Sistema de gamificación — Nexo
// XP por acción, niveles, logros

export const XP_REWARDS = {
  FIRST_TRANSACTION: 100,
  DAILY_TRANSACTION: 10,
  STREAK_3_DAYS: 30,
  STREAK_7_DAYS: 100,
  STREAK_30_DAYS: 500,
  COMPLETE_GOAL: 200,
  CREATE_GOAL: 25,
  BUDGET_COMPLETED: 150,
  PERFECT_MONTH: 300, // Sin exceder presupuesto
  NO_SPEND_DAY: 20,
  EXPORT_DATA: 15,
  CUSTOM_CATEGORY: 20,
} as const;

// XP requerido por nivel (escala progresiva)
export const LEVEL_THRESHOLDS = [
  0,      // Nivel 1
  150,    // Nivel 2
  350,    // Nivel 3
  650,    // Nivel 4
  1050,   // Nivel 5
  1550,   // Nivel 6
  2200,   // Nivel 7
  3000,   // Nivel 8
  4000,   // Nivel 9
  5250,   // Nivel 10
  6750,   // Nivel 11
  8500,   // Nivel 12
  10500,  // Nivel 13
  12800,  // Nivel 14
  15400,  // Nivel 15
] as const;

export const LEVEL_NAMES = [
  "Principiante",    // 1
  "Observador",      // 2
  "Consciente",      // 3
  "Organizado",      // 4
  "Planificador",    // 5
  "Estratega",       // 6
  "Disciplinado",    // 7
  "Experto",         // 8
  "Maestro",         // 9
  "Elite",           // 10
  "Sabio",           // 11
  "Visionario",      // 12
  "Legendario",      // 13
  "Mítico",          // 14
  "Nexo Master",     // 15
] as const;

export const ACHIEVEMENTS = [
  {
    key: "first_transaction",
    name: "Primer paso",
    description: "Registraste tu primer gasto",
    emoji: "🌟",
    xpReward: 100,
    rarity: "COMMON" as const,
  },
  {
    key: "streak_3",
    name: "En racha",
    description: "3 días consecutivos registrando gastos",
    emoji: "🔥",
    xpReward: 30,
    rarity: "COMMON" as const,
  },
  {
    key: "streak_7",
    name: "Semana perfecta",
    description: "7 días consecutivos registrando gastos",
    emoji: "⚡",
    xpReward: 100,
    rarity: "RARE" as const,
  },
  {
    key: "streak_30",
    name: "Un mes de hábito",
    description: "30 días consecutivos registrando gastos",
    emoji: "🏆",
    xpReward: 500,
    rarity: "EPIC" as const,
  },
  {
    key: "first_goal",
    name: "Soñador con plan",
    description: "Creaste tu primer objetivo de ahorro",
    emoji: "🎯",
    xpReward: 25,
    rarity: "COMMON" as const,
  },
  {
    key: "goal_completed",
    name: "¡Meta cumplida!",
    description: "Completaste un objetivo de ahorro",
    emoji: "🎉",
    xpReward: 200,
    rarity: "RARE" as const,
  },
  {
    key: "transactions_10",
    name: "Activo",
    description: "Has registrado 10 transacciones",
    emoji: "📊",
    xpReward: 50,
    rarity: "COMMON" as const,
  },
  {
    key: "transactions_100",
    name: "Dedicado",
    description: "Has registrado 100 transacciones",
    emoji: "💎",
    xpReward: 200,
    rarity: "RARE" as const,
  },
  {
    key: "no_spend_day",
    name: "Día cero",
    description: "Un día sin gastar nada",
    emoji: "🧘",
    xpReward: 20,
    rarity: "COMMON" as const,
  },
  {
    key: "level_5",
    name: "Planificador",
    description: "Alcanzaste el nivel 5",
    emoji: "🚀",
    xpReward: 150,
    rarity: "RARE" as const,
  },
  {
    key: "level_10",
    name: "Experto Nexo",
    description: "Alcanzaste el nivel 10",
    emoji: "🌌",
    xpReward: 500,
    rarity: "EPIC" as const,
  },
  {
    key: "custom_category",
    name: "A tu medida",
    description: "Creaste una categoría personalizada",
    emoji: "🎨",
    xpReward: 20,
    rarity: "COMMON" as const,
  },
] as const;

export function getLevelFromXp(totalXp: number): number {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (totalXp >= LEVEL_THRESHOLDS[i]) return i + 1;
  }
  return 1;
}

export function getXpForNextLevel(level: number): number {
  if (level >= LEVEL_THRESHOLDS.length) return LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
  return LEVEL_THRESHOLDS[level] ?? LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
}

export function getLevelProgress(totalXp: number): number {
  const level = getLevelFromXp(totalXp);
  const currentThreshold = LEVEL_THRESHOLDS[level - 1] ?? 0;
  const nextThreshold = LEVEL_THRESHOLDS[level] ?? currentThreshold;
  if (nextThreshold === currentThreshold) return 100;
  return Math.round(((totalXp - currentThreshold) / (nextThreshold - currentThreshold)) * 100);
}
