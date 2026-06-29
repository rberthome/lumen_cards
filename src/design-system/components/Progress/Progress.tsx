interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
  label?: string;
}

// Barre de progression : piste surface-2, remplissage dégradé or (PROJECT.md §5).
export function Progress({
  value,
  max = 100,
  className = "",
  label,
}: ProgressProps) {
  const pct = max <= 0 ? 0 : Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={label}
      className={`h-2 w-full overflow-hidden rounded-full bg-surface-2 ${className}`}
    >
      <div
        className="h-full rounded-full bg-gradient-to-r from-gold-400 to-gold-600 transition-[width] duration-300"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
