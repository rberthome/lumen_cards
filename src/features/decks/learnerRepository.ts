import "server-only";
import { db } from "@/lib/db";
import { isDue, MODE_THRESHOLD } from "@/features/review/scheduler";

export type DeckCardStatus = "due" | "known" | "new";

export interface DeckDetailCard {
  id: number;
  front: string;
  status: DeckCardStatus;
  level: number;
}

export interface DeckDetail {
  id: number;
  title: string;
  description: string | null;
  coverEmoji: string | null;
  categoryName: string;
  total: number;
  due: number;
  known: number;
  newCards: number;
  cards: DeckDetailCard[];
}

function statusOf(
  progress: { successCount: number; nextReviewAt: Date } | undefined,
  now: Date,
): DeckCardStatus {
  if (!progress) return "new";
  if (isDue(progress.nextReviewAt, now)) return "due";
  if (progress.successCount >= MODE_THRESHOLD) return "known";
  return "new";
}

// Détail d'un deck côté apprenant : decks publiés uniquement.
export async function getDeckDetail(
  userId: number,
  deckId: number,
): Promise<DeckDetail | null> {
  const deck = await db.deck.findFirst({
    where: { id: deckId, isPublished: true },
    include: {
      category: { select: { name: true } },
      cards: {
        orderBy: { id: "asc" },
        include: { progress: { where: { userId }, take: 1 } },
      },
    },
  });
  if (!deck) return null;

  const now = new Date();
  let due = 0;
  let known = 0;
  let newCards = 0;
  const cards: DeckDetailCard[] = deck.cards.map((c) => {
    const p = c.progress[0];
    const status = statusOf(p, now);
    if (status === "due") due += 1;
    else if (status === "known") known += 1;
    else newCards += 1;
    return { id: c.id, front: c.front, status, level: p?.level ?? 0 };
  });

  return {
    id: deck.id,
    title: deck.title,
    description: deck.description,
    coverEmoji: deck.coverEmoji,
    categoryName: deck.category.name,
    total: deck.cards.length,
    due,
    known,
    newCards,
    cards,
  };
}
