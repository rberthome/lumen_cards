"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { DeckCardStatus, DeckDetailCard } from "../learnerRepository";

type Filter = "all" | DeckCardStatus;

const DOT: Record<DeckCardStatus, string> = {
  due: "bg-accent",
  known: "bg-correct",
  new: "bg-muted",
};

export function DeckCardList({ cards }: { cards: DeckDetailCard[] }) {
  const t = useTranslations("study");
  const [active, setActive] = useState<Filter>("all");

  const statusLabel: Record<DeckCardStatus, string> = {
    due: t("incorrectLabel"),
    known: t("correctLabel"),
    new: t("newLabel"),
  };
  const filters: { id: Filter; label: string }[] = [
    { id: "all", label: t("filterAll") },
    { id: "due", label: t("incorrectLabel") },
    { id: "known", label: t("correctLabel") },
    { id: "new", label: t("newLabel") },
  ];

  const visible =
    active === "all" ? cards : cards.filter((c) => c.status === active);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        {filters.map((f) => {
          const on = f.id === active;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => setActive(f.id)}
              className={`rounded-full border px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${
                on
                  ? "border-foreground bg-foreground text-background"
                  : "border-line bg-surface text-muted hover:bg-surface-2"
              }`}
            >
              {f.label}
            </button>
          );
        })}
        <span className="ml-auto text-[13px] text-muted">
          {t("progress", { current: visible.length, total: cards.length })}
        </span>
      </div>

      <ul className="flex flex-col gap-2.5">
        {visible.map((card) => (
          <li
            key={card.id}
            className="flex items-start gap-3.5 rounded-[var(--radius-lg)] border border-line bg-surface p-[18px]"
          >
            <span
              className={`mt-1.5 h-2.5 w-2.5 flex-shrink-0 rounded-full ${DOT[card.status]}`}
              aria-hidden
            />
            <div className="min-w-0 flex-1">
              <p className="font-serif text-[15px] font-semibold leading-snug text-foreground">
                {card.front}
              </p>
              <p className="text-[13px] text-muted">
                {statusLabel[card.status]}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
