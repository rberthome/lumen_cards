"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Modal, Input, Textarea, Button } from "@/design-system";
import { createCard, updateCard } from "../actions";
import type { CardListItem } from "../types";

const EMPTY = {
  front: "",
  back: "",
  explanation: "",
  wrongAnswer1: "",
  wrongAnswer2: "",
  wrongAnswer3: "",
  source: "",
};

function initialForm(editing: CardListItem | null) {
  if (!editing) return { ...EMPTY };
  return {
    front: editing.front,
    back: editing.back,
    explanation: editing.explanation ?? "",
    wrongAnswer1: editing.wrongAnswer1 ?? "",
    wrongAnswer2: editing.wrongAnswer2 ?? "",
    wrongAnswer3: editing.wrongAnswer3 ?? "",
    source: editing.source ?? "",
  };
}

export function CardFormModal({
  deckId,
  editing,
  onClose,
}: {
  deckId: number;
  editing: CardListItem | null;
  onClose: () => void;
}) {
  const t = useTranslations("cards");
  const tc = useTranslations("common");
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [form, setForm] = useState(() => initialForm(editing));
  const [error, setError] = useState<string>();

  type Field = keyof ReturnType<typeof initialForm>;
  function set(field: Field, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const res = editing
        ? await updateCard(editing.id, deckId, form)
        : await createCard(deckId, form);
      if (res.error) {
        setError(res.error);
        return;
      }
      onClose();
      router.refresh();
    });
  }

  return (
    <Modal open onClose={onClose} title={editing ? t("edit") : t("new")}>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <Input
          label={t("fieldFront")}
          value={form.front}
          onChange={(e) => set("front", e.target.value)}
          required
        />
        <Textarea
          label={t("fieldBack")}
          rows={2}
          value={form.back}
          onChange={(e) => set("back", e.target.value)}
          required
        />
        <Textarea
          label={t("fieldExplanation")}
          rows={3}
          value={form.explanation}
          onChange={(e) => set("explanation", e.target.value)}
        />
        <div className="rounded-[var(--radius-md)] bg-neutral-50 p-3">
          <p className="mb-2 text-xs text-neutral-500">{t("wrongHint")}</p>
          <div className="flex flex-col gap-2">
            <Input
              value={form.wrongAnswer1}
              onChange={(e) => set("wrongAnswer1", e.target.value)}
              placeholder={t("wrongPlaceholder", { n: 1 })}
            />
            <Input
              value={form.wrongAnswer2}
              onChange={(e) => set("wrongAnswer2", e.target.value)}
              placeholder={t("wrongPlaceholder", { n: 2 })}
            />
            <Input
              value={form.wrongAnswer3}
              onChange={(e) => set("wrongAnswer3", e.target.value)}
              placeholder={t("wrongPlaceholder", { n: 3 })}
            />
          </div>
        </div>
        <Input
          label={t("fieldSource")}
          value={form.source}
          onChange={(e) => set("source", e.target.value)}
        />
        {error && <p className="text-sm text-error">{error}</p>}
        <div className="mt-1 flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            {tc("cancel")}
          </Button>
          <Button type="submit" disabled={pending}>
            {pending ? tc("saving") : tc("save")}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
