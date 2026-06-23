import type { FeatureFlag } from './featureFlags.types';

export const featureFlagsConfig: Record<FeatureFlag, boolean> = {
  AI_CARD_GENERATION: true,
  SPACED_REPETITION_V2: false,
  STATS_ADVANCED: false,
  SOCIAL_SHARING: false,
  AUTH_ENABLED: false,
  MAINTENANCE_MODE: false,
};
