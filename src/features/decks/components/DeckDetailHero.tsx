import { getTranslations } from "next-intl/server";
import { Card } from "@/design-system";
import type { DeckDetail } from "../learnerRepository";

// En-tête du deck : icône, description et compteurs (total / dues / acquises / nouvelles).
export async function DeckDetailHero({ deck }: { deck: DeckDetail }) {
  const t = await getTranslations("study");
  const td = await getTranslations("decks");

  const stats = [
    { value: deck.total, label: td("colCards"), tone: "text-foreground" },
    { value: deck.due, label: t("incorrectLabel"), tone: "text-accent-strong" },
    { value: deck.known, label: t("correctLabel"), tone: "text-correct" },
    { value: deck.newCards, label: t("newLabel"), tone: "text-muted" },
  ];

  return (
    <Card padding="lg" className="flex items-start gap-5">
      <span className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-[var(--radius-lg)] bg-info-soft text-3xl">
        {deck.coverEmoji ?? "📚"}
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <h1 className="font-serif text-[22px] font-semibold text-foreground">
          {deck.title}
        </h1>
        {deck.description && (
          <p className="mb-3 text-sm leading-relaxed text-muted">
            {deck.description}
          </p>
        )}
        <div className="flex flex-wrap gap-3">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-[var(--radius-md)] border border-line bg-surface-2 px-4 py-2.5 text-center"
            >
              <div className={`font-serif text-xl font-semibold ${s.tone}`}>
                {s.value}
              </div>
              <div className="mt-0.5 text-[11px] text-muted">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
