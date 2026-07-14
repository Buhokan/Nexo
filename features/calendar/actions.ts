"use server";

import prisma from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { format, startOfMonth, endOfMonth, isValid, parseISO } from "date-fns";

function toNumber(val: unknown): number {
  if (val === null || val === undefined) return 0;
  if (typeof val === "number") return val;
  if (typeof val === "object" && val !== null && "toNumber" in val) {
    return (val as { toNumber(): number }).toNumber();
  }
  return Number(val);
}

export async function getMonthTransactions(year: number, month: number) {
  const userId = await getCurrentUserId();
  // month is 0-indexed in JS dates (0 = Jan, 11 = Dec)
  const start = startOfMonth(new Date(year, month));
  const end = endOfMonth(new Date(year, month));

  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      date: { gte: start, lte: end },
    },
    select: { date: true, amount: true, type: true },
  });

  const days: Record<string, { total: number; income: number; expenses: number; count: number }> = {};
  let totalExpenses = 0;
  let totalIncome = 0;
  let maxDayAmount = 0;

  transactions.forEach((tx) => {
    const dayStr = format(tx.date, "yyyy-MM-dd");
    if (!days[dayStr]) {
      days[dayStr] = { total: 0, income: 0, expenses: 0, count: 0 };
    }

    const amount = toNumber(tx.amount);
    
    if (tx.type === "EXPENSE") {
      days[dayStr].expenses += amount;
      totalExpenses += amount;
    } else {
      days[dayStr].income += amount;
      totalIncome += amount;
    }
    
    days[dayStr].total += amount;
    days[dayStr].count += 1;

    if (days[dayStr].expenses > maxDayAmount) {
      maxDayAmount = days[dayStr].expenses;
    }
  });

  return {
    days,
    totalExpenses,
    totalIncome,
    maxDayAmount,
  };
}

export async function getDayTransactions(dateStr: string) {
  const userId = await getCurrentUserId();
  const date = parseISO(dateStr);
  if (!isValid(date)) return [];

  // Get transactions for that specific day (start of day to end of day)
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const end = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);

  const txs = await prisma.transaction.findMany({
    where: {
      userId,
      date: { gte: start, lte: end },
    },
    include: { category: true },
    orderBy: { date: "desc" },
  });

  return txs.map((tx) => ({
    id: tx.id,
    description: tx.description,
    amount: toNumber(tx.amount),
    type: tx.type,
    categoryName: tx.category?.name ?? "Sin categoría",
    categoryEmoji: tx.category?.emoji ?? "💰",
  }));
}
