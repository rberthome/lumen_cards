"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/features/auth";
import { deckFormSchema, type DeckFormInput } from "./schema";

export interface DeckActionResult {
  error?: string;
}

function clean(input: DeckFormInput) {
  return {
    title: input.title,
    description: input.description?.trim() || null,
    categoryId: input.categoryId,
    coverEmoji: input.coverEmoji?.trim() || null,
    isPublished: input.isPublished,
  };
}

export async function createDeck(
  input: DeckFormInput,
): Promise<DeckActionResult> {
  await requireAdmin();
  const parsed = deckFormSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Saisie invalide" };
  }
  await db.deck.create({ data: clean(parsed.data) });
  revalidatePath("/admin/decks");
  return {};
}

export async function updateDeck(
  id: number,
  input: DeckFormInput,
): Promise<DeckActionResult> {
  await requireAdmin();
  const parsed = deckFormSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Saisie invalide" };
  }
  await db.deck.update({ where: { id }, data: clean(parsed.data) });
  revalidatePath("/admin/decks");
  return {};
}

export async function deleteDeck(id: number): Promise<DeckActionResult> {
  await requireAdmin();
  await db.deck.delete({ where: { id } });
  revalidatePath("/admin/decks");
  return {};
}

// Bascule rapide publié / brouillon depuis la liste.
export async function toggleDeckPublished(
  id: number,
  isPublished: boolean,
): Promise<DeckActionResult> {
  await requireAdmin();
  await db.deck.update({ where: { id }, data: { isPublished } });
  revalidatePath("/admin/decks");
  return {};
}
