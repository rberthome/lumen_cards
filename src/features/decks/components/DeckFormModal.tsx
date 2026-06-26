"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Modal, Input, Textarea, Select, Button } from "@/design-system";
import { createDeck, updateDeck } from "../actions";
import type { DeckListItem, CategoryOption } from "../types";

function initialForm(editing: DeckListItem | null) {
  return {
    title: editing?.title ?? "",
    description: editing?.description ?? "",
    categoryId: editing ? String(editing.categoryId) : "",
    coverEmoji: editing?.coverEmoji ?? "",
    isPublished: editing?.isPublished ?? false,
  };
}

export function DeckFormModal({
  editing,
  categories,
  onClose,
}: {
  editing: DeckListItem | null;
  categories: CategoryOption[];
  onClose: () => void;
}) {
  const t = useTranslations("decks");
  const tc = useTranslations("common");
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [form, setForm] = useState(() => initialForm(editing));
  const [error, setError] = useState<string>();

  type Field = keyof ReturnType<typeof initialForm>;
  function set<F extends Field>(
    field: F,
    value: ReturnType<typeof initialForm>[F],
  ) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const input = { ...form, categoryId: Number(form.categoryId) };
      const res = editing
        ? await updateDeck(editing.id, input)
        : await createDeck(input);
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
          label={t("fieldTitle")}
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          required
        />
        <div className="flex gap-3">
          <div className="flex-1">
            <Select
              label={t("fieldCategory")}
              value={form.categoryId}
              onChange={(e) => set("categoryId", e.target.value)}
              placeholder={t("choosePlaceholder")}
              options={categories.map((c) => ({ value: c.id, label: c.name }))}
              required
            />
          </div>
          <div className="w-24">
            <Input
              label={tc("emoji")}
              value={form.coverEmoji}
              onChange={(e) => set("coverEmoji", e.target.value)}
              placeholder="📚"
            />
          </div>
        </div>
        <Textarea
          label={t("fieldDescription")}
          rows={3}
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
        />
        <label className="flex items-center gap-2 text-sm text-neutral-700">
          <input
            type="checkbox"
            checked={form.isPublished}
            onChange={(e) => set("isPublished", e.target.checked)}
            className="h-4 w-4 rounded border-neutral-300 text-gold-600 focus:ring-2 focus:ring-gold-400"
          />
          {t("fieldPublished")}
        </label>
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
