"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Modal, Input, Button } from "@/design-system";
import { createCategory, updateCategory } from "../actions";
import type { CategoryListItem } from "../types";

// Monté uniquement quand le dialogue est ouvert → l'état s'initialise à chaque ouverture.
export function CategoryFormModal({
  editing,
  onClose,
}: {
  editing: CategoryListItem | null;
  onClose: () => void;
}) {
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
    <Modal
      open
      onClose={onClose}
      title={editing ? "Modifier la catégorie" : "Nouvelle catégorie"}
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <Input
          label="Nom"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <div className="flex gap-3">
          <div className="flex-1">
            <Input
              label="Emoji"
              value={coverEmoji}
              onChange={(e) => setCoverEmoji(e.target.value)}
              placeholder="✨"
            />
          </div>
          <div className="w-24">
            <Input
              label="Ordre"
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            />
          </div>
        </div>
        {error && <p className="text-sm text-error">{error}</p>}
        <div className="mt-1 flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" disabled={pending}>
            {pending ? "Enregistrement…" : "Enregistrer"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
