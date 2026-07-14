"use server";

import prisma from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";

function toNumber(val: unknown): number {
  if (val === null || val === undefined) return 0;
  if (typeof val === "number") return val;
  if (typeof val === "object" && val !== null && "toNumber" in val) {
    return (val as { toNumber(): number }).toNumber();
  }
  return Number(val);
}

export interface GoalInput {
  name: string;
  emoji: string;
  targetAmount: number;
  color: string;
  deadline?: Date | null;
  description?: string;
}

export async function getGoals() {
  const userId = await getCurrentUserId();

  const goals = await prisma.goal.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return goals.map((g) => ({
    id: g.id,
    name: g.name,
    description: g.description,
    targetAmount: toNumber(g.targetAmount),
    currentAmount: toNumber(g.currentAmount),
    emoji: g.emoji ?? "🎯",
    color: g.color ?? "#7C5CFF",
    deadline: g.deadline ? g.deadline.toISOString() : null,
    status: g.status,
  }));
}

export async function createGoal(data: GoalInput) {
  const userId = await getCurrentUserId();

  const goal = await prisma.goal.create({
    data: { ...data, userId },
  });
  return { success: true, id: goal.id };
}

export async function contributeToGoal(goalId: string, amount: number) {
  const userId = await getCurrentUserId();

  if (amount <= 0) throw new Error("El monto debe ser mayor a 0");

  const goal = await prisma.goal.findUnique({ where: { id: goalId } });
  if (!goal) throw new Error("Objetivo no encontrado");
  if (goal.userId !== userId) throw new Error("No autorizado");

  const newAmount = toNumber(goal.currentAmount) + amount;
  const target = toNumber(goal.targetAmount);

  let newStatus = goal.status;
  let justCompleted = false;

  if (newAmount >= target && goal.status !== "COMPLETED") {
    newStatus = "COMPLETED";
    justCompleted = true;
  }

  await prisma.goal.update({
    where: { id: goalId },
    data: { currentAmount: newAmount, status: newStatus },
  });

  return { success: true, justCompleted };
}

export async function deleteGoal(id: string) {
  const userId = await getCurrentUserId();
  await prisma.goal.delete({ where: { id, userId } });
  return { success: true };
}
