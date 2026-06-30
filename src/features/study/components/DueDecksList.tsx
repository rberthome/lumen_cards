import { getTranslations } from "next-intl/server";
import { getStudyOverview } from "../repository";
import { DueHero } from "./DueHero";
import { DeckTile } from "./DeckTile";
import { StudyStats } from "./StudyStats";

export async function DueDecksList({ userId }: { userId: number }) {
  const t = await getTranslations("study");
  const { categories, dueTotal, masteredTotal, xp } =
    await getStudyOverview(userId);

  return (
    <div className="flex flex-col gap-8">
      <DueHero dueTotal={dueTotal} />

      {categories.length === 0 ? (
        <p className="text-center text-sm text-muted">{t("noDecks")}</p>
      ) : (
        categories.map((cat) => (
          <section key={cat.id} className="flex flex-col gap-3.5">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                {cat.name}
              </h2>
              <span className="text-[13px] text-muted">
                {t("cardsTotal", { count: cat.total })}
              </span>
            </div>
            <div className="flex flex-col gap-3">
              {cat.decks.map((deck) => (
                <DeckTile
                  key={deck.id}
                  deck={deck}
                  cardsLabel={t("cardsTotal", { count: deck.total })}
                  dueLabel={t("cardsDue", { count: deck.due })}
                  doneLabel={t("noDue")}
                />
              ))}
            </div>
          </section>
        ))
      )}

      {categories.length > 0 && (
        <StudyStats mastered={masteredTotal} xp={xp} due={dueTotal} />
      )}
    </div>
  );
}
