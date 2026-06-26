"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Button } from "@/design-system";
import { useReviewSession } from "../hooks/useReviewSession";
import { ReviewProgress } from "./ReviewProgress";
import { SessionResult } from "./SessionResult";
import { FlipCard } from "./FlipCard";
import type { DueCard } from "../repository";
import type { SessionCard } from "../sessionTypes";

type T = ReturnType<typeof useTranslations>;

function choiceClass(
  choice: string,
  back: string,
  selected: string | null,
  locked: boolean,
): string {
  const base =
    "rounded-[var(--radius-md)] border-2 px-5 py-4 text-left font-medium transition-all";
  if (!locked)
    return `${base} cursor-pointer border-neutral-200 bg-white hover:border-gold-300 hover:bg-gold-50`;
  if (choice === back)
    return `${base} border-[#22C55E] bg-[#F0FDF4] text-[#15803D]`;
  if (choice === selected)
    return `${base} border-error bg-[#FEF2F2] text-[#B91C1C]`;
  return `${base} border-neutral-100 bg-neutral-50 text-neutral-300`;
}

function ModeBadge({ mode, t }: { mode: SessionCard["mode"]; t: T }) {
  const qcm = mode === "qcm";
  return (
    <div className="flex justify-center">
      <span
        className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
          qcm ? "bg-indigo-50 text-indigo-600" : "bg-gold-50 text-gold-700"
        }`}
      >
        {qcm ? t("modeQcm") : t("modeFree")}
      </span>
    </div>
  );
}

function Explanation({ text, t }: { text: string; t: T }) {
  return (
    <div className="rounded-[var(--radius-md)] bg-indigo-50 p-4 text-left">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-indigo-600">
        {t("explanation")}
      </p>
      <p className="text-sm leading-relaxed text-indigo-900">{text}</p>
    </div>
  );
}

function QcmView({
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
      <div className="flex min-h-36 items-center justify-center rounded-[var(--radius-lg)] border border-neutral-200 bg-white p-8 text-center shadow-[var(--shadow-sm)]">
        <p className="text-xl font-medium leading-relaxed text-neutral-900">
          {card.front}
        </p>
      </div>
      <div className="flex flex-col gap-3">
        {card.choices.map((choice) => (
          <button
            key={choice}
            type="button"
            disabled={locked}
            onClick={() => onPick(choice)}
            className={choiceClass(choice, card.back, selected, locked)}
          >
            {choice}
          </button>
        ))}
      </div>
      {locked && (
        <div className="flex flex-col gap-4">
          {card.explanation && <Explanation text={card.explanation} t={t} />}
          <Button onClick={onContinue} disabled={busy}>
            {t("continue")}
          </Button>
        </div>
      )}
    </>
  );
}

function FreeView({
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
      <FlipCard
        flipped={flipped}
        front={
          <p className="text-xl font-medium leading-relaxed text-neutral-900">
            {card.front}
          </p>
        }
        back={
          <div className="flex flex-col gap-3">
            <p className="text-lg font-medium text-neutral-900">{card.back}</p>
            {card.explanation && <Explanation text={card.explanation} t={t} />}
          </div>
        }
      />
      {!flipped ? (
        <Button onClick={onReveal}>{t("reveal")}</Button>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="secondary"
            disabled={busy}
            onClick={() => onAnswer(false)}
          >
            {t("didntKnow")}
          </Button>
          <Button disabled={busy} onClick={() => onAnswer(true)}>
            {t("knew")}
          </Button>
        </div>
      )}
    </>
  );
}

export function ReviewSession({ cards }: { cards: DueCard[] }) {
  const t = useTranslations("study");
  const router = useRouter();
  const s = useReviewSession(cards);

  if (s.phase === "done" && s.result) {
    return (
      <SessionResult
        result={s.result}
        correct={s.correct}
        incorrect={s.incorrect}
        onHome={() => router.push("/")}
      />
    );
  }

  const card = s.current;
  const locked = s.phase === "feedback";

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6 px-6 py-8">
      <ReviewProgress
        current={s.progress}
        total={s.total}
        correct={s.correct}
        incorrect={s.incorrect}
      />
      <ModeBadge mode={card.mode} t={t} />
      {card.mode === "qcm" ? (
        <QcmView
          card={card}
          selected={s.selected}
          locked={locked}
          busy={s.busy}
          t={t}
          onPick={s.pickChoice}
          onContinue={s.commitQcm}
        />
      ) : (
        <FreeView
          card={card}
          flipped={locked}
          busy={s.busy}
          t={t}
          onReveal={s.reveal}
          onAnswer={s.answer}
        />
      )}
    </div>
  );
}
