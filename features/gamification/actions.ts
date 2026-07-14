"use server";

import prisma from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";

export async function getProfile() {
  const userId = await getCurrentUserId();

  const profile = await prisma.gamificationProfile.findUnique({
    where: { userId },
    include: {
      achievements: {
        include: { achievement: true },
        orderBy: { unlockedAt: "desc" },
      },
    },
  });

  if (!profile) return null;

  const totalTransactions = await prisma.transaction.count({
    where: { userId },
  });

  const firstTx = await prisma.transaction.findFirst({
    where: { userId },
    orderBy: { date: "asc" },
  });

  let daysActive = 1;
  if (firstTx) {
    const diffTime = Math.abs(new Date().getTime() - firstTx.date.getTime());
    daysActive = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  }

  return {
    ...profile,
    totalTransactions,
    daysActive,
  };
}

export async function getAllAchievements() {
  const userId = await getCurrentUserId();
  const all = await prisma.achievement.findMany();

  const userUnlocked = await prisma.userAchievement.findMany({
    where: { profile: { userId } },
  });

  const unlockedIds = new Set(userUnlocked.map((u) => u.achievementId));
  const unlockedMap = new Map(userUnlocked.map((u) => [u.achievementId, u.unlockedAt]));

  return all.map((a) => ({
    id: a.id,
    key: a.key,
    name: a.name,
    description: a.description,
    emoji: a.emoji,
    xpReward: a.xpReward,
    isUnlocked: unlockedIds.has(a.id),
    unlockedAt: unlockedMap.get(a.id) ?? null,
  }));
}
