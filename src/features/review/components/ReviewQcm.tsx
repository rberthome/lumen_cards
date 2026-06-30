import { Button, Icon, type IconName } from "@/design-system";
import type { SessionCard } from "../sessionTypes";
import { Explanation, QuestionCard, type T } from "./reviewParts";

function choiceClass(
  choice: string,
  back: string,
  selected: string | null,
  locked: boolean,
): string {
  const base =
    "flex w-full items-center justify-between gap-3 rounded-[var(--radius-md)] border-[1.5px] px-5 py-4 text-left text-[15px] font-medium leading-snug transition-all";
  if (!locked)
    return `${base} cursor-pointer border-line bg-surface text-foreground hover:border-accent-line hover:bg-accent-soft`;
  if (choice === back)
    return `${base} border-correct bg-correct/15 text-correct`;
  if (choice === selected)
    return `${base} border-incorrect bg-incorrect/15 text-incorrect`;
  return `${base} border-line bg-surface text-muted opacity-60`;
}

function choiceIcon(
  choice: string,
  back: string,
  selected: string | null,
  locked: boolean,
): IconName | null {
  if (!locked) return null;
  if (choice === back) return "correct";
  if (choice === selected) return "incorrect";
  return null;
}

export function QcmView({
  card,
  selected,
  locked,
  busy,
  t,
  onPick,
  onContinue,
}: {
  card: SessionCard;
  selected: string | null;
  locked: boolean;
  busy: boolean;
  t: T;
  onPick: (c: string) => void;
  onContinue: () => void;
}) {
  return (
    <>
      <QuestionCard text={card.front} />
      <div className="flex flex-col gap-3">
        {card.choices.map((choice) => (
          <button
            key={choice}
            type="button"
            disabled={locked}
            onClick={() => onPick(choice)}
            className={choiceClass(choice, card.back, selected, locked)}
          >
            <span>{choice}</span>
            {(() => {
              const icon = choiceIcon(choice, card.back, selected, locked);
              return icon ? <Icon name={icon} size={18} /> : null;
            })()}
          </button>
        ))}
      </div>
      {locked && (
        <div className="flex flex-col gap-5">
          {card.explanation && <Explanation text={card.explanation} t={t} />}
          <Button onClick={onContinue} disabled={busy} className="self-end">
            {t("continue")}
          </Button>
        </div>
      )}
    </>
  );
}
