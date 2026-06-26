// Formes sérialisables pour les composants client.
export interface DeckListItem {
  id: number;
  title: string;
  description: string | null;
  categoryId: number;
  categoryName: string;
  coverEmoji: string | null;
  isPublished: boolean;
  cardCount: number;
}

export interface CategoryOption {
  id: number;
  name: string;
}
