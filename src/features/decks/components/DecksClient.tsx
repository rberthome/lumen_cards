"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/design-system";
import { DeckFormModal } from "./DeckFormModal";
import { deleteDeck, toggleDeckPublished } from "../actions";
import type { DeckListItem, CategoryOption } from "../types";

const th = "px-4 py-3 font-medium";
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

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-semibold text-neutral-900">
          {t("title")}
        </h1>
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
        <p className="text-sm text-neutral-500">{t("needCategory")}</p>
      )}
      {error && <p className="text-sm text-error">{error}</p>}

      <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-neutral-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-neutral-200 text-neutral-500">
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
                <td
                  className="px-4 py-10 text-center text-neutral-400"
                  colSpan={5}
                >
                  {t("empty")}
                </td>
              </tr>
            ) : (
              decks.map((d) => (
                <tr
                  key={d.id}
                  className="border-b border-neutral-100 last:border-0"
                >
                  <td className={td}>
                    <span className="mr-2">{d.coverEmoji ?? "📚"}</span>
                    <span className="font-medium text-neutral-900">
                      {d.title}
                    </span>
                  </td>
                  <td className={`${td} text-neutral-500`}>{d.categoryName}</td>
                  <td className={`${td} text-neutral-500`}>{d.cardCount}</td>
                  <td className={td}>
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() =>
                        run(() => toggleDeckPublished(d.id, !d.isPublished))
                      }
                      className={
                        d.isPublished
                          ? "rounded-full bg-[#F0FDF4] px-3 py-1 text-xs font-semibold text-[#15803D]"
                          : "rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-500"
                      }
                    >
                      {d.isPublished ? t("published") : t("draft")}
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
                        variant="secondary"
                        onClick={() => {
                          setEditing(d);
                          setOpen(true);
                        }}
                      >
                        {tc("edit")}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
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
