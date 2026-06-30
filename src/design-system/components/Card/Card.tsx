import type { HTMLAttributes } from "react";

type Elevation = "none" | "sm" | "md" | "lg";
type Padding = "none" | "sm" | "md" | "lg";

const elevations: Record<Elevation, string> = {
  none: "",
  sm: "shadow-[var(--shadow-sm)]",
  md: "shadow-[var(--shadow-md)]",
  lg: "shadow-[var(--shadow-lg)]",
};

const paddings: Record<Padding, string> = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-7",
};

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  elevation?: Elevation;
  padding?: Padding;
}

// Surface générique : carte, encart, panneau. Tout vient des tokens sémantiques.
export function Card({
  elevation = "sm",
  padding = "md",
  className = "",
  ...props
}: CardProps) {
  return (
    <div
      className={`rounded-[var(--radius-lg)] border border-line bg-surface ${elevations[elevation]} ${paddings[padding]} ${className}`}
      {...props}
    />
  );
}
