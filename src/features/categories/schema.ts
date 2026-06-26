import { z } from "zod";

export const categoryFormSchema = z.object({
  name: z.string().min(1, "nameRequired").max(60),
  coverEmoji: z.string().max(8).optional(),
  sortOrder: z.coerce.number().int().min(0).max(9999).default(0),
});

export type CategoryFormInput = z.infer<typeof categoryFormSchema>;
