// Deux voix : Georgia (contenu, on lit la pensée) · system-ui (action, on agit).
export const typography = {
  fontFamily: {
    serif: 'Georgia, "Times New Roman", serif',
    sans: 'system-ui, -apple-system, "Segoe UI", sans-serif',
    mono: "ui-monospace, monospace",
  },
  // [taille px, interligne, graisse]
  roles: {
    display: { size: 46, leading: 1.1, weight: 600, family: "serif" },
    h1: { size: 32, leading: 1.15, weight: 600, family: "serif" },
    h2: { size: 24, leading: 1.2, weight: 600, family: "serif" },
    body: { size: 16, leading: 1.6, weight: 400, family: "sans" },
    secondary: { size: 14, leading: 1.6, weight: 400, family: "sans" },
    label: {
      size: 12,
      leading: 1.4,
      weight: 600,
      family: "sans",
      tracking: "0.12em",
      uppercase: true,
    },
  },
} as const;
