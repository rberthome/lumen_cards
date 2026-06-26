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
    ? "border-error focus:ring-[rgba(239,68,68,.18)]"
    : "border-neutral-200 focus:border-gold-500 focus:ring-[rgba(245,158,11,.22)]";

  return (
    <label className="flex w-full flex-col gap-1.5">
      {label && (
        <span className="text-sm font-medium text-neutral-700">{label}</span>
      )}
      <textarea
        className={`w-full resize-y rounded-[var(--radius-md)] border bg-white px-3.5 py-3 text-[15px] text-neutral-900 outline-none transition focus:ring-2 ${ring} ${className}`}
        {...props}
      />
      {error && <span className="text-sm text-error">{error}</span>}
    </label>
  );
}
