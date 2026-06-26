// Forme sérialisable d'une catégorie pour les composants client.
export interface CategoryListItem {
  id: number;
  name: string;
  slug: string;
  coverEmoji: string | null;
  sortOrder: number;
  deckCount: number;
}
