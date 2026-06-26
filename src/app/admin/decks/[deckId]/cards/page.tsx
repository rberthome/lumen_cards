import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { CardsClient, type CardListItem } from "@/features/cards";

export default async function AdminDeckCardsPage({
  params,
}: {
  params: Promise<{ deckId: string }>;
}) {
  const { deckId } = await params;
  const id = Number(deckId);
  if (!Number.isInteger(id)) notFound();

  const deck = await db.deck.findUnique({
    where: { id },
    include: { cards: { orderBy: { createdAt: "asc" } } },
  });
  if (!deck) notFound();

  const cards: CardListItem[] = deck.cards.map((c) => ({
    id: c.id,
    front: c.front,
    back: c.back,
    explanation: c.explanation,
    wrongAnswer1: c.wrongAnswer1,
    wrongAnswer2: c.wrongAnswer2,
    wrongAnswer3: c.wrongAnswer3,
    source: c.source,
  }));

  return <CardsClient deckId={deck.id} deckTitle={deck.title} cards={cards} />;
}
