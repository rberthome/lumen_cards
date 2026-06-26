"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/design-system";
import { CategoryFormModal } from "./CategoryFormModal";
import { deleteCategory } from "../actions";
import type { CategoryListItem } from "../types";

const th = "px-4 py-3 font-medium";
const td = "px-4 py-3";

export function CategoriesClient({
  categories,
}: {
  categories: CategoryListItem[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<CategoryListItem | null>(null);
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();

  function onDelete(cat: CategoryListItem) {
    setError(undefined);
    if (!confirm(`Supprimer la catégorie « ${cat.name} » ?`)) return;
    startTransition(async () => {
      const res = await deleteCategory(cat.id);
      if (res.error) setError(res.error);
      else router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-semibold text-neutral-900">
          Catégories
        </h1>
        <Button
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
        >
          Nouvelle catégorie
        </Button>
      </div>

      {error && <p className="text-sm text-error">{error}</p>}

      <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-neutral-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-neutral-200 text-neutral-500">
            <tr>
              <th className={th}>Catégorie</th>
              <th className={th}>Slug</th>
              <th className={th}>Decks</th>
              <th className={th}>Ordre</th>
              <th className={th} aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td
                  className="px-4 py-10 text-center text-neutral-400"
                  colSpan={5}
                >
                  Aucune catégorie pour l’instant.
                </td>
              </tr>
            ) : (
              categories.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-neutral-100 last:border-0"
                >
                  <td className={td}>
                    <span className="mr-2">{c.coverEmoji ?? "—"}</span>
                    <span className="font-medium text-neutral-900">
                      {c.name}
                    </span>
                  </td>
                  <td className={`${td} text-neutral-500`}>{c.slug}</td>
                  <td className={`${td} text-neutral-500`}>{c.deckCount}</td>
                  <td className={`${td} text-neutral-500`}>{c.sortOrder}</td>
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
        <CategoryFormModal editing={editing} onClose={() => setOpen(false)} />
      )}
    </div>
  );
}
