// Tout nouveau comportement conditionnel passe par un flag déclaré ici.
export const featureFlagsConfig = {
  MAINTENANCE_MODE: false,
  AI_CARD_GENERATION: false, // V2 — génération IA (later)
} as const;
