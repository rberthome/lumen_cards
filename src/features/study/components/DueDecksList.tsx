import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { db } from "@/lib/db";
import { countDueByDeck } from "@/features/review";

export async function DueDecksList({ userId }: { userId: number }) {
  const t = await getTranslations("study");
  const [decks, dueMap] = await Promise.all([
    db.deck.findMany({
      where: { isPublished: true },
      orderBy: [{ category: { sortOrder: "asc" } }, { title: "asc" }],
      include: { category: { select: { name: true } } },
    }),
    countDueByDeck(userId),
  ]);
  const total = [...dueMap.values()].reduce((a, b) => a + b, 0);

  return (
    <div className="flex flex-col gap-8">
      {total > 0 ? (
        <Link
          href="/review"
          className="flex items-center justify-center rounded-[var(--radius-lg)] bg-gold-600 px-6 py-5 text-center text-lg font-semibold text-white shadow-[0_2px_8px_rgba(217,119,6,.30)] transition-all hover:-translate-y-px hover:bg-gold-700"
        >
          {t("reviewDue", { count: total })}
        </Link>
      ) : (
        <div className="flex flex-col items-center gap-2 rounded-[var(--radius-lg)] border border-neutral-200 bg-white py-8">
          <p className="font-serif text-lg text-neutral-900">{t("upToDate")}</p>
          <Link
            href="/review"
            className="text-sm font-medium text-indigo-600 hover:underline"
          >
            {t("reviewAhead")}
          </Link>
        </div>
      )}

      {decks.length === 0 ? (
        <p className="text-center text-sm text-neutral-400">{t("noDecks")}</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {decks.map((d) => {
            const due = dueMap.get(d.id) ?? 0;
            return (
              <Link
                key={d.id}
                href={`/review/${d.id}`}
                className="flex items-start gap-4 rounded-[var(--radius-lg)] border border-neutral-200 bg-white p-5 shadow-[var(--shadow-sm)] transition-all hover:-translate-y-0.5 hover:border-gold-200 hover:shadow-[var(--shadow-md)]"
              >
                <span className="text-2xl">{d.coverEmoji ?? "📚"}</span>
                <div className="flex flex-1 flex-col gap-1.5">
                  <span className="font-serif text-lg font-semibold text-neutral-900">
                    {d.title}
                  </span>
                  <span className="text-xs text-neutral-400">
                    {d.category.name}
                  </span>
                  {due > 0 ? (
                    <span className="mt-1 inline-flex w-fit items-center rounded-full border border-gold-200 bg-gold-50 px-2.5 py-1 text-xs font-semibold text-gold-700">
                      {t("cardsDue", { count: due })}
                    </span>
                  ) : (
                    <span className="mt-1 inline-flex w-fit items-center rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-semibold text-neutral-500">
                      {t("noDue")}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
