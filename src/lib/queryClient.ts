import { QueryClient } from "@tanstack/react-query";

/**
 * Single shared React Query client.
 * - Sensible retry/stale defaults for a JSON Server backend.
 * - Errors are surfaced to the UI via toasts in the mutation/query layers.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30_000,
    },
    mutations: {
      retry: 0,
    },
  },
});
