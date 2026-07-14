"use server";

import prisma from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { startOfMonth, endOfMonth, format } from "date-fns";
import { es } from "date-fns/locale";
import { TransactionType } from "@prisma/client";

function toNumber(val: unknown): number {
  if (val === null || val === undefined) return 0;
  if (typeof val === "number") return val;
  if (typeof val === "object" && val !== null && "toNumber" in val) {
    return (val as { toNumber(): number }).toNumber();
  }
  return Number(val);
}

export interface GetTransactionsParams {
  search?: string;
  type?: string;
  categoryId?: string;
}

export async function getTransactions(params: GetTransactionsParams) {
  const userId = await getCurrentUserId();
  const { search, type, categoryId } = params;

  const where: any = { userId };

  if (search) {
    where.description = { contains: search, mode: "insensitive" };
  }
  if (type && type !== "ALL") {
    where.type = type as TransactionType;
  }
  if (categoryId && categoryId !== "ALL") {
    where.categoryId = categoryId;
  }

  const txs = await prisma.transaction.findMany({
    where,
    orderBy: { date: "desc" },
    include: { category: true },
    take: 100,
  });

  const grouped = new Map<string, any[]>();

  txs.forEach((tx) => {
    const dateKey = format(tx.date, "yyyy-MM-dd");
    let displayDate = format(tx.date, "dd MMM", { locale: es });
    const today = format(new Date(), "yyyy-MM-dd");
    const yesterday = format(new Date(Date.now() - 86400000), "yyyy-MM-dd");

    if (dateKey === today) displayDate = "Hoy";
    else if (dateKey === yesterday) displayDate = "Ayer";

    const item = {
      id: tx.id,
      description: tx.description,
      amount: toNumber(tx.amount),
      type: tx.type,
      categoryName: tx.category?.name ?? "Sin categoría",
      categoryEmoji: tx.category?.emoji ?? "💰",
      categoryColor: tx.category?.color ?? "#8B8B9E",
    };

    if (grouped.has(displayDate)) {
      grouped.get(displayDate)!.push(item);
    } else {
      grouped.set(displayDate, [item]);
    }
  });

  return Array.from(grouped.entries()).map(([date, items]) => ({ date, items }));
}

export async function getTransactionStats() {
  const userId = await getCurrentUserId();
  const currentMonthStart = startOfMonth(new Date());
  const currentMonthEnd = endOfMonth(new Date());

  const stats = await prisma.transaction.groupBy({
    by: ["type"],
    where: { userId, date: { gte: currentMonthStart, lte: currentMonthEnd } },
    _sum: { amount: true },
  });

  const income = toNumber(stats.find((s) => s.type === "INCOME")?._sum.amount);
  const expenses = toNumber(stats.find((s) => s.type === "EXPENSE")?._sum.amount);

  return { income, expenses, balance: income - expenses };
}

export async function deleteTransaction(id: string) {
  const userId = await getCurrentUserId();
  await prisma.transaction.delete({ where: { id, userId } });
  return { success: true };
}
