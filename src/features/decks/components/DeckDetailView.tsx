import Link from "next/link";
import { getTranslations } from "next-intl/server";
import type { DeckDetail } from "../learnerRepository";
import { DeckDetailHeader } from "./DeckDetailHeader";
import { DeckDetailHero } from "./DeckDetailHero";
import { DeckCardList } from "./DeckCardList";

export async function DeckDetailView({ deck }: { deck: DeckDetail }) {
  const t = await getTranslations("study");
  const tc = await getTranslations("cards");

  const reviewLabel =
    deck.due > 0 ? t("reviewDue", { count: deck.due }) : t("reviewAhead");

  return (
    <div className="min-h-screen">
      <DeckDetailHeader deck={deck} />
      <main className="mx-auto flex max-w-3xl flex-col gap-7 px-6 py-7">
        <DeckDetailHero deck={deck} />

        {deck.total === 0 ? (
          <p className="rounded-[var(--radius-lg)] border border-line bg-surface py-10 text-center text-sm text-muted">
            {tc("empty")}
          </p>
        ) : (
          <>
            <Link
              href={`/review/${deck.id}`}
              className="flex w-full items-center justify-center gap-2.5 rounded-[var(--radius-lg)] bg-gold-400 px-4 py-4 text-[15px] font-bold text-[#1a1206] shadow-[var(--shadow-gold)] transition-all hover:-translate-y-px hover:bg-gold-500"
            >
              🃏 {reviewLabel}
            </Link>
            <DeckCardList cards={deck.cards} />
          </>
        )}
      </main>
    </div>
  );
}
