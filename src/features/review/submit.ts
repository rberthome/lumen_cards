"use server";

import { getSession } from "@/features/auth";
import { db } from "@/lib/db";
import {
  nextSchedule,
  computeStreak,
  XP_CORRECT,
  XP_INCORRECT,
} from "./scheduler";

export interface RecordResult {
  xp: number;
  streakDays: number;
}

// Met à jour le palier d'une carte selon la première tentative ; renvoie l'XP gagné.
async function applyCard(
  userId: number,
  cardId: number,
  knew: boolean,
  now: Date,
): Promise<number> {
  const prev = await db.cardProgress.findUnique({
    where: { userId_cardId: { userId, cardId } },
  });
  const s = nextSchedule(
    { level: prev?.level ?? 0, successCount: prev?.successCount ?? 0 },
    knew,
    now,
  );
  const data = {
    level: s.level,
    successCount: s.successCount,
    nextReviewAt: s.nextReviewAt,
    lastReviewedAt: now,
  };
  await db.cardProgress.upsert({
    where: { userId_cardId: { userId, cardId } },
    create: { userId, cardId, ...data },
    update: data,
  });
  return knew ? XP_CORRECT : XP_INCORRECT;
}

// Enregistre la première tentative d'une carte (palier + XP + streak).
// Appelé carte par carte → quitter en cours conserve la progression déjà répondue.
export async function recordResult(
  cardId: number,
  knew: boolean,
): Promise<RecordResult> {
  const session = await getSession();
  if (!session) throw new Error("unauthenticated");
  const userId = session.userId;
  const now = new Date();

  const xp = await applyCard(userId, cardId, knew, now);

  const user = await db.user.findUnique({ where: { id: userId } });
  const streakDays = computeStreak(
    user?.lastReviewAt ?? null,
    user?.streakDays ?? 0,
    now,
  );
  await db.user.update({
    where: { id: userId },
    data: { xp: { increment: xp }, streakDays, lastReviewAt: now },
  });

  return { xp, streakDays };
}
