export interface FlagAdapter {
  get(flag: string): boolean | undefined;
}

export type FeatureFlag =
  | 'AI_CARD_GENERATION'
  | 'REVIEW_SESSION'
  | 'SPACED_REPETITION_V2'
  | 'STATS_ADVANCED'
  | 'SOCIAL_SHARING'
  | 'AUTH_ENABLED'
  | 'MAINTENANCE_MODE';
