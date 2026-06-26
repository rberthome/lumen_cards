import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const changePasswordSchema = z
  .object({
    newPassword: z.string().min(8, "passwordMin"),
    confirm: z.string(),
  })
  .refine((d) => d.newPassword === d.confirm, {
    message: "passwordMismatch",
    path: ["confirm"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
