import { colors } from '../tokens';

export const lightTheme = {
  background: {
    primary: colors.neutral[0],
    secondary: colors.neutral[50],
    card: colors.neutral[0],
  },
  text: {
    primary: colors.neutral[900],
    secondary: colors.neutral[600],
    muted: colors.neutral[400],
    inverse: colors.neutral[0],
  },
  accent: {
    primary: colors.gold[500],
    secondary: colors.indigo[600],
  },
  border: colors.neutral[200],
  semantic: colors.semantic,
} as const;
