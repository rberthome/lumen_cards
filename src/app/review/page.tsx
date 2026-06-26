import { redirect } from "next/navigation";
import { getSession } from "@/features/auth";
import { getDueCards } from "@/features/review/repository";
import { ReviewSession } from "@/features/review/components/ReviewSession";
import { ReviewEmpty } from "@/features/review/components/ReviewEmpty";

export default async function ReviewPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const cards = await getDueCards(session.userId);
  if (cards.length === 0) return <ReviewEmpty />;
  return <ReviewSession cards={cards} />;
}
