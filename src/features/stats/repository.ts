import "server-only";
import { db } from "@/lib/db";
import { getDueCards } from "@/features/review/repository";
import { MODE_THRESHOLD } from "@/features/review/scheduler";

export interface LearnerStats {
  streakDays: number;
  xp: number;
  mastered: number;
  due: number;
}

export async function getLearnerStats(userId: number): Promise<LearnerStats> {
  const [user, mastered, due] = await Promise.all([
    db.user.findUnique({
      where: { id: userId },
      select: { streakDays: true, xp: true },
    }),
    db.cardProgress.count({
      where: { userId, successCount: { gte: MODE_THRESHOLD } },
    }),
    getDueCards(userId).then((c) => c.length),
  ]);

  return {
    streakDays: user?.streakDays ?? 0,
    xp: user?.xp ?? 0,
    mastered,
    due,
  };
}
