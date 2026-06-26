// Palette LumenCards — source de vérité : docs/design/systeme-visuel-light.html
// Un rôle par couleur : l'or éclaire, l'indigo explique, le neutre soutient.
export const colors = {
  gold: {
    50: "#FFFBEB",
    200: "#FDE68A",
    400: "#FBBF24",
    500: "#F59E0B",
    600: "#D97706",
    700: "#B45309",
  },
  indigo: {
    50: "#EEF2FF",
    600: "#4F46E5",
    900: "#312E81",
  },
  neutral: {
    0: "#FFFFFF",
    50: "#F8FAFC",
    100: "#F1F5F9",
    200: "#E2E8F0",
    300: "#CBD5E1",
    400: "#94A3B8",
    500: "#64748B",
    700: "#334155",
    900: "#0F172A",
  },
  semantic: {
    success: "#22C55E",
    error: "#EF4444",
    warning: "#F59E0B",
    info: "#3B82F6",
  },
} as const;
