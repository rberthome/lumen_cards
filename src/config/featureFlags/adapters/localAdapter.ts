import { featureFlagsConfig } from "../config";
import type { FeatureFlag, FeatureFlagAdapter } from "../types";

// Implémentation par défaut : lit la config locale. Un remoteAdapter pourra l'implémenter plus tard.
export const localAdapter: FeatureFlagAdapter = {
  get(flag: FeatureFlag) {
    return featureFlagsConfig[flag];
  },
};
