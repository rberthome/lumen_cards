"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/design-system";
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
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-6 px-6 py-20 text-center">
      <span
        className="h-12 w-12 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 50% 38%, #FEF3C7 0%, #FBBF24 38%, #D97706 100%)",
          boxShadow: "var(--shadow-gold)",
        }}
      />
      <h1 className="font-serif text-3xl font-semibold text-neutral-900">
        {t("sessionDone")}
      </h1>
      <p className="text-2xl font-semibold text-gold-700">
        {t("xpEarned", { xp: result.xpEarned })}
      </p>
      <div className="flex items-center gap-6 text-sm">
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
