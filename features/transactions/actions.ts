"use server";

import prisma from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { transactionSchema, type TransactionInput } from "./schema";

const XP_PER_TRANSACTION = 10;

export async function createTransaction(data: TransactionInput) {
  const userId = await getCurrentUserId();

  // 1. Validar datos
  const parsed = transactionSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error("Datos inválidos: " + parsed.error.message);
  }

  const txData = parsed.data;

  // 2. Crear transacción
  const transaction = await prisma.transaction.create({
    data: {
      ...txData,
      userId,
    },
  });

  // 3. Sistema de Gamificación (XP y Rachas)
  try {
    await updateGamification(userId);
  } catch (error) {
    console.error("Error actualizando gamificación:", error);
  }

  // Return plain serializable object (Prisma Decimal -> number)
  return {
    id: transaction.id,
    amount: Number(transaction.amount),
    type: transaction.type,
    description: transaction.description,
    date: transaction.date.toISOString(),
  };
}

/**
 * Actualiza la experiencia y rachas del usuario.
 */
async function updateGamification(userId: string) {
  const profile = await prisma.gamificationProfile.findUnique({
    where: { userId },
  });

  if (!profile) return;

  const now = new Date();
  const lastActive = profile.lastActiveAt;

  let newStreak = profile.streak;

  if (lastActive) {
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const lastDay = new Date(lastActive.getFullYear(), lastActive.getMonth(), lastActive.getDate());

    const diffTime = Math.abs(today.getTime() - lastDay.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      newStreak += 1;
    } else if (diffDays > 1) {
      newStreak = 1;
    }
  } else {
    newStreak = 1;
  }

  const longestStreak = Math.max(profile.longestStreak, newStreak);
  const totalXp = profile.totalXp + XP_PER_TRANSACTION;
  const currentXp = profile.xp + XP_PER_TRANSACTION;
  const newLevel = Math.floor(totalXp / 100) + 1;

  await prisma.gamificationProfile.update({
    where: { id: profile.id },
    data: {
      xp: currentXp,
      totalXp,
      level: newLevel,
      streak: newStreak,
      longestStreak,
      lastActiveAt: now,
    },
  });
}

/**
 * Obtener categorías del sistema + del usuario para el selector.
 */
export async function getCategories() {
  const userId = await getCurrentUserId();

  const cats = await prisma.category.findMany({
    where: {
      OR: [
        { userId: null },       // Categorías del sistema
        { userId },             // Categorías personales del usuario
      ],
    },
    orderBy: { sortOrder: "asc" },
  });

  return cats.map((c) => ({
    id: c.id,
    name: c.name,
    emoji: c.emoji ?? "",
    color: c.color ?? "#8B8B9E",
    isSystem: c.isSystem,
    sortOrder: c.sortOrder,
  }));
}
