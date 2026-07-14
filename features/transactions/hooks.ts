import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCategories, createTransaction } from "./actions";
import { DASHBOARD_KEYS } from "@/features/dashboard/hooks";
import { toast } from "sonner";

export const TRANSACTIONS_KEYS = {
  all: ["transactions"] as const,
  categories: () => [...TRANSACTIONS_KEYS.all, "categories"] as const,
};

export function useCategories() {
  return useQuery({
    queryKey: TRANSACTIONS_KEYS.categories(),
    queryFn: () => getCategories(),
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      // Invalidar dashboard entero para que recargue gráficas y montos
      queryClient.invalidateQueries({ queryKey: DASHBOARD_KEYS.all });
      toast.success("Transacción registrada", {
        description: "Se ha añadido a tu historial. ¡Ganaste +10 XP!",
        icon: "🔥",
      });
    },
    onError: (error) => {
      toast.error("Error al registrar", {
        description: error instanceof Error ? error.message : "Intenta nuevamente.",
      });
    },
  });
}
