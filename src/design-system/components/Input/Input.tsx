import type { InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = "", ...props }: InputProps) {
  const ring = error
    ? "border-incorrect focus:ring-[rgba(239,68,68,.18)]"
    : "border-line focus:border-accent focus:ring-[rgba(245,158,11,.22)]";

  return (
    <label className="flex w-full flex-col gap-1.5">
      {label && (
        <span className="text-sm font-medium text-foreground">{label}</span>
      )}
      <input
        className={`w-full rounded-[var(--radius-md)] border bg-field px-3.5 py-3 text-[15px] text-foreground outline-none transition focus:ring-2 disabled:cursor-not-allowed disabled:bg-background disabled:text-muted ${ring} ${className}`}
        {...props}
      />
      {error && <span className="text-sm text-incorrect">{error}</span>}
    </label>
  );
}
