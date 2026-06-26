import { QueryClient } from "@tanstack/react-query";

// Toute requête côté client passe par React Query — jamais de fetch() nu dans un composant.
export function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: { staleTime: 60_000, refetchOnWindowFocus: false },
    },
  });
}
