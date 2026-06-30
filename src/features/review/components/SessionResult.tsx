"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";
import { useTranslations } from "next-intl";
import { Badge, Button, Icon, Progress } from "@/design-system";
import type { ReviewResultSummary } from "../sessionTypes";

function XpCard({
  xp,
  t,
}: {
  xp: number;
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <div className="relative overflow-hidden rounded-[var(--radius-lg)] bg-gradient-to-br from-[#1e1a0e] to-[#3b2a06] p-7 text-center shadow-[var(--shadow-gold)]">
      <div className="pointer-events-none absolute -top-12 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(251,191,36,.2),transparent_70%)]" />
      <p className="font-serif text-6xl font-semibold leading-none text-gold-50">
        {t("xpEarned", { xp })}
      </p>
    </div>
  );
}

function ScoreGrid({
  correct,
  incorrect,
  t,
}: {
  correct: number;
  incorrect: number;
  t: ReturnType<typeof useTranslations>;
}) {
  const total = correct + incorrect;
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
  return (
    <div className="flex flex-col gap-4 rounded-[var(--radius-lg)] border border-line bg-surface p-6 shadow-[var(--shadow-sm)]">
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-[var(--radius-md)] bg-correct/15 p-4 text-center">
          <p className="font-serif text-3xl font-semibold leading-none text-correct">
            {correct}
          </p>
          <p className="mt-1 flex items-center justify-center gap-1 text-[13px] font-medium text-correct">
            <Icon name="correct" size={14} /> {t("correctLabel")}
          </p>
        </div>
        <div className="rounded-[var(--radius-md)] bg-incorrect/15 p-4 text-center">
          <p className="font-serif text-3xl font-semibold leading-none text-incorrect">
            {incorrect}
          </p>
          <p className="mt-1 flex items-center justify-center gap-1 text-[13px] font-medium text-incorrect">
            <Icon name="incorrect" size={14} /> {t("incorrectLabel")}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Progress value={correct} max={total} className="flex-1" />
        <span className="flex-shrink-0 text-[13px] font-bold text-correct">
          {pct} %
        </span>
      </div>
    </div>
  );
}

export function SessionResult({
  result,
  correct,
  incorrect,
  onHome,
}: {
  result: ReviewResultSummary;
  correct: number;
  incorrect: number;
  onHome: () => void;
}) {
  const t = useTranslations("study");

  useEffect(() => {
    confetti({
      particleCount: 120,
      spread: 75,
      origin: { y: 0.6 },
      colors: ["#F59E0B", "#FBBF24", "#4F46E5", "#22C55E"],
    });
  }, []);

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 px-6 py-12">
      <div className="text-center">
        <div className="mb-3 flex justify-center text-accent-strong">
          <Icon name="graduation" size={48} />
        </div>
        <h1 className="font-serif text-3xl font-semibold text-foreground">
          {t("sessionDone")}
        </h1>
      </div>

      <XpCard xp={result.xpEarned} t={t} />

      <div className="flex items-center justify-center">
        <Badge variant="streak">
          <Icon name="streak" size={14} /> {t("streakLabel", { count: result.streakDays })}
        </Badge>
      </div>

      <ScoreGrid correct={correct} incorrect={incorrect} t={t} />

      <Button onClick={onHome} variant="secondary">
        {t("backHome")}
      </Button>
    </div>
  );
}
