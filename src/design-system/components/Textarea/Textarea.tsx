import type { TextareaHTMLAttributes } from "react";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({
  label,
  error,
  className = "",
  ...props
}: TextareaProps) {
  const ring = error
    ? "border-incorrect focus:ring-[rgba(239,68,68,.18)]"
    : "border-line focus:border-accent focus:ring-[rgba(245,158,11,.22)]";

  return (
    <label className="flex w-full flex-col gap-1.5">
      {label && (
        <span className="text-sm font-medium text-foreground">{label}</span>
      )}
      <textarea
        className={`w-full resize-y rounded-[var(--radius-md)] border bg-field px-3.5 py-3 text-[15px] text-foreground outline-none transition focus:ring-2 ${ring} ${className}`}
        {...props}
      />
      {error && <span className="text-sm text-incorrect">{error}</span>}
    </label>
  );
}
