import { useQuery } from "@tanstack/react-query";
import { getMonthTransactions, getDayTransactions } from "./actions";

export const CALENDAR_KEYS = {
  all: ["calendar"] as const,
  month: (year: number, month: number) => [...CALENDAR_KEYS.all, "month", year, month] as const,
  day: (dateStr: string) => [...CALENDAR_KEYS.all, "day", dateStr] as const,
};

export function useMonthTransactions(year: number, month: number) {
  return useQuery({
    queryKey: CALENDAR_KEYS.month(year, month),
    queryFn: () => getMonthTransactions(year, month),
  });
}

export function useDayTransactions(dateStr: string) {
  return useQuery({
    queryKey: CALENDAR_KEYS.day(dateStr),
    queryFn: () => getDayTransactions(dateStr),
    enabled: !!dateStr,
  });
}
