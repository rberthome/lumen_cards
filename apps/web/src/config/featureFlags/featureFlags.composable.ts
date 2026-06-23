import { localAdapter } from './adapters/localAdapter';
import type { FeatureFlag } from './featureFlags.types';

export function useFeatureFlag(flag: FeatureFlag): boolean {
  return localAdapter.get(flag) ?? false;
}
