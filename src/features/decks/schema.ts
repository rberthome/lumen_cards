import { z } from "zod";

export const deckFormSchema = z.object({
  title: z.string().min(1, "titleRequired").max(120),
  description: z.string().max(500).optional(),
  categoryId: z.coerce.number().int().positive("categoryRequired"),
  coverEmoji: z.string().max(8).optional(),
  isPublished: z.boolean().default(false),
});

export type DeckFormInput = z.infer<typeof deckFormSchema>;
