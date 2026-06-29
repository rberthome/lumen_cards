import type { SelectHTMLAttributes } from "react";

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

export function Select({
  label,
  error,
  options,
  placeholder,
  className = "",
  ...props
}: SelectProps) {
  const ring = error
    ? "border-incorrect focus:ring-[rgba(239,68,68,.18)]"
    : "border-line focus:border-accent focus:ring-[rgba(245,158,11,.22)]";

  return (
    <label className="flex w-full flex-col gap-1.5">
      {label && (
        <span className="text-sm font-medium text-foreground">{label}</span>
      )}
      <select
        className={`w-full rounded-[var(--radius-md)] border bg-field px-3.5 py-3 text-[15px] text-foreground outline-none transition focus:ring-2 ${ring} ${className}`}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error && <span className="text-sm text-incorrect">{error}</span>}
    </label>
  );
}
