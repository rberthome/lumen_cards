import { z } from "zod";

export const userFormSchema = z.object({
  name: z.string().min(1, "nameRequired").max(80),
  email: z.string().email("emailInvalid"),
  role: z.enum(["admin", "user"]),
  password: z.string().min(8, "passwordMin"),
});

export type UserFormInput = z.infer<typeof userFormSchema>;
