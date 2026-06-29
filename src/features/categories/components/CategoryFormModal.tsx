"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Modal, Input, Button } from "@/design-system";
import { createCategory, updateCategory } from "../actions";
import type { CategoryListItem } from "../types";

export function CategoryFormModal({
  editing,
  onClose,
}: {
  editing: CategoryListItem | null;
  onClose: () => void;
}) {
  const t = useTranslations("categories");
  const tc = useTranslations("common");
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [name, setName] = useState(editing?.name ?? "");
  const [coverEmoji, setCoverEmoji] = useState(editing?.coverEmoji ?? "");
  const [sortOrder, setSortOrder] = useState(String(editing?.sortOrder ?? 0));
  const [error, setError] = useState<string>();

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const input = { name, coverEmoji, sortOrder: Number(sortOrder) || 0 };
      const res = editing
        ? await updateCategory(editing.id, input)
        : await createCategory(input);
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
          label={t("fieldName")}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <div className="flex gap-3">
          <div className="flex-1">
            <Input
              label={tc("emoji")}
              value={coverEmoji}
              onChange={(e) => setCoverEmoji(e.target.value)}
              placeholder="✨"
            />
          </div>
          <div className="w-24">
            <Input
              label={tc("order")}
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            />
          </div>
        </div>
        {error && <p className="text-sm text-incorrect">{error}</p>}
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
