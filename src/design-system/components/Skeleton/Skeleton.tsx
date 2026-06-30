interface SkeletonProps {
  className?: string;
}

// Placeholder de chargement avec balayage shimmer (PROJECT.md §5).
export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <span
      aria-hidden
      className={`relative block overflow-hidden rounded-[var(--radius-md)] bg-surface-2 ${className}`}
    >
      <span className="absolute inset-0 -translate-x-full animate-[lc-shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
    </span>
  );
}
