import { localAdapter } from "./adapters/localAdapter";
import type { FeatureFlag } from "./types";

const adapter = localAdapter;

export function isFeatureEnabled(flag: FeatureFlag): boolean {
  const value = adapter.get(flag);
  if (value === undefined) return false; // fallback maintenance-safe
  return value;
}

// Hook côté React (la valeur est statique pour l'instant ; le hook réserve l'évolution remote).
export function useFeatureFlag(flag: FeatureFlag): boolean {
  return isFeatureEnabled(flag);
}
