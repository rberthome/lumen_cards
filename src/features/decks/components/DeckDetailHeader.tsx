import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Icon } from "@/design-system";
import type { DeckDetail } from "../learnerRepository";

// En-tête sticky avec retour à l'accueil, titre du deck et catégorie.
export async function DeckDetailHeader({ deck }: { deck: DeckDetail }) {
  const t = await getTranslations("common");

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-surface">
      <div className="mx-auto flex max-w-3xl items-center gap-3.5 px-6 py-3">
        <Link
          href="/"
          aria-label={t("back")}
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[var(--radius-md)] border border-line bg-background text-foreground transition-colors hover:bg-surface-2"
        >
          <Icon name="back" size={20} />
        </Link>
        <div className="min-w-0 flex-1">
          <div className="truncate font-serif text-lg font-semibold text-foreground">
            {deck.title}
          </div>
          <div className="text-[13px] text-muted">{deck.categoryName}</div>
        </div>
      </div>
    </header>
  );
}
