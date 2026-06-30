import { db } from "@/lib/db";
import {
  DecksClient,
  type DeckListItem,
  type CategoryOption,
} from "@/features/decks";

export default async function AdminDecksPage() {
  const [rows, cats] = await Promise.all([
    db.deck.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        category: { select: { name: true } },
        _count: { select: { cards: true } },
      },
    }),
    db.category.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      select: { id: true, name: true },
    }),
  ]);

  const decks: DeckListItem[] = rows.map((d) => ({
    id: d.id,
    title: d.title,
    description: d.description,
    categoryId: d.categoryId,
    categoryName: d.category.name,
    coverEmoji: d.coverEmoji,
    isPublished: d.isPublished,
    cardCount: d._count.cards,
  }));
  const categories: CategoryOption[] = cats;

  return <DecksClient decks={decks} categories={categories} />;
}
