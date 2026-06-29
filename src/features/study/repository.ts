import "server-only";
import { db } from "@/lib/db";
import { countDueByDeck } from "@/features/review";
import { MODE_THRESHOLD } from "@/features/review/scheduler";

export interface StudyDeck {
  id: number;
  title: string;
  coverEmoji: string | null;
  total: number;
  due: number;
}

export interface StudyCategory {
  id: number;
  name: string;
  total: number;
  decks: StudyDeck[];
}

export interface StudyOverview {
  categories: StudyCategory[];
  dueTotal: number;
  masteredTotal: number;
  xp: number;
}

// Vue d'accueil apprenant : decks publiés groupés par catégorie + compteurs.
export async function getStudyOverview(userId: number): Promise<StudyOverview> {
  const [decks, dueMap, mastered, user] = await Promise.all([
    db.deck.findMany({
      where: { isPublished: true },
      orderBy: [{ category: { sortOrder: "asc" } }, { title: "asc" }],
      include: {
        category: { select: { id: true, name: true, sortOrder: true } },
        _count: { select: { cards: true } },
      },
    }),
    countDueByDeck(userId),
    db.cardProgress.count({
      where: { userId, successCount: { gte: MODE_THRESHOLD } },
    }),
    db.user.findUnique({ where: { id: userId }, select: { xp: true } }),
  ]);

  const byCategory = new Map<number, StudyCategory>();
  for (const d of decks) {
    const cat = byCategory.get(d.category.id) ?? {
      id: d.category.id,
      name: d.category.name,
      total: 0,
      decks: [],
    };
    const total = d._count.cards;
    cat.total += total;
    cat.decks.push({
      id: d.id,
      title: d.title,
      coverEmoji: d.coverEmoji,
      total,
      due: dueMap.get(d.id) ?? 0,
    });
    byCategory.set(d.category.id, cat);
  }

  const dueTotal = [...dueMap.values()].reduce((a, b) => a + b, 0);
  return {
    categories: [...byCategory.values()],
    dueTotal,
    masteredTotal: mastered,
    xp: user?.xp ?? 0,
  };
}
