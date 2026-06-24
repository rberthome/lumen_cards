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
