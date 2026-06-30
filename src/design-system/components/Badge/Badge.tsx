import type { HTMLAttributes } from "react";

// Variants alignés sur PROJECT.md §5 (badges de mode / état / streak).
export type BadgeVariant =
  | "qcm" // 🃏 Choix multiple — indigo
  | "free" // 📖 Réponse libre — or
  | "acquired" // ✓ Acquise — vert
  | "toReview" // ✗ À revoir — rouge
  | "streak" // 🔥 N jours — or
  | "neutral";

const base =
  "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold";

const variants: Record<BadgeVariant, string> = {
  qcm: "bg-info-soft text-info uppercase tracking-[0.12em]",
  free: "bg-accent-soft text-accent-strong border border-accent-line uppercase tracking-[0.12em]",
  acquired: "bg-correct/15 text-correct",
  toReview: "bg-incorrect/15 text-incorrect",
  streak: "bg-accent-soft text-accent-strong",
  neutral: "bg-surface-2 text-muted",
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({
  variant = "neutral",
  className = "",
  ...props
}: BadgeProps) {
  return (
    <span className={`${base} ${variants[variant]} ${className}`} {...props} />
  );
}
