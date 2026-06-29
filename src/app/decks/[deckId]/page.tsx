import { redirect, notFound } from "next/navigation";
import { getSession } from "@/features/auth";
import { getDeckDetail } from "@/features/decks/learnerRepository";
import { DeckDetailView } from "@/features/decks/components/DeckDetailView";

export default async function DeckDetailPage({
  params,
}: {
  params: Promise<{ deckId: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { deckId } = await params;
  const id = Number(deckId);
  if (!Number.isInteger(id)) notFound();

  const deck = await getDeckDetail(session.userId, id);
  if (!deck) notFound();

  return <DeckDetailView deck={deck} />;
}
