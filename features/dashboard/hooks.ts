import { useQuery } from "@tanstack/react-query";
import {
  getDashboardStats,
  getExpensesByCategory,
  getDailyExpenses,
  getMonthlyEvolution,
  getRecentTransactions,
  getActiveGoals,
  getGamificationQuickStats,
} from "./actions";

export const DASHBOARD_KEYS = {
  all: ["dashboard"] as const,
  stats: () => [...DASHBOARD_KEYS.all, "stats"] as const,
  categories: () => [...DASHBOARD_KEYS.all, "categories"] as const,
  daily: () => [...DASHBOARD_KEYS.all, "daily"] as const,
  monthly: () => [...DASHBOARD_KEYS.all, "monthly"] as const,
  transactions: () => [...DASHBOARD_KEYS.all, "transactions"] as const,
  goals: () => [...DASHBOARD_KEYS.all, "goals"] as const,
  gamification: () => [...DASHBOARD_KEYS.all, "gamification"] as const,
};

export function useDashboardStats() {
  return useQuery({
    queryKey: DASHBOARD_KEYS.stats(),
    queryFn: () => getDashboardStats(),
  });
}

export function useExpensesByCategory() {
  return useQuery({
    queryKey: DASHBOARD_KEYS.categories(),
    queryFn: () => getExpensesByCategory(),
  });
}

export function useDailyExpenses() {
  return useQuery({
    queryKey: DASHBOARD_KEYS.daily(),
    queryFn: () => getDailyExpenses(),
  });
}

export function useMonthlyEvolution() {
  return useQuery({
    queryKey: DASHBOARD_KEYS.monthly(),
    queryFn: () => getMonthlyEvolution(),
  });
}

export function useRecentTransactions() {
  return useQuery({
    queryKey: DASHBOARD_KEYS.transactions(),
    queryFn: () => getRecentTransactions(),
  });
}

export function useActiveGoals() {
  return useQuery({
    queryKey: DASHBOARD_KEYS.goals(),
    queryFn: () => getActiveGoals(),
  });
}

export function useGamificationQuickStats() {
  return useQuery({
    queryKey: DASHBOARD_KEYS.gamification(),
    queryFn: () => getGamificationQuickStats(),
  });
}
