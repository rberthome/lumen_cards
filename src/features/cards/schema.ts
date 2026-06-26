import { z } from "zod";

export const cardFormSchema = z.object({
  front: z.string().min(1, "frontRequired").max(500),
  back: z.string().min(1, "backRequired").max(500),
  explanation: z.string().max(2000).optional(),
  wrongAnswer1: z.string().max(500).optional(),
  wrongAnswer2: z.string().max(500).optional(),
  wrongAnswer3: z.string().max(500).optional(),
  source: z.string().max(300).optional(),
});

export type CardFormInput = z.infer<typeof cardFormSchema>;
