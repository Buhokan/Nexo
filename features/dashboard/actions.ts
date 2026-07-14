"use server";

import prisma from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import {
  startOfMonth, endOfMonth, subMonths, startOfDay,
  subDays, format, eachDayOfInterval, eachMonthOfInterval,
} from "date-fns";
import { es } from "date-fns/locale";

// Helper para convertir Decimal de Prisma a number de forma segura
function toNumber(val: unknown): number {
  if (val === null || val === undefined) return 0;
  if (typeof val === "number") return val;
  if (typeof val === "object" && val !== null && "toNumber" in val) {
    return (val as { toNumber(): number }).toNumber();
  }
  return Number(val);
}

export async function getDashboardStats() {
  const userId = await getCurrentUserId();
  const now = new Date();
  const currentMonthStart = startOfMonth(now);
  const currentMonthEnd = endOfMonth(now);
  const previousMonthStart = startOfMonth(subMonths(now, 1));
  const previousMonthEnd = endOfMonth(subMonths(now, 1));

  const [currentStats, prevStats, allTimeStats] = await Promise.all([
    prisma.transaction.groupBy({
      by: ["type"],
      where: { userId, date: { gte: currentMonthStart, lte: currentMonthEnd } },
      _sum: { amount: true },
    }),
    prisma.transaction.groupBy({
      by: ["type"],
      where: { userId, date: { gte: previousMonthStart, lte: previousMonthEnd } },
      _sum: { amount: true },
    }),
    prisma.transaction.groupBy({
      by: ["type"],
      where: { userId },
      _sum: { amount: true },
    }),
  ]);

  const currentIncome = toNumber(currentStats.find((s) => s.type === "INCOME")?._sum.amount);
  const currentExpenses = toNumber(currentStats.find((s) => s.type === "EXPENSE")?._sum.amount);
  const prevIncome = toNumber(prevStats.find((s) => s.type === "INCOME")?._sum.amount);
  const prevExpenses = toNumber(prevStats.find((s) => s.type === "EXPENSE")?._sum.amount);
  const totalIncome = toNumber(allTimeStats.find((s) => s.type === "INCOME")?._sum.amount);
  const totalExpenses = toNumber(allTimeStats.find((s) => s.type === "EXPENSE")?._sum.amount);

  const savings = currentIncome - currentExpenses;
  const savingsRate = currentIncome > 0 ? savings / currentIncome : 0;
  const balance = totalIncome - totalExpenses;

  return {
    balance,
    totalIncome: currentIncome,
    totalExpenses: currentExpenses,
    savings,
    savingsRate,
    previousMonthIncome: prevIncome,
    previousMonthExpenses: prevExpenses,
  };
}

export async function getExpensesByCategory() {
  const userId = await getCurrentUserId();
  const currentMonthStart = startOfMonth(new Date());

  const expenses = await prisma.transaction.findMany({
    where: { userId, type: "EXPENSE", date: { gte: currentMonthStart } },
    include: { category: true },
  });

  const categoryMap = new Map<string, { amount: number; name: string; emoji: string; color: string }>();
  let total = 0;

  expenses.forEach((exp) => {
    const amount = toNumber(exp.amount);
    total += amount;
    const cat = exp.category;
    if (cat) {
      const existing = categoryMap.get(cat.id);
      if (existing) {
        existing.amount += amount;
      } else {
        categoryMap.set(cat.id, {
          amount,
          name: cat.name,
          emoji: cat.emoji ?? "🏷️",
          color: cat.color ?? "#8B8B9E",
        });
      }
    }
  });

  return Array.from(categoryMap.values())
    .map((cat) => ({
      ...cat,
      amount: cat.amount,
      percentage: total > 0 ? Number(((cat.amount / total) * 100).toFixed(1)) : 0,
    }))
    .sort((a, b) => b.amount - a.amount);
}

export async function getDailyExpenses() {
  const userId = await getCurrentUserId();
  const end = new Date();
  const start = startOfDay(subDays(end, 13));

  const expenses = await prisma.transaction.groupBy({
    by: ["date"],
    where: { userId, type: "EXPENSE", date: { gte: start, lte: end } },
    _sum: { amount: true },
  });

  const expensesMap = new Map<string, number>();
  expenses.forEach((e) => {
    const dayStr = format(e.date, "yyyy-MM-dd");
    expensesMap.set(dayStr, (expensesMap.get(dayStr) ?? 0) + toNumber(e._sum.amount));
  });

  const days = eachDayOfInterval({ start, end });
  return days.map((day) => ({
    date: format(day, "dd MMM", { locale: es }),
    amount: expensesMap.get(format(day, "yyyy-MM-dd")) ?? 0,
  }));
}

export async function getMonthlyEvolution() {
  const userId = await getCurrentUserId();
  const end = new Date();
  const start = startOfMonth(subMonths(end, 5));

  const transactions = await prisma.transaction.findMany({
    where: { userId, date: { gte: start, lte: end } },
    select: { date: true, type: true, amount: true },
  });

  const monthsMap = new Map<string, { income: number; expenses: number }>();
  transactions.forEach((t) => {
    const monthKey = format(t.date, "yyyy-MM");
    const current = monthsMap.get(monthKey) ?? { income: 0, expenses: 0 };
    const amount = toNumber(t.amount);
    if (t.type === "INCOME") current.income += amount;
    if (t.type === "EXPENSE") current.expenses += amount;
    monthsMap.set(monthKey, current);
  });

  return eachMonthOfInterval({ start, end }).map((month) => {
    const data = monthsMap.get(format(month, "yyyy-MM")) ?? { income: 0, expenses: 0 };
    const raw = format(month, "MMM", { locale: es });
    return {
      month: raw.charAt(0).toUpperCase() + raw.slice(1),
      income: data.income,
      expenses: data.expenses,
    };
  });
}

export async function getRecentTransactions() {
  const userId = await getCurrentUserId();
  const txs = await prisma.transaction.findMany({
    where: { userId },
    orderBy: { date: "desc" },
    take: 5,
    include: { category: true },
  });

  return txs.map((tx) => ({
    id: tx.id,
    description: tx.description,
    category: tx.category?.emoji ?? "💰",
    amount: tx.type === "EXPENSE" ? -toNumber(tx.amount) : toNumber(tx.amount),
    date: format(tx.date, "dd MMM", { locale: es }),
    type: tx.type as string,
  }));
}

export async function getActiveGoals() {
  const userId = await getCurrentUserId();
  const goals = await prisma.goal.findMany({
    where: { userId, status: "ACTIVE" },
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  return goals.map((g) => ({
    id: g.id,
    name: g.name,
    emoji: g.emoji ?? "🎯",
    current: toNumber(g.currentAmount),
    target: toNumber(g.targetAmount),
    color: g.color ?? "#7C5CFF",
  }));
}

export async function getGamificationQuickStats() {
  const userId = await getCurrentUserId();
  const profile = await prisma.gamificationProfile.findUnique({
    where: { userId },
  });

  if (!profile) return null;

  return {
    level: profile.level,
    xp: profile.xp,
    streak: profile.streak,
  };
}
