import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md";

const base =
  "inline-flex items-center justify-center gap-2 font-sans font-semibold rounded-[var(--radius-md)] transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 disabled:cursor-not-allowed";

const variants: Record<Variant, string> = {
  primary:
    "bg-gold-600 text-white shadow-[0_2px_8px_rgba(217,119,6,.30)] hover:bg-gold-700 hover:-translate-y-px active:translate-y-0 disabled:bg-neutral-100 disabled:text-neutral-400 disabled:shadow-none",
  secondary:
    "bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-50 active:bg-neutral-100 disabled:text-neutral-300",
  ghost:
    "bg-transparent text-indigo-600 hover:bg-indigo-50 disabled:text-neutral-300",
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
