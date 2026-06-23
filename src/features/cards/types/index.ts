export type DeckCategory = 'philosophy' | 'kabbalah' | 'masonic' | 'spiritual' | 'kant' | 'custom';

export type CardDifficulty = 'easy' | 'medium' | 'hard';

export interface Card {
  id: string;
  deckId: string;
  front: string;
  back: string;
  explanation?: string;
  source?: string;
  tags: string[];
  difficulty: CardDifficulty;
  createdAt: string;
  updatedAt: string;
}

export interface Deck {
  id: string;
  title: string;
  description?: string;
  category: DeckCategory;
  cardCount: number;
  dueToday: number;
  coverEmoji?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CardReview {
  cardId: string;
  knew: boolean;
  reviewedAt: string;
  timeSpentMs: number;
}
