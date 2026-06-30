import type { LucideIcon } from "lucide-react";
import {
  ArrowLeft,
  BarChart3,
  BookOpen,
  Check,
  Eye,
  EyeOff,
  Flame,
  FolderTree,
  GraduationCap,
  Hourglass,
  Layers,
  Lightbulb,
  Moon,
  Settings,
  Sun,
  TriangleAlert,
  Users,
  WalletCards,
  X,
} from "lucide-react";

// Registre sémantique : on nomme les icônes par rôle métier, pas par leur nom
// dans la lib. Ça centralise les icônes dans le design-system (règle projet)
// et permet de changer de librairie sans toucher aux écrans.
const registry = {
  back: ArrowLeft,
  themeLight: Sun,
  themeDark: Moon,
  categories: FolderTree,
  decks: Layers,
  users: Users,
  graduation: GraduationCap,
  stats: BarChart3,
  settings: Settings,
  streak: Flame,
  due: Hourglass,
  correct: Check,
  incorrect: X,
  cards: WalletCards,
  free: BookOpen,
  explanation: Lightbulb,
  reveal: Eye,
  hide: EyeOff,
  warning: TriangleAlert,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof registry;

export interface IconProps {
  name: IconName;
  /** Taille en px (carré). Défaut 18 — adapté au corps de texte. */
  size?: number;
  className?: string;
  strokeWidth?: number;
  /** Décoratif par défaut : masqué aux lecteurs d'écran. Passer un label pour le rendre signifiant. */
  label?: string;
}

export function Icon({
  name,
  size = 18,
  className = "",
  strokeWidth = 2,
  label,
}: IconProps) {
  const Glyph = registry[name];
  return (
    <Glyph
      size={size}
      strokeWidth={strokeWidth}
      className={className}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? "img" : undefined}
    />
  );
}
