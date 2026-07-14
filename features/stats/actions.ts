"use server";

import prisma from "@/lib/prisma";
import { subMonths, startOfMonth, endOfMonth, format, eachMonthOfInterval } from "date-fns";
import { es } from "date-fns/locale";

import { getCurrentUserId } from "@/lib/auth";

function toNumber(val: unknown): number {
  if (val === null || val === undefined) return 0;
  if (typeof val === "number") return val;
  if (typeof val === "object" && val !== null && "toNumber" in val) {
    return (val as { toNumber(): number }).toNumber();
  }
  return Number(val);
}

export async function getStatsOverview(months: number = 3) {
  const userId = await getCurrentUserId();
  const end = new Date();
  const start = startOfMonth(subMonths(end, months - 1));

  const transactions = await prisma.transaction.findMany({
    where: { userId, date: { gte: start, lte: end } },
    include: { category: true },
  });

  let totalExpenses = 0;
  let totalIncome = 0;
  const expensesByMonth = new Map<string, number>();
  const expensesByCategory = new Map<string, { amount: number; name: string }>();

  transactions.forEach((tx) => {
    const amount = toNumber(tx.amount);
    const monthKey = format(tx.date, "yyyy-MM");

    if (tx.type === "EXPENSE") {
      totalExpenses += amount;
      expensesByMonth.set(monthKey, (expensesByMonth.get(monthKey) ?? 0) + amount);

      if (tx.category) {
        const cat = expensesByCategory.get(tx.category.id) ?? { amount: 0, name: tx.category.name };
        cat.amount += amount;
        expensesByCategory.set(tx.category.id, cat);
      }
    } else {
      totalIncome += amount;
    }
  });

  const avgMonthlyExpense = totalExpenses / months;
  
  let maxMonthAmount = 0;
  let maxMonthName = "";
  expensesByMonth.forEach((amount, month) => {
    if (amount > maxMonthAmount) {
      maxMonthAmount = amount;
      maxMonthName = format(new Date(month + "-01"), "MMMM", { locale: es });
    }
  });

  let maxCatAmount = 0;
  let maxCatName = "";
  expensesByCategory.forEach((cat) => {
    if (cat.amount > maxCatAmount) {
      maxCatAmount = cat.amount;
      maxCatName = cat.name;
    }
  });

  const avgSavingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

  return {
    avgMonthlyExpense,
    maxMonth: { name: maxMonthName, amount: maxMonthAmount },
    maxCategory: { name: maxCatName, amount: maxCatAmount },
    avgSavingsRate,
  };
}

export async function getCategoryTrends(months: number = 6) {
  const userId = await getCurrentUserId();
  const end = new Date();
  const start = startOfMonth(subMonths(end, months - 1));

  const transactions = await prisma.transaction.findMany({
    where: { userId, type: "EXPENSE", date: { gte: start, lte: end } },
    include: { category: true },
  });

  const interval = eachMonthOfInterval({ start, end });
  const data = interval.map(date => {
    const monthKey = format(date, "yyyy-MM");
    const monthName = format(date, "MMM", { locale: es });
    return { name: monthName.charAt(0).toUpperCase() + monthName.slice(1), monthKey };
  });

  const result: any[] = [];
  const categories = new Set<string>();

  data.forEach((month) => {
    const item: any = { name: month.name };
    const monthTxs = transactions.filter(t => format(t.date, "yyyy-MM") === month.monthKey);
    
    monthTxs.forEach(tx => {
      if (tx.category) {
        const catName = tx.category.name;
        categories.add(catName);
        item[catName] = (item[catName] ?? 0) + toNumber(tx.amount);
      }
    });
    result.push(item);
  });

  return {
    data: result,
    categories: Array.from(categories),
  };
}

export async function getSpendingByPaymentMethod(months: number = 1) {
  const userId = await getCurrentUserId();
  const end = new Date();
  const start = startOfMonth(subMonths(end, months - 1));

  const stats = await prisma.transaction.groupBy({
    by: ["paymentMethod"],
    where: { userId, type: "EXPENSE", date: { gte: start, lte: end } },
    _sum: { amount: true },
  });

  const colorMap: Record<string, string> = {
    CASH: "#22C55E",
    DEBIT_CARD: "#4DA3FF",
    CREDIT_CARD: "#7C5CFF",
    TRANSFER: "#F59E0B",
  };

  return stats.map(s => ({
    name: s.paymentMethod,
    value: toNumber(s._sum.amount),
    fill: colorMap[s.paymentMethod] ?? "#8B8B9E",
  })).sort((a, b) => b.value - a.value);
}

export async function getDailyAverages(months: number = 3) {
  const userId = await getCurrentUserId();
  const end = new Date();
  const start = startOfMonth(subMonths(end, months - 1));

  const transactions = await prisma.transaction.findMany({
    where: { userId, type: "EXPENSE", date: { gte: start, lte: end } },
    select: { date: true, amount: true },
  });

  const daysData = Array.from({ length: 7 }, () => ({ total: 0, count: 0 }));
  
  transactions.forEach((tx) => {
    // getDay: 0 = Sun, 1 = Mon ... 6 = Sat
    // Queremos Lunes = 0, Domingo = 6
    const jsDay = tx.date.getDay();
    const index = jsDay === 0 ? 6 : jsDay - 1;
    
    daysData[index].total += toNumber(tx.amount);
    daysData[index].count++;
  });

  const dayNames = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

  return daysData.map((d, i) => ({
    name: dayNames[i],
    avg: d.count > 0 ? d.total / d.count : 0,
  }));
}

export async function getMonthComparison(months: number = 6) {
  const userId = await getCurrentUserId();
  const end = new Date();
  const start = startOfMonth(subMonths(end, months - 1));

  const transactions = await prisma.transaction.findMany({
    where: { userId, date: { gte: start, lte: end } },
    select: { date: true, amount: true, type: true },
  });

  const interval = eachMonthOfInterval({ start, end });
  
  return interval.map((date) => {
    const monthKey = format(date, "yyyy-MM");
    const monthTxs = transactions.filter(t => format(t.date, "yyyy-MM") === monthKey);
    
    let income = 0;
    let expenses = 0;
    
    monthTxs.forEach((tx) => {
      const amount = toNumber(tx.amount);
      if (tx.type === "INCOME") income += amount;
      if (tx.type === "EXPENSE") expenses += amount;
    });

    const savings = income - expenses;
    const savingsRate = income > 0 ? (savings / income) * 100 : 0;
    const monthName = format(date, "MMM yyyy", { locale: es });

    return {
      month: monthName.charAt(0).toUpperCase() + monthName.slice(1),
      income,
      expenses,
      savings,
      savingsRate,
    };
  }).reverse(); // Más reciente primero
}
