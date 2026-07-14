"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { formatCurrency } from "@/utils/currency";
import { cn } from "@/utils/cn";
import { TrendingDown, TrendingUp, AlertTriangle, Wallet, Download } from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend
} from "recharts";
import { 
  useStatsOverview, 
  useCategoryTrends, 
  useSpendingByPaymentMethod, 
  useDailyAverages, 
  useMonthComparison 
} from "@/features/stats/hooks";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0 },
};

const CATEGORY_COLORS = ["#7C5CFF", "#4DA3FF", "#22C55E", "#F59E0B", "#EF4444", "#34D399", "#9B82FF", "#8B8B9E"];

export default function StatsPage() {
  const [months, setMonths] = useState(3);

  const { data: overview, isLoading: isOverviewLoading } = useStatsOverview(months);
  const { data: trends, isLoading: isTrendsLoading } = useCategoryTrends(months);
  const { data: paymentMethods, isLoading: isPaymentLoading } = useSpendingByPaymentMethod(months);
  const { data: dailyAvg, isLoading: isDailyLoading } = useDailyAverages(months);
  const { data: comparison, isLoading: isComparisonLoading } = useMonthComparison(months);

  const isLoading = isOverviewLoading || isTrendsLoading || isPaymentLoading || isDailyLoading || isComparisonLoading;

  const handleExportCSV = () => {
    window.location.href = `/api/export/transactions?months=${months}`;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 overflow-hidden">
      
      {/* ─── Encabezado ────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-heading-2 mb-1" style={{ color: "var(--color-text)" }}>
            Estadísticas
          </h2>
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
            Análisis profundo de tus finanzas
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
            style={{ background: "var(--color-surface-2)", color: "var(--color-text)", border: "1px solid var(--color-border)" }}
          >
            <Download size={16} />
            Exportar CSV
          </button>
          
          <div className="flex bg-[var(--color-surface-2)] rounded-xl p-1 shrink-0 w-max">
            {[1, 3, 6, 12].map((m) => (
              <button
                key={m}
                onClick={() => setMonths(m)}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-sm font-semibold transition-all",
                  months === m 
                    ? "bg-[var(--color-primary)] text-white shadow-md shadow-[var(--color-primary-subtle)]"
                    : "text-[var(--color-text-subtle)] hover:text-[var(--color-text)]"
                )}
              >
                {m === 1 ? "1 Mes" : m === 12 ? "1 Año" : `${m} Meses`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-[var(--color-surface-2)] rounded-2xl" />)}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-[300px] bg-[var(--color-surface-2)] rounded-3xl" />
            <div className="h-[300px] bg-[var(--color-surface-2)] rounded-3xl" />
          </div>
          <div className="h-[400px] bg-[var(--color-surface-2)] rounded-3xl" />
        </div>
      ) : (
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
          
          {/* ─── KPIs Principales ─────────────────────────────────── */}
          <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="nexo-card p-4">
              <span className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider block mb-1">
                Promedio Mensual
              </span>
              <p className="text-lg md:text-xl font-bold text-number" style={{ color: "var(--color-red)" }}>
                {formatCurrency(overview?.avgMonthlyExpense ?? 0, "COP")}
              </p>
            </div>
            
            <div className="nexo-card p-4">
              <span className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider block mb-1">
                Tasa de Ahorro Avg
              </span>
              <div className="flex items-center gap-1.5">
                <p className="text-lg md:text-xl font-bold text-number text-[var(--color-green)]">
                  {(overview?.avgSavingsRate ?? 0).toFixed(1)}%
                </p>
                {overview && overview.avgSavingsRate < 20 && (
                  <AlertTriangle size={14} className="text-[var(--color-amber)]" />
                )}
              </div>
            </div>

            <div className="nexo-card p-4">
              <span className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider block mb-1">
                Mes más caro
              </span>
              <p className="text-[15px] font-bold text-[var(--color-text)] truncate">{overview?.maxMonth.name || "-"}</p>
              <p className="text-xs text-[var(--color-text-subtle)] truncate text-number">
                {overview?.maxMonth.amount ? formatCurrency(overview.maxMonth.amount, "COP") : ""}
              </p>
            </div>

            <div className="nexo-card p-4">
              <span className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider block mb-1">
                Top Categoría
              </span>
              <p className="text-[15px] font-bold text-[var(--color-text)] truncate">{overview?.maxCategory.name || "-"}</p>
              <p className="text-xs text-[var(--color-text-subtle)] truncate text-number">
                {overview?.maxCategory.amount ? formatCurrency(overview.maxCategory.amount, "COP") : ""}
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ─── Día más Caro de la Semana ──────────────────────── */}
            <motion.div variants={item} className="nexo-card p-5">
              <h3 className="text-sm font-semibold text-[var(--color-text)] mb-4 uppercase tracking-wider">
                Gasto Promedio por Día
              </h3>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyAvg} layout="vertical" margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <XAxis type="number" hide />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: "var(--color-text-muted)", fontSize: 12, fontWeight: 600 }}
                    />
                    <Tooltip 
                      cursor={{ fill: "var(--color-surface-2)" }}
                      contentStyle={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "12px" }}
                      formatter={(val: any) => [formatCurrency(val, "COP"), "Promedio"]}
                    />
                    <Bar dataKey="avg" radius={[0, 8, 8, 0]}>
                      {dailyAvg?.map((entry, index) => {
                        const isMax = entry.avg === Math.max(...(dailyAvg.map(d => d.avg)));
                        return <Cell key={`cell-${index}`} fill={isMax ? "var(--color-red)" : "var(--color-primary-subtle)"} />;
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* ─── Distribución por Método de Pago ────────────────── */}
            <motion.div variants={item} className="nexo-card p-5">
              <h3 className="text-sm font-semibold text-[var(--color-text)] mb-4 uppercase tracking-wider">
                Métodos de Pago
              </h3>
              <div className="h-[250px] w-full flex items-center justify-center">
                {paymentMethods && paymentMethods.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={paymentMethods}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {paymentMethods.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "12px" }}
                        itemStyle={{ color: "var(--color-text)" }}
                        formatter={(val: any) => formatCurrency(val, "COP")}
                      />
                      <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px' }}/>
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center text-[var(--color-text-muted)] flex flex-col items-center">
                    <Wallet size={32} className="mb-2 opacity-50" />
                    <p className="text-xs">No hay datos suficientes</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* ─── Tendencias por Categoría (Stacked) ─────────────── */}
          {months > 1 && (
            <motion.div variants={item} className="nexo-card p-5">
              <h3 className="text-sm font-semibold text-[var(--color-text)] mb-4 uppercase tracking-wider">
                Evolución de Gastos por Categoría
              </h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trends?.data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: "var(--color-text-muted)", fontSize: 12, fontWeight: 600 }}
                      dy={10}
                    />
                    <Tooltip 
                      cursor={{ fill: "var(--color-surface-2)" }}
                      contentStyle={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "16px" }}
                      formatter={(val: any) => formatCurrency(val, "COP")}
                    />
                    <Legend wrapperStyle={{ paddingTop: "20px", fontSize: "12px" }} />
                    {trends?.categories.map((catName, idx) => (
                      <Bar 
                        key={catName} 
                        dataKey={catName} 
                        stackId="a" 
                        fill={CATEGORY_COLORS[idx % CATEGORY_COLORS.length]} 
                        radius={
                          idx === trends.categories.length - 1 
                            ? [6, 6, 0, 0] 
                            : [0, 0, 0, 0]
                        }
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}

          {/* ─── Comparativa Mensual (Tabla) ────────────────────── */}
          {months > 1 && (
            <motion.div variants={item} className="nexo-card overflow-hidden">
              <div className="p-5 border-b border-[var(--color-border)]">
                <h3 className="text-sm font-semibold text-[var(--color-text)] uppercase tracking-wider">
                  Detalle Mensual
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-[10px] uppercase bg-[var(--color-surface-2)] text-[var(--color-text-muted)] font-bold tracking-wider">
                    <tr>
                      <th className="px-5 py-3 rounded-tl-xl">Mes</th>
                      <th className="px-5 py-3">Ingresos</th>
                      <th className="px-5 py-3">Gastos</th>
                      <th className="px-5 py-3">Ahorro</th>
                      <th className="px-5 py-3 text-right rounded-tr-xl">%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparison?.map((row, i) => (
                      <tr 
                        key={i} 
                        className={cn(
                          "border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-surface-2)]/50 transition-colors",
                          i % 2 === 0 ? "bg-[var(--color-bg)]" : "bg-transparent"
                        )}
                      >
                        <td className="px-5 py-3 font-semibold text-[var(--color-text)]">{row.month}</td>
                        <td className="px-5 py-3 text-[var(--color-green)] font-mono">{formatCurrency(row.income, "COP")}</td>
                        <td className="px-5 py-3 text-[var(--color-red)] font-mono">{formatCurrency(row.expenses, "COP")}</td>
                        <td className="px-5 py-3 text-[var(--color-text)] font-mono font-bold">{formatCurrency(row.savings, "COP")}</td>
                        <td className="px-5 py-3 text-right">
                          <span className={cn(
                            "px-2 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1",
                            row.savingsRate > 20 ? "bg-[var(--color-green-subtle)] text-[var(--color-green)]" :
                            row.savingsRate > 0 ? "bg-[var(--color-primary-subtle)] text-[var(--color-primary-light)]" :
                            "bg-[var(--color-red-subtle)] text-[var(--color-red)]"
                          )}>
                            {row.savingsRate > 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                            {row.savingsRate.toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
          
        </motion.div>
      )}
    </div>
  );
}
