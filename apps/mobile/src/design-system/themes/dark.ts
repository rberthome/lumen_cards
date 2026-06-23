import { colors } from '../tokens';

export const darkTheme = {
  background: {
    primary: colors.neutral[950],
    secondary: colors.neutral[900],
    card: colors.neutral[800],
  },
  text: {
    primary: colors.neutral[50],
    secondary: colors.neutral[300],
    muted: colors.neutral[500],
    inverse: colors.neutral[900],
  },
  accent: {
    primary: colors.gold[400],
    secondary: colors.indigo[400],
  },
  border: colors.neutral[700],
  semantic: colors.semantic,
} as const;
