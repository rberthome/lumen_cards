// Le point doré « lumière » de la marque. Centralise le dégradé (zéro style inline ad hoc).
const GRADIENT =
  "bg-[radial-gradient(circle_at_50%_38%,#FEF3C7_0%,#FBBF24_38%,#D97706_100%)]";

export function LumenMark({ size = "md" }: { size?: "md" | "lg" }) {
  const dim = size === "lg" ? "h-12 w-12" : "h-11 w-11";
  return (
    <span
      aria-hidden
      className={`inline-block rounded-full shadow-[var(--shadow-gold)] ${dim} ${GRADIENT}`}
    />
  );
}
