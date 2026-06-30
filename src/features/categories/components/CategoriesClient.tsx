"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button, Card } from "@/design-system";
import { CategoryFormModal } from "./CategoryFormModal";
import { deleteCategory } from "../actions";
import type { CategoryListItem } from "../types";

export function CategoriesClient({
  categories,
}: {
  categories: CategoryListItem[];
}) {
  const t = useTranslations("categories");
  const tc = useTranslations("common");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<CategoryListItem | null>(null);
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();

  function onDelete(cat: CategoryListItem) {
    setError(undefined);
    if (!confirm(t("deleteConfirm", { name: cat.name }))) return;
    startTransition(async () => {
      const res = await deleteCategory(cat.id);
      if (res.error) setError(res.error);
      else router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-foreground">
            {t("title")}
          </h1>
          <p className="mt-0.5 text-sm text-muted">
            {t("colDecks")} · {categories.length}
          </p>
        </div>
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

      {categories.length === 0 ? (
        <Card padding="lg" elevation="sm">
          <p className="text-center text-sm text-muted">{t("empty")}</p>
        </Card>
      ) : (
        <div className="flex flex-col gap-2">
          {categories.map((c) => (
            <Card
              key={c.id}
              padding="sm"
              elevation="sm"
              className="flex items-center gap-4"
            >
              <span className="text-2xl">{c.coverEmoji ?? "📂"}</span>
              <div className="min-w-0 flex-1">
                <div className="truncate font-semibold text-foreground">
                  {c.name}
                </div>
                <div className="text-xs text-muted">
                  {c.slug} · {t("colDecks")} {c.deckCount} · {tc("order")}{" "}
                  {c.sortOrder}
                </div>
              </div>
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
            </Card>
          ))}
        </div>
      )}

      {open && (
        <CategoryFormModal editing={editing} onClose={() => setOpen(false)} />
      )}
    </div>
  );
}
