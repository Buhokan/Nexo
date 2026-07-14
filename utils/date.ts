import {
  format,
  formatRelative,
  startOfMonth,
  endOfMonth,
  startOfDay,
  endOfDay,
  isToday,
  isYesterday,
  parseISO,
  subMonths,
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
} from "date-fns";
import { es } from "date-fns/locale";

/**
 * Formatea una fecha en español
 * Ejemplo: "14 de julio de 2026"
 */
export function formatDate(date: Date | string, pattern: string = "d 'de' MMMM 'de' yyyy"): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, pattern, { locale: es });
}

/**
 * Formato corto: "14 jul"
 */
export function formatDateShort(date: Date | string): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "d MMM", { locale: es });
}

/**
 * Formato para agrupar transacciones: "Hoy", "Ayer", "14 de julio"
 */
export function formatDateGroup(date: Date | string): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  if (isToday(d)) return "Hoy";
  if (isYesterday(d)) return "Ayer";
  return format(d, "d 'de' MMMM", { locale: es });
}

/**
 * Formato relativo: "hace 2 horas", "ayer", "hace 3 días"
 */
export function formatRelativeDate(date: Date | string): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return formatRelative(d, new Date(), { locale: es });
}

/**
 * Nombre del mes en español: "Julio 2026"
 */
export function formatMonthYear(date: Date): string {
  return format(date, "MMMM yyyy", { locale: es });
}

/**
 * Nombre corto del mes: "Jul"
 */
export function formatMonthShort(date: Date): string {
  const m = format(date, "MMM", { locale: es });
  return m.charAt(0).toUpperCase() + m.slice(1);
}

/**
 * Rango del mes actual
 */
export function getCurrentMonthRange(): { start: Date; end: Date } {
  const now = new Date();
  return {
    start: startOfMonth(now),
    end: endOfMonth(now),
  };
}

/**
 * Rango del mes anterior
 */
export function getPreviousMonthRange(): { start: Date; end: Date } {
  const now = new Date();
  const prev = subMonths(now, 1);
  return {
    start: startOfMonth(prev),
    end: endOfMonth(prev),
  };
}

/**
 * Todos los días de un mes dado
 */
export function getDaysInMonth(date: Date): Date[] {
  return eachDayOfInterval({
    start: startOfMonth(date),
    end: endOfMonth(date),
  });
}

export {
  startOfMonth,
  endOfMonth,
  startOfDay,
  endOfDay,
  isToday,
  isYesterday,
  isSameDay,
  isSameMonth,
  subMonths,
  parseISO,
};
