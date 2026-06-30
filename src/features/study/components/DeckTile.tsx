import Link from "next/link";
import { Badge, Card, Icon } from "@/design-system";
import type { StudyDeck } from "../repository";

// Tuile de deck cliquable menant au détail du deck.
export function DeckTile({
  deck,
  cardsLabel,
  dueLabel,
  doneLabel,
}: {
  deck: StudyDeck;
  cardsLabel: string;
  dueLabel: string;
  doneLabel: string;
}) {
  return (
    <Link href={`/decks/${deck.id}`} className="group block">
      <Card className="flex items-center gap-4 transition-all group-hover:-translate-y-0.5 group-hover:border-accent-line group-hover:shadow-[var(--shadow-md)]">
        <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-info-soft text-2xl">
          {deck.coverEmoji ?? "📚"}
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="truncate font-serif text-[17px] font-semibold text-foreground">
            {deck.title}
          </span>
          <span className="text-[13px] text-muted">{cardsLabel}</span>
        </div>
        {deck.due > 0 ? (
          <Badge variant="free" className="flex-shrink-0 whitespace-nowrap">
            <Icon name="due" size={13} /> {dueLabel}
          </Badge>
        ) : (
          <Badge variant="acquired" className="flex-shrink-0 whitespace-nowrap">
            <Icon name="correct" size={13} /> {doneLabel}
          </Badge>
        )}
      </Card>
    </Link>
  );
}
