"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/design-system";
import { CardFormModal } from "./CardFormModal";
import { deleteCard } from "../actions";
import type { CardListItem } from "../types";

const th = "px-4 py-3 font-medium";
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
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<CardListItem | null>(null);
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();

  function onDelete(card: CardListItem) {
    setError(undefined);
    if (!confirm("Supprimer cette carte ?")) return;
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
          className="text-sm text-neutral-500 hover:text-neutral-800"
        >
          ← Decks
        </Link>
      </div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-semibold text-neutral-900">
          {deckTitle} — cartes
        </h1>
        <Button
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
        >
          Nouvelle carte
        </Button>
      </div>

      {error && <p className="text-sm text-error">{error}</p>}

      <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-neutral-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-neutral-200 text-neutral-500">
            <tr>
              <th className={th}>Recto</th>
              <th className={th}>Verso</th>
              <th className={th}>Mode</th>
              <th className={th} aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {cards.length === 0 ? (
              <tr>
                <td
                  className="px-4 py-10 text-center text-neutral-400"
                  colSpan={4}
                >
                  Aucune carte. Ajoute la première.
                </td>
              </tr>
            ) : (
              cards.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-neutral-100 last:border-0"
                >
                  <td className={`${td} font-medium text-neutral-900`}>
                    {excerpt(c.front)}
                  </td>
                  <td className={`${td} text-neutral-500`}>
                    {excerpt(c.back)}
                  </td>
                  <td className={td}>
                    {c.wrongAnswer1 ? (
                      <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-600">
                        QCM
                      </span>
                    ) : (
                      <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-semibold text-neutral-500">
                        Libre
                      </span>
                    )}
                  </td>
                  <td className={td}>
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          setEditing(c);
                          setOpen(true);
                        }}
                      >
                        Éditer
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={pending}
                        onClick={() => onDelete(c)}
                      >
                        Supprimer
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
        <CardFormModal
          deckId={deckId}
          editing={editing}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}
