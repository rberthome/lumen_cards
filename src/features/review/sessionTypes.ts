import type { ReviewMode } from "./scheduler";

export interface SessionCard {
  id: number;
  front: string;
  back: string;
  explanation: string | null;
  mode: ReviewMode;
  choices: string[]; // mélangées, pour le QCM (vide en réponse libre)
}

export interface ReviewResultSummary {
  xpEarned: number;
  streakDays: number;
}
