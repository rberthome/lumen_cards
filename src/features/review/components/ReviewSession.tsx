"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useReviewSession } from "../hooks/useReviewSession";
import { ReviewProgress } from "./ReviewProgress";
import { SessionResult } from "./SessionResult";
import { QcmView } from "./ReviewQcm";
import { FreeView } from "./ReviewFree";
import { ModeBadge } from "./reviewParts";
import type { DueCard } from "../repository";

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
    <div className="mx-auto flex max-w-xl flex-col gap-5 px-6 py-6">
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
