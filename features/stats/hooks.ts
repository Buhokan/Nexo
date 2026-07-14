import { useQuery } from "@tanstack/react-query";
import { getStatsOverview, getCategoryTrends, getSpendingByPaymentMethod, getDailyAverages, getMonthComparison } from "./actions";

export const STATS_KEYS = {
  all: ["stats"] as const,
  overview: (months: number) => [...STATS_KEYS.all, "overview", months] as const,
  categoryTrends: (months: number) => [...STATS_KEYS.all, "categoryTrends", months] as const,
  paymentMethods: (months: number) => [...STATS_KEYS.all, "paymentMethods", months] as const,
  dailyAverages: (months: number) => [...STATS_KEYS.all, "dailyAverages", months] as const,
  monthComparison: (months: number) => [...STATS_KEYS.all, "monthComparison", months] as const,
};

export function useStatsOverview(months: number) {
  return useQuery({
    queryKey: STATS_KEYS.overview(months),
    queryFn: () => getStatsOverview(months),
  });
}

export function useCategoryTrends(months: number) {
  return useQuery({
    queryKey: STATS_KEYS.categoryTrends(months),
    queryFn: () => getCategoryTrends(months),
  });
}

export function useSpendingByPaymentMethod(months: number) {
  return useQuery({
    queryKey: STATS_KEYS.paymentMethods(months),
    queryFn: () => getSpendingByPaymentMethod(months),
  });
}

export function useDailyAverages(months: number) {
  return useQuery({
    queryKey: STATS_KEYS.dailyAverages(months),
    queryFn: () => getDailyAverages(months),
  });
}

export function useMonthComparison(months: number) {
  return useQuery({
    queryKey: STATS_KEYS.monthComparison(months),
    queryFn: () => getMonthComparison(months),
  });
}
