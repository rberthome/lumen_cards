export type Level = 'apprentice' | 'companion' | 'master' | 'grand_master';

export interface UserStats {
  totalCards: number;
  mastered: number;
  inProgress: number;
  accuracy: number;
  streakDays: number;
  totalTimeMs: number;
  level: Level;
  xp: number;
  xpToNextLevel: number;
  reviewsByDay: Record<string, number>;
}
