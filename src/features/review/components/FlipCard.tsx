import type { ReactNode } from "react";

const FACE =
  "absolute inset-0 flex items-center justify-center overflow-auto rounded-[var(--radius-lg)] border border-neutral-200 bg-white p-8 text-center [backface-visibility:hidden]";

export function FlipCard({
  flipped,
  front,
  back,
}: {
  flipped: boolean;
  front: ReactNode;
  back: ReactNode;
}) {
  return (
    <div className="[perspective:1200px]">
      <div
        className={`relative min-h-48 w-full shadow-[var(--shadow-sm)] transition-transform duration-500 [transform-style:preserve-3d] ${
          flipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        <div className={FACE}>{front}</div>
        <div className={`${FACE} [transform:rotateY(180deg)]`}>{back}</div>
      </div>
    </div>
  );
}
