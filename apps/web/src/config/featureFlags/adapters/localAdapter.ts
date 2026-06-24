import { featureFlagsConfig } from '../featureFlags.config';
import type { FlagAdapter } from '../featureFlags.types';

export const localAdapter: FlagAdapter = {
  get: (flag) => featureFlagsConfig[flag as keyof typeof featureFlagsConfig],
};
