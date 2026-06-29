import type { useTranslations } from "next-intl";
import { Badge } from "@/design-system";
import type { SessionCard } from "../sessionTypes";

export type T = ReturnType<typeof useTranslations>;

export function ModeBadge({ mode, t }: { mode: SessionCard["mode"]; t: T }) {
  const qcm = mode === "qcm";
  return (
    <div className="flex">
      <Badge variant={qcm ? "qcm" : "free"}>
        {qcm ? `🃏 ${t("modeQcm")}` : `📖 ${t("modeFree")}`}
      </Badge>
    </div>
  );
}

export function QuestionCard({ text }: { text: string }) {
  return (
    <div className="flex min-h-44 flex-col justify-center rounded-[var(--radius-lg)] border border-line bg-surface p-8 shadow-[var(--shadow-sm)]">
      <p className="font-serif text-[22px] font-semibold leading-snug text-foreground">
        {text}
      </p>
    </div>
  );
}

export function Explanation({ text, t }: { text: string; t: T }) {
  return (
    <div className="flex items-start gap-3.5 rounded-[var(--radius-md)] bg-info-soft p-5">
      <span className="flex-shrink-0 text-[22px]">💡</span>
      <div>
        <p className="mb-1 text-[13px] font-semibold text-info">
          {t("explanation")}
        </p>
        <p className="text-sm leading-relaxed text-foreground">{text}</p>
      </div>
    </div>
  );
}
