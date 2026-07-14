"use server";

import prisma from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { startOfMonth } from "date-fns";

function toNumber(val: unknown): number {
  if (val === null || val === undefined) return 0;
  if (typeof val === "number") return val;
  if (typeof val === "object" && val !== null && "toNumber" in val) {
    return (val as { toNumber(): number }).toNumber();
  }
  return Number(val);
}

export interface CategoryInput {
  name: string;
  emoji: string;
  color: string;
}

export async function getAllCategoriesAdmin() {
  const userId = await getCurrentUserId();
  const currentMonthStart = startOfMonth(new Date());

  const categories = await prisma.category.findMany({
    where: {
      OR: [
        { userId: null },   // Categorías del sistema
        { userId },         // Categorías personales
      ],
    },
    orderBy: { sortOrder: "asc" },
    include: {
      transactions: {
        where: { userId, date: { gte: currentMonthStart } },
      },
    },
  });

  let totalExpenses = 0;

  const serialized = categories.map((cat) => {
    let spentThisMonth = 0;
    cat.transactions.forEach((tx) => {
      const amount = toNumber(tx.amount);
      if (tx.type === "EXPENSE") spentThisMonth += amount;
    });
    totalExpenses += spentThisMonth;

    return {
      id: cat.id,
      name: cat.name,
      emoji: cat.emoji ?? "🏷️",
      color: cat.color ?? "#8B8B9E",
      isSystem: cat.isSystem,
      sortOrder: cat.sortOrder,
      spentThisMonth,
    };
  });

  return serialized.map((cat) => ({
    ...cat,
    percentage: totalExpenses > 0 ? (cat.spentThisMonth / totalExpenses) * 100 : 0,
  }));
}

export async function createCategory(data: CategoryInput) {
  const userId = await getCurrentUserId();

  const highestSort = await prisma.category.findFirst({
    orderBy: { sortOrder: "desc" },
  });

  const nextSort = (highestSort?.sortOrder ?? 0) + 1;

  const cat = await prisma.category.create({
    data: {
      ...data,
      userId,
      isSystem: false,
      sortOrder: nextSort,
      icon: data.emoji, // icon es requerido por el schema
    },
  });
  return { success: true, id: cat.id };
}

export async function deleteCategory(id: string) {
  const userId = await getCurrentUserId();

  const cat = await prisma.category.findUnique({
    where: { id },
    include: { _count: { select: { transactions: true } } },
  });

  if (!cat) throw new Error("Categoría no encontrada");
  if (cat.isSystem) throw new Error("No puedes borrar una categoría del sistema");
  if (cat.userId !== userId) throw new Error("No autorizado");
  if (cat._count.transactions > 0) {
    throw new Error("No puedes borrar una categoría que ya tiene transacciones.");
  }

  await prisma.category.delete({ where: { id } });
  return { success: true };
}
