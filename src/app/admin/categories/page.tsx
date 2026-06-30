import { db } from "@/lib/db";
import { CategoriesClient, type CategoryListItem } from "@/features/categories";

export default async function AdminCategoriesPage() {
  const rows = await db.category.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: { _count: { select: { decks: true } } },
  });

  const categories: CategoryListItem[] = rows.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    coverEmoji: c.coverEmoji,
    sortOrder: c.sortOrder,
    deckCount: c._count.decks,
  }));

  return <CategoriesClient categories={categories} />;
}
