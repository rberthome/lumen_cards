import { featureFlagsConfig } from '../featureFlags.config';
import type { FlagAdapter } from '../featureFlags.types';

export const localAdapter: FlagAdapter = {
  get(flag: string) {
    return featureFlagsConfig[flag as keyof typeof featureFlagsConfig];
  },
};
