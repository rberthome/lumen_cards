import type { InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = "", ...props }: InputProps) {
  const ring = error
    ? "border-error focus:ring-[rgba(239,68,68,.18)]"
    : "border-neutral-200 focus:border-gold-500 focus:ring-[rgba(245,158,11,.22)]";

  return (
    <label className="flex w-full flex-col gap-1.5">
      {label && (
        <span className="text-sm font-medium text-neutral-700">{label}</span>
      )}
      <input
        className={`w-full rounded-[var(--radius-md)] border bg-white px-3.5 py-3 text-[15px] text-neutral-900 outline-none transition focus:ring-2 disabled:cursor-not-allowed disabled:bg-neutral-50 disabled:text-neutral-400 ${ring} ${className}`}
        {...props}
      />
      {error && <span className="text-sm text-error">{error}</span>}
    </label>
  );
}
