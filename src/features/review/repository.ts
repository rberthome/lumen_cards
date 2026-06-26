import "server-only";
import { db } from "@/lib/db";
import { isDue } from "./scheduler";

export interface DueCard {
  id: number;
  deckId: number;
  front: string;
  back: string;
  explanation: string | null;
  wrongAnswer1: string | null;
  wrongAnswer2: string | null;
  wrongAnswer3: string | null;
  source: string | null;
  level: number;
  successCount: number;
}

// Cartes dues pour un utilisateur : decks publiés uniquement, échéance passée ou jamais révisées.
export async function getDueCards(
  userId: number,
  deckId?: number,
): Promise<DueCard[]> {
  const cards = await db.card.findMany({
    where: {
      deck: { isPublished: true, ...(deckId ? { id: deckId } : {}) },
    },
    include: { progress: { where: { userId }, take: 1 } },
    orderBy: { id: "asc" },
  });

  const now = new Date();
  return cards
    .filter((c) => isDue(c.progress[0]?.nextReviewAt ?? null, now))
    .map((c) => ({
      id: c.id,
      deckId: c.deckId,
      front: c.front,
      back: c.back,
      explanation: c.explanation,
      wrongAnswer1: c.wrongAnswer1,
      wrongAnswer2: c.wrongAnswer2,
      wrongAnswer3: c.wrongAnswer3,
      source: c.source,
      level: c.progress[0]?.level ?? 0,
      successCount: c.progress[0]?.successCount ?? 0,
    }));
}

// Nombre de cartes dues par deck publié (pour les pastilles « X cartes dues »).
export async function countDueByDeck(
  userId: number,
): Promise<Map<number, number>> {
  const due = await getDueCards(userId);
  const counts = new Map<number, number>();
  for (const c of due) counts.set(c.deckId, (counts.get(c.deckId) ?? 0) + 1);
  return counts;
}
