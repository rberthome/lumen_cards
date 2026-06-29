"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button, Card, Badge } from "@/design-system";
import { CardFormModal } from "./CardFormModal";
import { deleteCard } from "../actions";
import type { CardListItem } from "../types";

const th =
  "px-4 py-3 text-xs font-semibold uppercase tracking-[0.06em] text-muted";
const td = "px-4 py-3 align-top";

function excerpt(text: string, max = 80) {
  return text.length > max ? `${text.slice(0, max)}…` : text;
}

export function CardsClient({
  deckId,
  deckTitle,
  cards,
}: {
  deckId: number;
  deckTitle: string;
  cards: CardListItem[];
}) {
  const t = useTranslations("cards");
  const tc = useTranslations("common");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<CardListItem | null>(null);
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();

  function onDelete(card: CardListItem) {
    setError(undefined);
    if (!confirm(t("deleteConfirm"))) return;
    startTransition(async () => {
      const res = await deleteCard(card.id, deckId);
      if (res.error) setError(res.error);
      else router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          href="/admin/decks"
          className="text-sm text-muted transition-colors hover:text-foreground"
        >
          {t("backToDecks")}
        </Link>
      </div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-semibold text-foreground">
          {t("title", { deck: deckTitle })}
        </h1>
        <Button
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
        >
          {t("new")}
        </Button>
      </div>

      {error && <p className="text-sm text-incorrect">{error}</p>}

      <Card padding="none" elevation="sm" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line bg-surface-2">
              <tr>
                <th className={th}>{t("colFront")}</th>
                <th className={th}>{t("colBack")}</th>
                <th className={th}>{t("colMode")}</th>
                <th className={th} aria-label={tc("actions")} />
              </tr>
            </thead>
            <tbody>
              {cards.length === 0 ? (
                <tr>
                  <td className="px-4 py-10 text-center text-muted" colSpan={4}>
                    {t("empty")}
                  </td>
                </tr>
              ) : (
                cards.map((c) => (
                  <tr key={c.id} className="border-b border-line last:border-0">
                    <td
                      className={`${td} font-serif font-medium text-foreground`}
                    >
                      {excerpt(c.front)}
                    </td>
                    <td className={`${td} text-muted`}>{excerpt(c.back)}</td>
                    <td className={td}>
                      <Badge variant={c.wrongAnswer1 ? "qcm" : "free"}>
                        {c.wrongAnswer1 ? t("qcm") : t("free")}
                      </Badge>
                    </td>
                    <td className={td}>
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setEditing(c);
                            setOpen(true);
                          }}
                        >
                          {tc("edit")}
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          disabled={pending}
                          onClick={() => onDelete(c)}
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
        <CardFormModal
          deckId={deckId}
          editing={editing}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}
