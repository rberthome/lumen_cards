// AUTO-GENERATED — do not edit manually.
// Source: apps/api PHP DTOs annotated with #[TypeScript]
// Regenerate: npm run types:generate (from monorepo root)

export type DeckCategory = 'philosophy' | 'kabbalah' | 'masonic' | 'spiritual' | 'kant' | 'custom';
export type CardDifficulty = 'easy' | 'medium' | 'hard';
export type UserLevel = 'apprentice' | 'companion' | 'master' | 'grand_master';

export interface DeckDto {
  id: number;
  user_id: number | null;
  title: string;
  description: string | null;
  category: DeckCategory;
  card_count: number;
  due_today: number;
  cover_emoji: string | null;
  created_at: string;
}

export interface CardDto {
  id: number;
  deck_id: number;
  front: string;
  back: string;
  wrong_answer_1: string | null;
  wrong_answer_2: string | null;
  wrong_answer_3: string | null;
  explanation: string | null;
  source: string | null;
  tags: string[];
  difficulty: CardDifficulty;
}

export interface CardWithProgressDto extends CardDto {
  interval: number;
  repetition: number;
  ease_factor: number;
  next_review_at: string | null;
  show_choices: boolean;
}

export interface ReviewSessionDto {
  id: number;
  deck_id: number | null;
  cards: CardWithProgressDto[];
  session_size: number;
}

export interface SubmitReviewItemDto {
  card_id: number;
  knew: boolean;
  time_spent_ms: number;
}

export interface ReviewResultDto {
  xp_earned: number;
  accuracy: number;
  cards_reviewed: number;
  duration_ms: number;
  streak_days: number;
  level: UserLevel;
}

export interface UserStatDto {
  total_cards: number;
  mastered: number;
  in_progress: number;
  accuracy: number;
  streak_days: number;
  total_time_ms: number;
  level: UserLevel;
  xp: number;
  xp_to_next_level: number;
}
