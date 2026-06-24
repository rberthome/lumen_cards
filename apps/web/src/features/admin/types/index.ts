import type { UserStatDto } from '@lumen_cards/types';

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
  level: string;
  xp: number;
  streak_days: number;
  created_at: string;
  stats?: UserStatDto;
}

export interface AdminStats {
  total_users: number;
  active_today: number;
  total_cards_reviewed: number;
  average_accuracy: number;
}

export interface CategoryDto {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  cover_emoji: string | null;
  sort_order: number;
  deck_count: number;
}

export interface AdminDeckDto {
  id: number;
  category_id: number | null;
  category_name: string | null;
  title: string;
  description: string | null;
  cover_emoji: string | null;
  is_published: boolean;
  card_count: number;
  created_at: string;
}

export interface AdminCardDto {
  id: number;
  deck_id: number;
  deck_title: string;
  front: string;
  back: string;
  wrong_answer_1: string | null;
  wrong_answer_2: string | null;
  wrong_answer_3: string | null;
  explanation: string | null;
  source: string | null;
  tags: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  progression_config: Record<string, unknown>;
  created_at: string;
}

export type Paginated<T> = { data: T[]; total: number; per_page: number };
