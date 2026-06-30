type LoaderSize = "sm" | "md" | "lg";

const sizes: Record<LoaderSize, string> = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-9 w-9 border-[3px]",
};

interface LoaderProps {
  size?: LoaderSize;
  className?: string;
  label?: string;
}

// Spinner : anneau gold-200, sommet gold-600 (PROJECT.md §5).
export function Loader({ size = "md", className = "", label }: LoaderProps) {
  return (
    <span
      role="status"
      aria-label={label}
      className={`inline-block animate-spin rounded-full border-gold-200 border-t-gold-600 ${sizes[size]} ${className}`}
    />
  );
}
