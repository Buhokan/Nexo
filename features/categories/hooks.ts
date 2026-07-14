import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllCategoriesAdmin, createCategory, deleteCategory } from "./actions";
import { TRANSACTIONS_KEYS } from "@/features/transactions/hooks";
import { DASHBOARD_KEYS } from "@/features/dashboard/hooks";
import { toast } from "sonner";

export const CATEGORIES_KEYS = {
  allAdmin: () => ["categories_admin"] as const,
};

export function useAllCategoriesAdmin() {
  return useQuery({
    queryKey: CATEGORIES_KEYS.allAdmin(),
    queryFn: () => getAllCategoriesAdmin(),
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_KEYS.allAdmin() });
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_KEYS.categories() });
      toast.success("Categoría creada", { icon: "✨" });
    },
    onError: (error) => {
      toast.error("Error al crear", {
        description: error instanceof Error ? error.message : "Intenta nuevamente.",
      });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_KEYS.allAdmin() });
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_KEYS.categories() });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_KEYS.all });
      toast.success("Categoría eliminada", { icon: "🗑️" });
    },
    onError: (error) => {
      toast.error("No se pudo eliminar", {
        description: error instanceof Error ? error.message : "Intenta nuevamente.",
      });
    },
  });
}
