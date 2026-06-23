import type { FeatureFlag } from './featureFlags.types';

export const featureFlagsConfig: Record<FeatureFlag, boolean> = {
  ADMIN_PANEL: true,
  RGPD_RIGHT_TO_FORGET: true,
  RGPD_DATA_EXPORT: true,
  AUTH_ENABLED: false,
  MAINTENANCE_MODE: false,
};
