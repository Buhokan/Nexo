"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState, type ReactNode } from "react";

interface QueryProviderProps {
  children: ReactNode;
}

/**
 * Provider de TanStack Query con configuración optimizada para Nexo.
 * - staleTime: 60s → los datos se consideran frescos por 1 minuto
 * - gcTime: 10min → el cache persiste 10 minutos en memoria
 * - retry: 2 → reintenta 2 veces en caso de error
 */
export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,        // 1 minuto
            gcTime: 10 * 60 * 1000,      // 10 minutos
            retry: 2,
            refetchOnWindowFocus: false,  // No refetch al cambiar de tab
          },
          mutations: {
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
      )}
    </QueryClientProvider>
  );
}
