"use server";

import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/features/auth";
import { hashPassword } from "@/features/auth/password";
import { userFormSchema } from "./schema";

// Entrée brute du formulaire (role string) ; validée/contraint par zod ci-dessous.
export interface CreateUserInput {
  name: string;
  email: string;
  role: string;
  password: string;
}

export interface UserActionResult {
  error?: string;
  tempPassword?: string;
}

async function err(key?: string): Promise<UserActionResult> {
  const t = await getTranslations("errors");
  return { error: t(key ?? "invalid") };
}

function genTempPassword(): string {
  return randomBytes(9).toString("base64url"); // ~12 caractères
}

export async function createUser(
  input: CreateUserInput,
): Promise<UserActionResult> {
  await requireAdmin();
  const parsed = userFormSchema.safeParse(input);
  if (!parsed.success) return err(parsed.error.issues[0]?.message);

  const { name, email, role, password } = parsed.data;
  if (await db.user.findUnique({ where: { email } })) return err("emailTaken");

  await db.user.create({
    data: {
      name,
      email,
      role,
      passwordHash: await hashPassword(password),
      mustChangePassword: true,
    },
  });
  revalidatePath("/admin/users");
  return {};
}

export async function resetUserPassword(id: number): Promise<UserActionResult> {
  await requireAdmin();
  const password = genTempPassword();
  await db.user.update({
    where: { id },
    data: {
      passwordHash: await hashPassword(password),
      mustChangePassword: true,
    },
  });
  revalidatePath("/admin/users");
  return { tempPassword: password };
}

export async function deleteUser(id: number): Promise<UserActionResult> {
  const session = await requireAdmin();
  if (session.userId === id) return err("cannotDeleteSelf");
  await db.user.delete({ where: { id } });
  revalidatePath("/admin/users");
  return {};
}
