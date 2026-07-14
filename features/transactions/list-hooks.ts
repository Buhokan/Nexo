import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTransactions, getTransactionStats, deleteTransaction, type GetTransactionsParams } from "./list-actions";
import { TRANSACTIONS_KEYS } from "./hooks"; // Reutilizamos las keys base
import { DASHBOARD_KEYS } from "@/features/dashboard/hooks";
import { toast } from "sonner";

export const LIST_KEYS = {
  list: (params: GetTransactionsParams) => [...TRANSACTIONS_KEYS.all, "list", params] as const,
  stats: () => [...TRANSACTIONS_KEYS.all, "stats"] as const,
};

export function useTransactionsList(params: GetTransactionsParams) {
  return useQuery({
    queryKey: LIST_KEYS.list(params),
    queryFn: () => getTransactions(params),
  });
}

export function useTransactionStats() {
  return useQuery({
    queryKey: LIST_KEYS.stats(),
    queryFn: () => getTransactionStats(),
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      // Invalidar transacciones y dashboard
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_KEYS.all });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_KEYS.all });
      toast.success("Movimiento eliminado", {
        icon: "🗑️",
      });
    },
    onError: () => {
      toast.error("Error al eliminar", {
        description: "Intenta nuevamente.",
      });
    },
  });
}
