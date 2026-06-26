"use server";

import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { db } from "@/lib/db";
import { hashPassword, verifyPassword } from "./password";
import { createSession, getSession, destroySession } from "./session";
import { loginSchema, changePasswordSchema } from "./schemas";

export interface AuthState {
  error?: string;
}

export async function loginAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const t = await getTranslations("errors");
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { error: t("invalidCredentials") };

  const user = await db.user.findUnique({
    where: { email: parsed.data.email },
  });
  if (
    !user ||
    !(await verifyPassword(parsed.data.password, user.passwordHash))
  ) {
    return { error: t("invalidCredentials") };
  }

  await createSession({
    userId: user.id,
    role: user.role as "admin" | "user",
    mustChangePassword: user.mustChangePassword,
  });
  redirect(user.mustChangePassword ? "/change-password" : "/");
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/login");
}

export async function changePasswordAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const session = await getSession();
  if (!session) redirect("/login");

  const parsed = changePasswordSchema.safeParse({
    newPassword: formData.get("newPassword"),
    confirm: formData.get("confirm"),
  });
  if (!parsed.success) {
    const t = await getTranslations("errors");
    return { error: t(parsed.error.issues[0]?.message ?? "invalid") };
  }

  await db.user.update({
    where: { id: session.userId },
    data: {
      passwordHash: await hashPassword(parsed.data.newPassword),
      mustChangePassword: false,
    },
  });
  await createSession({ ...session, mustChangePassword: false });
  redirect("/");
}
