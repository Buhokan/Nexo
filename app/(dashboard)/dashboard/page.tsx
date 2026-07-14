"use client";

import { motion, Variants } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  PiggyBank,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Flame,
  Zap,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import { formatCurrency, formatCurrencyCompact, calculatePercentageChange } from "@/utils/currency";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/utils/cn";
import {
  useDashboardStats,
  useExpensesByCategory,
  useDailyExpenses,
  useMonthlyEvolution,
  useRecentTransactions,
  useActiveGoals,
  useGamificationQuickStats,
} from "@/features/dashboard/hooks";

// ─── Animación de entrada ────────────────────────────────────────

const container: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

// ─── Tooltip personalizado para gráficas ─────────────────────────

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="px-3 py-2 rounded-xl text-sm font-medium"
      style={{
        background: "var(--color-surface-2)",
        border: "1px solid var(--color-border)",
        boxShadow: "var(--shadow-md)",
      }}
    >
      <p style={{ color: "var(--color-text-muted)" }} className="text-xs mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color ?? "var(--color-text)" }}>
          {formatCurrency(p.value, "COP")}
        </p>
      ))}
    </div>
  );
}

// ─── Skeletons ──────────────────────────────────────────────────

function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-10 w-48 bg-[var(--color-surface-2)] rounded-xl" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="nexo-card p-4 md:p-5 h-32 bg-[var(--color-surface-2)]" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="nexo-card lg:col-span-2 h-72 bg-[var(--color-surface-2)]" />
        <div className="nexo-card lg:col-span-3 h-72 bg-[var(--color-surface-2)]" />
      </div>
      <div className="nexo-card h-64 bg-[var(--color-surface-2)]" />
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────

export default function DashboardPage() {
  const { data: stats, isPending: statsLoading } = useDashboardStats();
  const { data: categories, isPending: catLoading } = useExpensesByCategory();
  const { data: daily, isPending: dailyLoading } = useDailyExpenses();
  const { data: monthly, isPending: monthlyLoading } = useMonthlyEvolution();
  const { data: transactions, isPending: txLoading } = useRecentTransactions();
  const { data: goals, isPending: goalsLoading } = useActiveGoals();
  const { data: gamification, isPending: gamiLoading } = useGamificationQuickStats();

  const isPending = statsLoading || catLoading || dailyLoading || monthlyLoading || txLoading || goalsLoading || gamiLoading;

  if (isPending) {
    return <DashboardSkeleton />;
  }

  if (!stats) return null;

  const expenseChange = calculatePercentageChange(
    stats.totalExpenses,
    stats.previousMonthExpenses
  );
  const incomeChange = calculatePercentageChange(
    stats.totalIncome,
    stats.previousMonthIncome
  );

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* ─── Saludo ──────────────────────────────────────────── */}
      <motion.div variants={item}>
        <p className="text-sm mb-1" style={{ color: "var(--color-text-muted)" }}>
          Bienvenido de vuelta 👋
        </p>
        <h2 className="text-heading-1" style={{ color: "var(--color-text)" }}>
          Tu resumen del mes
        </h2>
      </motion.div>

      {/* ─── Tarjetas de estadísticas ─────────────────────────── */}
      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {/* Balance */}
        <StatsCard
          title="Saldo disponible"
          value={formatCurrency(stats.balance, "COP")}
          icon={<Wallet size={18} />}
          iconColor="var(--color-primary)"
          iconBg="var(--color-primary-subtle)"
          hero
        />
        {/* Ingresos */}
        <StatsCard
          title="Ingresos"
          value={formatCurrencyCompact(stats.totalIncome, "COP")}
          change={incomeChange}
          icon={<TrendingUp size={18} />}
          iconColor="var(--color-green)"
          iconBg="var(--color-green-subtle)"
          positive
        />
        {/* Gastos */}
        <StatsCard
          title="Gastos"
          value={formatCurrencyCompact(stats.totalExpenses, "COP")}
          change={expenseChange}
          icon={<TrendingDown size={18} />}
          iconColor="var(--color-red)"
          iconBg="var(--color-red-subtle)"
          positive={expenseChange < 0}
          invertChange
        />
        {/* Ahorro */}
        <StatsCard
          title="Ahorro"
          value={`${(stats.savingsRate * 100).toFixed(0)}%`}
          subtitle="del ingreso"
          icon={<PiggyBank size={18} />}
          iconColor="var(--color-secondary)"
          iconBg="var(--color-secondary-subtle)"
        />
      </motion.div>

      {/* ─── Gráficas principales ─────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Gráfica donut de categorías */}
        <motion.div
          variants={item}
          className="nexo-card lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-heading-3" style={{ color: "var(--color-text)" }}>
              Por categoría
            </h3>
            <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
              Este mes
            </span>
          </div>

          <div className="flex flex-col items-center">
            {categories && categories.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie
                      data={categories}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="amount"
                      stroke="none"
                    >
                      {categories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (!active || !payload?.length) return null;
                        const d = payload[0]?.payload as typeof categories[0];
                        return (
                          <div
                            className="px-3 py-2 rounded-xl text-sm"
                            style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}
                          >
                            <p className="font-medium" style={{ color: "var(--color-text)" }}>
                              {d.emoji} {d.name}
                            </p>
                            <p style={{ color: "var(--color-text-muted)" }} className="text-xs">
                              {formatCurrency(d.amount, "COP")} · {d.percentage}%
                            </p>
                          </div>
                        );
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>

                <div className="w-full space-y-2 mt-2">
                  {categories.slice(0, 5).map((cat) => (
                    <div key={cat.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ background: cat.color }} />
                        <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                          {cat.emoji} {cat.name}
                        </span>
                      </div>
                      <span className="text-xs font-medium" style={{ color: "var(--color-text)" }}>
                        {cat.percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-[180px] flex items-center justify-center text-sm text-[var(--color-text-muted)]">
                No hay gastos este mes
              </div>
            )}
          </div>
        </motion.div>

        {/* Gráfica de barras por día */}
        <motion.div
          variants={item}
          className="nexo-card lg:col-span-3"
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-heading-3" style={{ color: "var(--color-text)" }}>
              Gastos diarios
            </h3>
            <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
              Últimos 14 días
            </span>
          </div>

          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={daily} barSize={12} barCategoryGap="30%">
              <CartesianGrid
                vertical={false}
                stroke="var(--color-border)"
                strokeDasharray="4"
              />
              <XAxis
                dataKey="date"
                tick={{ fill: "var(--color-text-subtle)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                interval={1}
              />
              <YAxis
                tick={{ fill: "var(--color-text-subtle)", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
                width={40}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(124,92,255,0.05)" }} />
              <Bar dataKey="amount" fill="url(#barGradient)" radius={[4, 4, 0, 0]} />
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7C5CFF" />
                  <stop offset="100%" stopColor="#4DA3FF" stopOpacity={0.6} />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* ─── Evolución mensual ────────────────────────────────── */}
      <motion.div variants={item} className="nexo-card">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-heading-3" style={{ color: "var(--color-text)" }}>
            Evolución mensual
          </h3>
          <div className="flex items-center gap-4 text-xs" style={{ color: "var(--color-text-muted)" }}>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ background: "#22C55E" }} />
              Ingresos
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ background: "#EF4444" }} />
              Gastos
            </span>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={monthly}>
            <CartesianGrid vertical={false} stroke="var(--color-border)" strokeDasharray="4" />
            <XAxis
              dataKey="month"
              tick={{ fill: "var(--color-text-subtle)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "var(--color-text-subtle)", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `$${(v / 1_000_000).toFixed(1)}M`}
              width={44}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="income"
              stroke="#22C55E"
              strokeWidth={2.5}
              dot={{ r: 4, fill: "#22C55E", strokeWidth: 0 }}
              activeDot={{ r: 6, fill: "#22C55E" }}
            />
            <Line
              type="monotone"
              dataKey="expenses"
              stroke="#EF4444"
              strokeWidth={2.5}
              dot={{ r: 4, fill: "#EF4444", strokeWidth: 0 }}
              activeDot={{ r: 6, fill: "#EF4444" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* ─── Últimas transacciones + Objetivos ───────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Últimas transacciones */}
        <motion.div variants={item} className="nexo-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-heading-3" style={{ color: "var(--color-text)" }}>
              Últimos movimientos
            </h3>
            <Link
              href={ROUTES.TRANSACTIONS}
              className="flex items-center gap-1 text-xs font-medium transition-colors hover:text-[var(--color-primary-light)]"
              style={{ color: "var(--color-primary)" }}
            >
              Ver todos
              <ChevronRight size={14} />
            </Link>
          </div>

          <div className="space-y-1">
            {transactions?.length ? (
              transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors"
                  style={{ cursor: "default" }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl leading-none">{tx.category}</span>
                    <div>
                      <p className="text-sm font-medium" style={{ color: "var(--color-text)" }}>
                        {tx.description}
                      </p>
                      <p className="text-xs" style={{ color: "var(--color-text-subtle)" }}>
                        {tx.date}
                      </p>
                    </div>
                  </div>
                  <span
                    className="text-sm font-semibold text-number"
                    style={{
                      color: tx.amount > 0
                        ? "var(--color-green)"
                        : "var(--color-text)",
                    }}
                  >
                    {tx.amount > 0 ? "+" : ""}
                    {formatCurrency(Math.abs(tx.amount), "COP")}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-[var(--color-text-muted)] p-2">
                No hay transacciones recientes
              </p>
            )}
          </div>
        </motion.div>

        {/* Objetivos activos */}
        <motion.div variants={item} className="nexo-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-heading-3" style={{ color: "var(--color-text)" }}>
              Objetivos activos
            </h3>
            <Link
              href={ROUTES.GOALS}
              className="flex items-center gap-1 text-xs font-medium"
              style={{ color: "var(--color-primary)" }}
            >
              Ver todos
              <ChevronRight size={14} />
            </Link>
          </div>

          <div className="space-y-4">
            {goals?.length ? (
              goals.map((goal) => {
                const progress = Math.min((goal.current / goal.target) * 100, 100);
                return (
                  <div key={goal.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg leading-none">{goal.emoji}</span>
                        <span className="text-sm font-medium" style={{ color: "var(--color-text)" }}>
                          {goal.name}
                        </span>
                      </div>
                      <span className="text-xs font-semibold" style={{ color: goal.color }}>
                        {progress.toFixed(0)}%
                      </span>
                    </div>
                    <div className="nexo-progress">
                      <div
                        className="nexo-progress-bar transition-all duration-700"
                        style={{
                          width: `${progress}%`,
                          background: `linear-gradient(90deg, ${goal.color}, ${goal.color}99)`,
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-xs" style={{ color: "var(--color-text-muted)" }}>
                      <span>{formatCurrency(goal.current, "COP")}</span>
                      <span>{formatCurrency(goal.target, "COP")}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-[var(--color-text-muted)] p-2">
                No hay objetivos activos
              </p>
            )}
          </div>

          {/* Gamificación rápida */}
          {gamification && (
            <div
              className="mt-4 p-3 rounded-xl flex items-center gap-3"
              style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}
            >
              <div className="flex items-center gap-2">
                <Flame size={16} style={{ color: "#F59E0B" }} />
                <span className="text-sm font-semibold" style={{ color: "#F59E0B" }}>
                  {gamification.streak} días de racha
                </span>
              </div>
              <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>·</span>
              <div className="flex items-center gap-1.5">
                <Zap size={14} style={{ color: "var(--color-primary)" }} />
                <span className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>
                  {gamification.xp} XP · Nivel {gamification.level}
                </span>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── Componente StatsCard ─────────────────────────────────────────

interface StatsCardProps {
  title: string;
  value: string;
  subtitle?: string;
  change?: number;
  icon: React.ReactNode;
  iconColor: string;
  iconBg: string;
  hero?: boolean;
  positive?: boolean;
  invertChange?: boolean;
}

function StatsCard({
  title,
  value,
  subtitle,
  change,
  icon,
  iconColor,
  iconBg,
  hero,
  positive,
  invertChange,
}: StatsCardProps) {
  const isPositive = invertChange ? (change ?? 0) <= 0 : (change ?? 0) >= 0;

  return (
    <div
      className={cn(
        "nexo-card p-4 md:p-5",
        hero && "nexo-gradient-card col-span-2 lg:col-span-1"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: iconBg, color: iconColor }}
        >
          {icon}
        </div>

        {change !== undefined && (
          <div
            className="flex items-center gap-0.5 text-xs font-semibold"
            style={{ color: isPositive ? "var(--color-green)" : "var(--color-red)" }}
          >
            {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {Math.abs(change)}%
          </div>
        )}
      </div>

      <div className="mt-3">
        <p className="text-xs font-medium mb-1" style={{ color: "var(--color-text-muted)" }}>
          {title}
        </p>
        <p
          className={cn("font-bold text-number", hero ? "text-2xl" : "text-xl")}
          style={{ color: "var(--color-text)", letterSpacing: "-0.03em" }}
        >
          {value}
        </p>
        {subtitle && (
          <p className="text-xs mt-0.5" style={{ color: "var(--color-text-subtle)" }}>
            {subtitle}
          </p>
        )}
        {change !== undefined && (
          <p className="text-xs mt-1" style={{ color: "var(--color-text-subtle)" }}>
            vs. mes anterior
          </p>
        )}
      </div>
    </div>
  );
}
