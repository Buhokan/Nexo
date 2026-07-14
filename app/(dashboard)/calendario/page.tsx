"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { formatCurrency } from "@/utils/currency";
import { cn } from "@/utils/cn";
import { useMonthTransactions, useDayTransactions } from "@/features/calendar/hooks";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, parseISO } from "date-fns";
import { es } from "date-fns/locale";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0 },
};

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const { data: monthData, isLoading: isMonthLoading } = useMonthTransactions(year, month);
  const { data: dayTxs, isLoading: isDayLoading } = useDayTransactions(selectedDateStr ?? "");

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  // Generar días del calendario
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = new Date(monthStart);
  startDate.setDate(startDate.getDate() - (startDate.getDay() === 0 ? 6 : startDate.getDay() - 1)); // Lunes como primer día
  
  const endDate = new Date(monthEnd);
  endDate.setDate(endDate.getDate() + (7 - (endDate.getDay() === 0 ? 7 : endDate.getDay())));
  
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      
      {/* ─── Encabezado de Navegación ────────────────────────── */}
      <div className="flex items-center justify-between nexo-card p-4">
        <button
          onClick={handlePrevMonth}
          className="p-2 rounded-xl text-[var(--color-text-subtle)] hover:bg-[var(--color-surface-2)] transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        
        <h2 className="text-heading-3 text-[var(--color-text)] capitalize">
          {format(currentDate, "MMMM yyyy", { locale: es })}
        </h2>
        
        <button
          onClick={handleNextMonth}
          className="p-2 rounded-xl text-[var(--color-text-subtle)] hover:bg-[var(--color-surface-2)] transition-colors"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
        
        {/* ─── Grid del Calendario ─────────────────────────────── */}
        <motion.div variants={item} className="nexo-card p-4 sm:p-6">
          <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 text-center">
            {["L", "M", "X", "J", "V", "S", "D"].map((d, i) => (
              <div key={i} className="text-xs font-bold text-[var(--color-text-subtle)] pb-2">
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {days.map((day, idx) => {
              const dayStr = format(day, "yyyy-MM-dd");
              const isCurrentMonth = isSameMonth(day, monthStart);
              const isSelected = selectedDateStr === dayStr;
              const isDayToday = isToday(day);
              
              const dayData = monthData?.days?.[dayStr];
              const hasActivity = !!dayData;
              
              // Calcular opacidad basada en maxDayAmount para el heatmap
              let heatOpacity = 0;
              if (hasActivity && monthData?.maxDayAmount && dayData.expenses > 0) {
                heatOpacity = Math.max(0.1, (dayData.expenses / monthData.maxDayAmount) * 0.8);
              }

              return (
                <button
                  key={idx}
                  onClick={() => setSelectedDateStr(dayStr)}
                  className={cn(
                    "aspect-square rounded-xl flex flex-col items-center justify-center relative overflow-hidden transition-all",
                    !isCurrentMonth && "opacity-30",
                    isSelected ? "ring-2 ring-[var(--color-primary)] ring-offset-2 ring-offset-[var(--color-bg)]" : "",
                    isDayToday && !isSelected ? "border-2 border-[var(--color-primary-subtle)]" : "border border-transparent"
                  )}
                  style={{ 
                    background: hasActivity 
                      ? `rgba(239, 68, 68, ${heatOpacity})` 
                      : "var(--color-surface-2)" 
                  }}
                >
                  <span className={cn(
                    "text-xs sm:text-sm font-semibold z-10",
                    isCurrentMonth ? "text-[var(--color-text)]" : "text-[var(--color-text-muted)]"
                  )}>
                    {format(day, "d")}
                  </span>
                  
                  {hasActivity && (
                    <div className="absolute bottom-1.5 flex gap-0.5 z-10">
                      {dayData.income > 0 && <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-green)]" />}
                      {dayData.expenses > 0 && <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-red)]" />}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* ─── Resumen del Mes ─────────────────────────────────── */}
        <motion.div variants={item} className="grid grid-cols-3 gap-2">
          <div className="nexo-card p-3 flex flex-col items-center text-center">
            <span className="text-xs mb-1" style={{ color: "var(--color-text-muted)" }}>Ingresos</span>
            <span className="text-sm font-semibold text-number flex items-center gap-1" style={{ color: "var(--color-green)" }}>
              <ArrowUpRight size={14} />
              {isMonthLoading ? "..." : formatCurrency(monthData?.totalIncome ?? 0, "COP")}
            </span>
          </div>
          <div className="nexo-card p-3 flex flex-col items-center text-center">
            <span className="text-xs mb-1" style={{ color: "var(--color-text-muted)" }}>Gastos</span>
            <span className="text-sm font-semibold text-number flex items-center gap-1" style={{ color: "var(--color-red)" }}>
              <ArrowDownRight size={14} />
              {isMonthLoading ? "..." : formatCurrency(monthData?.totalExpenses ?? 0, "COP")}
            </span>
          </div>
          <div className="nexo-card p-3 flex flex-col items-center text-center" style={{ background: "var(--color-surface-2)" }}>
            <span className="text-xs mb-1" style={{ color: "var(--color-text-muted)" }}>Balance</span>
            <span className="text-sm font-semibold text-number" style={{ color: "var(--color-text)" }}>
              {isMonthLoading ? "..." : formatCurrency((monthData?.totalIncome ?? 0) - (monthData?.totalExpenses ?? 0), "COP")}
            </span>
          </div>
        </motion.div>

        {/* ─── Detalle del Día ─────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {selectedDateStr && (
            <motion.div
              key={selectedDateStr}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="nexo-card p-5"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-[var(--color-text)]">
                  {format(parseISO(selectedDateStr), "dd 'de' MMMM", { locale: es })}
                </h3>
                <button 
                  onClick={() => setSelectedDateStr(null)}
                  className="text-xs text-[var(--color-primary-light)] font-semibold px-2 py-1 bg-[var(--color-primary-subtle)] rounded-lg"
                >
                  Cerrar
                </button>
              </div>

              {isDayLoading ? (
                <div className="animate-pulse space-y-3">
                  {[1, 2].map(i => <div key={i} className="h-12 bg-[var(--color-surface-2)] rounded-xl" />)}
                </div>
              ) : dayTxs && dayTxs.length > 0 ? (
                <div className="space-y-2">
                  {dayTxs.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl bg-[var(--color-surface-2)]">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{tx.categoryEmoji}</div>
                        <div>
                          <p className="text-sm font-medium text-[var(--color-text)]">{tx.description}</p>
                          <p className="text-xs text-[var(--color-text-muted)]">{tx.categoryName}</p>
                        </div>
                      </div>
                      <span className={cn(
                        "text-sm font-bold text-number",
                        tx.type === "EXPENSE" ? "text-[var(--color-text)]" : "text-[var(--color-green)]"
                      )}>
                        {tx.type === "EXPENSE" ? "-" : "+"}{formatCurrency(tx.amount, "COP")}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-center text-[var(--color-text-muted)]">
                  <CalendarIcon size={32} className="mb-2 opacity-50" />
                  <p className="text-sm">No hay movimientos este día</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>
    </div>
  );
}
