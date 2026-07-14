import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getGoals, createGoal, contributeToGoal, deleteGoal } from "./actions";
import { DASHBOARD_KEYS } from "@/features/dashboard/hooks";
import { toast } from "sonner";
import confetti from "canvas-confetti";

export const GOALS_KEYS = {
  all: ["goals"] as const,
};

export function useGoals() {
  return useQuery({
    queryKey: GOALS_KEYS.all,
    queryFn: () => getGoals(),
  });
}

export function useCreateGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GOALS_KEYS.all });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_KEYS.all });
      toast.success("Objetivo creado", { icon: "🎯" });
    },
    onError: (error) => {
      toast.error("Error al crear", {
        description: error instanceof Error ? error.message : "Intenta nuevamente.",
      });
    },
  });
}

export function useContributeGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { goalId: string; amount: number }) => contributeToGoal(data.goalId, data.amount),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: GOALS_KEYS.all });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_KEYS.all });
      
      if (data.justCompleted) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#7C5CFF", "#4DA3FF", "#22C55E", "#F59E0B"]
        });
        toast.success("¡Objetivo Completado!", { 
          icon: "🏆",
          description: "¡Felicidades por alcanzar tu meta!"
        });
      } else {
        toast.success("Contribución añadida", { icon: "💰" });
      }
    },
    onError: (error) => {
      toast.error("Error al contribuir", {
        description: error instanceof Error ? error.message : "Intenta nuevamente.",
      });
    },
  });
}

export function useDeleteGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GOALS_KEYS.all });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_KEYS.all });
      toast.success("Objetivo eliminado", { icon: "🗑️" });
    },
    onError: (error) => {
      toast.error("Error al eliminar", {
        description: error instanceof Error ? error.message : "Intenta nuevamente.",
      });
    },
  });
}
