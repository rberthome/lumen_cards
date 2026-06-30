import { redirect, notFound } from "next/navigation";
import { getSession } from "@/features/auth";
import { getDueCards } from "@/features/review/repository";
import { ReviewSession } from "@/features/review/components/ReviewSession";
import { ReviewEmpty } from "@/features/review/components/ReviewEmpty";

export default async function DeckReviewPage({
  params,
}: {
  params: Promise<{ deckId: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { deckId } = await params;
  const id = Number(deckId);
  if (!Number.isInteger(id)) notFound();

  const cards = await getDueCards(session.userId, id);
  if (cards.length === 0) return <ReviewEmpty />;
  return <ReviewSession cards={cards} />;
}
