import type { ReactNode } from "react";

const FACE =
  "absolute inset-0 flex flex-col justify-center overflow-auto rounded-[var(--radius-lg)] p-8 [backface-visibility:hidden]";

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
        className={`relative min-h-64 w-full transition-transform duration-500 ease-[cubic-bezier(.4,0,.2,1)] [transform-style:preserve-3d] ${
          flipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        <div
          className={`${FACE} border border-line bg-surface shadow-[var(--shadow-sm)]`}
        >
          {front}
        </div>
        <div
          className={`${FACE} bg-neutral-900 shadow-[var(--shadow-md)] [transform:rotateY(180deg)]`}
        >
          {back}
        </div>
      </div>
    </div>
  );
}
