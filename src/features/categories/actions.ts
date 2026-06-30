"use server";

import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/features/auth";
import { slugify } from "@/shared/utils/slugify";
import { categoryFormSchema, type CategoryFormInput } from "./schema";

export interface CategoryActionResult {
  error?: string;
}

async function err(key?: string): Promise<CategoryActionResult> {
  const t = await getTranslations("errors");
  return { error: t(key ?? "invalid") };
}

async function uniqueSlug(name: string, excludeId?: number): Promise<string> {
  const base = slugify(name) || "categorie";
  let slug = base;
  let i = 2;
  // Boucle bornée par le nombre de collisions existantes.
  for (;;) {
    const existing = await db.category.findUnique({ where: { slug } });
    if (!existing || existing.id === excludeId) return slug;
    slug = `${base}-${i++}`;
  }
}

export async function createCategory(
  input: CategoryFormInput,
): Promise<CategoryActionResult> {
  await requireAdmin();
  const parsed = categoryFormSchema.safeParse(input);
  if (!parsed.success) {
    return err(parsed.error.issues[0]?.message);
  }
  const { name, coverEmoji, sortOrder } = parsed.data;
  await db.category.create({
    data: {
      name,
      slug: await uniqueSlug(name),
      coverEmoji: coverEmoji || null,
      sortOrder,
    },
  });
  revalidatePath("/admin/categories");
  return {};
}

export async function updateCategory(
  id: number,
  input: CategoryFormInput,
): Promise<CategoryActionResult> {
  await requireAdmin();
  const parsed = categoryFormSchema.safeParse(input);
  if (!parsed.success) {
    return err(parsed.error.issues[0]?.message);
  }
  const { name, coverEmoji, sortOrder } = parsed.data;
  await db.category.update({
    where: { id },
    data: {
      name,
      slug: await uniqueSlug(name, id),
      coverEmoji: coverEmoji || null,
      sortOrder,
    },
  });
  revalidatePath("/admin/categories");
  return {};
}

export async function deleteCategory(
  id: number,
): Promise<CategoryActionResult> {
  await requireAdmin();
  const deckCount = await db.deck.count({ where: { categoryId: id } });
  if (deckCount > 0) {
    return err("categoryInUse");
  }
  await db.category.delete({ where: { id } });
  revalidatePath("/admin/categories");
  return {};
}
