import { localAdapter } from './adapters/localAdapter';
import type { FeatureFlag } from './featureFlags.types';

export function useFeatureFlag(flag: FeatureFlag): boolean {
  const value = localAdapter.get(flag);
  return value ?? false;
}
