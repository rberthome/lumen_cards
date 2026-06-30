// Répétition espacée à paliers fixes (réf. PROJECT.md §3). Pur et testable.

// Intervalles en jours par palier : 1 → 3 → 7 → 21 → 60.
export const INTERVAL_DAYS = [1, 3, 7, 21, 60] as const;
export const MAX_LEVEL = INTERVAL_DAYS.length - 1;

// En dessous de ce nombre de réussites, la carte est présentée en QCM (si elle a des choix).
export const MODE_THRESHOLD = 3;

const DAY_MS = 24 * 60 * 60 * 1000;

export interface ScheduleState {
  level: number;
  successCount: number;
  nextReviewAt: Date;
}

export function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * DAY_MS);
}

/**
 * Calcule le prochain état d'une carte après une réponse.
 * - Réussite : on programme l'intervalle du palier courant, puis on monte d'un palier (plafonné).
 * - Échec : retour au palier 0, due immédiatement (successCount conservé).
 */
export function nextSchedule(
  prev: { level: number; successCount: number },
  knew: boolean,
  now: Date = new Date(),
): ScheduleState {
  if (!knew) {
    return { level: 0, successCount: prev.successCount, nextReviewAt: now };
  }
  const interval = INTERVAL_DAYS[Math.min(prev.level, MAX_LEVEL)];
  return {
    level: Math.min(prev.level + 1, MAX_LEVEL),
    successCount: prev.successCount + 1,
    nextReviewAt: addDays(now, interval),
  };
}

export type ReviewMode = "qcm" | "free";

// QCM tant que la carte a des choix et que les réussites sont sous le seuil ; sinon réponse libre.
export function reviewMode(
  successCount: number,
  hasChoices: boolean,
): ReviewMode {
  if (!hasChoices) return "free";
  return successCount < MODE_THRESHOLD ? "qcm" : "free";
}

// Une carte jamais révisée (pas de date) est due ; sinon due si l'échéance est passée.
export function isDue(
  nextReviewAt: Date | null,
  now: Date = new Date(),
): boolean {
  if (!nextReviewAt) return true;
  return nextReviewAt.getTime() <= now.getTime();
}

export const XP_CORRECT = 10;
export const XP_INCORRECT = 3;

const dayNumber = (d: Date) =>
  Math.floor(
    new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime() / DAY_MS,
  );

// Série quotidienne : +1 si la dernière révision était hier, inchangée si déjà
// aujourd'hui, sinon repart à 1.
export function computeStreak(
  lastReviewAt: Date | null,
  currentStreak: number,
  now: Date = new Date(),
): number {
  if (!lastReviewAt) return 1;
  const diff = dayNumber(now) - dayNumber(lastReviewAt);
  if (diff <= 0) return Math.max(currentStreak, 1);
  if (diff === 1) return currentStreak + 1;
  return 1;
}
