"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";
import { useTranslations } from "next-intl";
import { Button, LumenMark } from "@/design-system";
import type { ReviewResultSummary } from "../sessionTypes";

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
    <div className="mx-auto flex max-w-md flex-col items-center gap-6 px-6 py-20 text-center">
      <LumenMark size="lg" />
      <h1 className="font-serif text-3xl font-semibold text-neutral-900">
        {t("sessionDone")}
      </h1>
      <p className="text-2xl font-semibold text-gold-700">
        {t("xpEarned", { xp: result.xpEarned })}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
        <span className="rounded-full bg-gold-50 px-3 py-1 font-semibold text-gold-700">
          {t("streakLabel", { count: result.streakDays })}
        </span>
        <span className="text-[#15803D]">
          ✓ {correct} {t("correctLabel")}
        </span>
        <span className="text-error">
          ✗ {incorrect} {t("incorrectLabel")}
        </span>
      </div>
      <Button onClick={onHome} className="mt-4">
        {t("backHome")}
      </Button>
    </div>
  );
}
