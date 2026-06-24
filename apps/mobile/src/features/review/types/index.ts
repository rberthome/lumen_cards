import type { CardWithProgressDto, ReviewResultDto, ReviewSessionDto } from '@lumen_cards/types';

export type SessionSize = 5 | 10 | 20 | 'all';

export interface ReviewSessionCard extends CardWithProgressDto {
  attempts: number;
}

export interface SessionProgress {
  total: number;
  current: number;
  correct: number;
  incorrect: number;
}

export type { ReviewSessionDto, ReviewResultDto, CardWithProgressDto };
