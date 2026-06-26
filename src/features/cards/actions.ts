"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/features/auth";
import { cardFormSchema, type CardFormInput } from "./schema";

export interface CardActionResult {
  error?: string;
}

const nz = (s?: string) => s?.trim() || null;

function clean(input: CardFormInput) {
  return {
    front: input.front,
    back: input.back,
    explanation: nz(input.explanation),
    wrongAnswer1: nz(input.wrongAnswer1),
    wrongAnswer2: nz(input.wrongAnswer2),
    wrongAnswer3: nz(input.wrongAnswer3),
    source: nz(input.source),
  };
}

function revalidate(deckId: number) {
  revalidatePath(`/admin/decks/${deckId}/cards`);
}

export async function createCard(
  deckId: number,
  input: CardFormInput,
): Promise<CardActionResult> {
  await requireAdmin();
  const parsed = cardFormSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Saisie invalide" };
  }
  await db.card.create({ data: { deckId, ...clean(parsed.data) } });
  revalidate(deckId);
  return {};
}

export async function updateCard(
  id: number,
  deckId: number,
  input: CardFormInput,
): Promise<CardActionResult> {
  await requireAdmin();
  const parsed = cardFormSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Saisie invalide" };
  }
  await db.card.update({ where: { id }, data: clean(parsed.data) });
  revalidate(deckId);
  return {};
}

export async function deleteCard(
  id: number,
  deckId: number,
): Promise<CardActionResult> {
  await requireAdmin();
  await db.card.delete({ where: { id } });
  revalidate(deckId);
  return {};
}
