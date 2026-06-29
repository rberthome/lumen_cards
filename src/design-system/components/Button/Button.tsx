import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md";

const base =
  "inline-flex items-center justify-center gap-2 font-sans font-semibold rounded-[var(--radius-md)] transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 disabled:cursor-not-allowed";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent-strong text-white shadow-[0_2px_8px_rgba(217,119,6,.30)] hover:bg-gold-700 hover:-translate-y-px active:translate-y-0 disabled:bg-surface-2 disabled:text-muted disabled:shadow-none",
  secondary:
    "bg-surface text-foreground border border-line hover:bg-surface-2 active:bg-surface-2 disabled:text-muted",
  ghost: "bg-transparent text-info hover:bg-info-soft disabled:text-muted",
};

const sizes: Record<Size, string> = {
  sm: "text-sm px-4 py-2",
  md: "text-[15px] px-[22px] py-3",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  );
}
