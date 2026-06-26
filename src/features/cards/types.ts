// Forme sérialisable d'une carte pour les composants client.
export interface CardListItem {
  id: number;
  front: string;
  back: string;
  explanation: string | null;
  wrongAnswer1: string | null;
  wrongAnswer2: string | null;
  wrongAnswer3: string | null;
  source: string | null;
}
