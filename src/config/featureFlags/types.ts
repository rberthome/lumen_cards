import type { featureFlagsConfig } from "./config";

export type FeatureFlag = keyof typeof featureFlagsConfig;

export interface FeatureFlagAdapter {
  get(flag: FeatureFlag): boolean | undefined;
}
