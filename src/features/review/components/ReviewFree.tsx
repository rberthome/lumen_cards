import { Button } from "@/design-system";
import type { SessionCard } from "../sessionTypes";
import { FlipCard } from "./FlipCard";
import { Explanation, type T } from "./reviewParts";

function FlipFront({ text, t }: { text: string; t: T }) {
  return (
    <>
      <p className="font-serif text-[22px] font-semibold leading-snug text-foreground">
        {text}
      </p>
      <p className="mt-6 flex items-center gap-1.5 text-[13px] text-muted">
        <span className="text-base">👆</span> {t("reveal")}
      </p>
    </>
  );
}

function FlipBack({ text }: { text: string }) {
  return (
    <p className="font-serif text-xl font-semibold leading-relaxed text-white">
      {text}
    </p>
  );
}

export function FreeView({
  card,
  flipped,
  busy,
  t,
  onReveal,
  onAnswer,
}: {
  card: SessionCard;
  flipped: boolean;
  busy: boolean;
  t: T;
  onReveal: () => void;
  onAnswer: (knew: boolean) => void;
}) {
  return (
    <>
      <button
        type="button"
        onClick={flipped ? undefined : onReveal}
        disabled={flipped}
        className={`block w-full text-left ${flipped ? "" : "cursor-pointer"}`}
      >
        <FlipCard
          flipped={flipped}
          front={<FlipFront text={card.front} t={t} />}
          back={<FlipBack text={card.back} />}
        />
      </button>
      {flipped && (
        <>
          <div className="grid grid-cols-2 gap-3.5">
            <Button disabled={busy} onClick={() => onAnswer(true)}>
              {t("knew")}
            </Button>
            <Button
              variant="secondary"
              disabled={busy}
              onClick={() => onAnswer(false)}
            >
              {t("didntKnow")}
            </Button>
          </div>
          {card.explanation && <Explanation text={card.explanation} t={t} />}
        </>
      )}
    </>
  );
}
