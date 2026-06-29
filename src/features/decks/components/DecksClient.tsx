"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button, Card, Badge } from "@/design-system";
import { DeckFormModal } from "./DeckFormModal";
import { deleteDeck, toggleDeckPublished } from "../actions";
import type { DeckListItem, CategoryOption } from "../types";

const th =
  "px-4 py-3 text-xs font-semibold uppercase tracking-[0.06em] text-muted";
const td = "px-4 py-3";

export function DecksClient({
  decks,
  categories,
}: {
  decks: DeckListItem[];
  categories: CategoryOption[];
}) {
  const t = useTranslations("decks");
  const tc = useTranslations("common");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<DeckListItem | null>(null);
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();

  function run(fn: () => Promise<{ error?: string }>) {
    setError(undefined);
    startTransition(async () => {
      const res = await fn();
      if (res.error) setError(res.error);
      else router.refresh();
    });
  }

  function onDelete(deck: DeckListItem) {
    if (
      !confirm(t("deleteConfirm", { title: deck.title, count: deck.cardCount }))
    )
      return;
    run(() => deleteDeck(deck.id));
  }

  const noCategories = categories.length === 0;
  const totalCards = decks.reduce((a, d) => a + d.cardCount, 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-foreground">
            {t("title")}
          </h1>
          <p className="mt-0.5 text-sm text-muted">
            {decks.length} · {totalCards} {t("colCards").toLowerCase()}
          </p>
        </div>
        <Button
          disabled={noCategories}
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
        >
          {t("new")}
        </Button>
      </div>

      {noCategories && (
        <p className="text-sm text-muted">{t("needCategory")}</p>
      )}
      {error && <p className="text-sm text-incorrect">{error}</p>}

      <Card padding="none" elevation="sm" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line bg-surface-2">
              <tr>
                <th className={th}>{t("colDeck")}</th>
                <th className={th}>{t("colCategory")}</th>
                <th className={th}>{t("colCards")}</th>
                <th className={th}>{t("colStatus")}</th>
                <th className={th} aria-label={tc("actions")} />
              </tr>
            </thead>
            <tbody>
              {decks.length === 0 ? (
                <tr>
                  <td className="px-4 py-10 text-center text-muted" colSpan={5}>
                    {t("empty")}
                  </td>
                </tr>
              ) : (
                decks.map((d) => (
                  <tr key={d.id} className="border-b border-line last:border-0">
                    <td className={td}>
                      <span className="mr-2">{d.coverEmoji ?? "📚"}</span>
                      <span className="font-medium text-foreground">
                        {d.title}
                      </span>
                    </td>
                    <td className={`${td} text-muted`}>{d.categoryName}</td>
                    <td className={`${td} text-muted`}>{d.cardCount}</td>
                    <td className={td}>
                      <button
                        type="button"
                        disabled={pending}
                        onClick={() =>
                          run(() => toggleDeckPublished(d.id, !d.isPublished))
                        }
                      >
                        <Badge variant={d.isPublished ? "acquired" : "neutral"}>
                          {d.isPublished ? t("published") : t("draft")}
                        </Badge>
                      </button>
                    </td>
                    <td className={td}>
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() =>
                            router.push(`/admin/decks/${d.id}/cards`)
                          }
                        >
                          {t("cardsButton", { count: d.cardCount })}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setEditing(d);
                            setOpen(true);
                          }}
                        >
                          {tc("edit")}
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          disabled={pending}
                          onClick={() => onDelete(d)}
                        >
                          {tc("delete")}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {open && (
        <DeckFormModal
          editing={editing}
          categories={categories}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}
