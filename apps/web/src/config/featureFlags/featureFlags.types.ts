export type FeatureFlag =
  | 'ADMIN_PANEL'
  | 'RGPD_RIGHT_TO_FORGET'
  | 'RGPD_DATA_EXPORT'
  | 'AUTH_ENABLED'
  | 'MAINTENANCE_MODE';

export interface FlagAdapter {
  get(flag: string): boolean | undefined;
}
