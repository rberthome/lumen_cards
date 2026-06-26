"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { Button, Input } from "@/design-system";
import { changePasswordAction, type AuthState } from "../actions";

const initial: AuthState = {};

export function ChangePasswordForm() {
  const t = useTranslations("auth");
  const tc = useTranslations("common");
  const [state, action, pending] = useActionState(
    changePasswordAction,
    initial,
  );

  return (
    <form action={action} className="flex flex-col gap-4">
      <Input
        name="newPassword"
        type="password"
        label={t("newPassword")}
        autoComplete="new-password"
        autoFocus
        required
      />
      <Input
        name="confirm"
        type="password"
        label={t("confirmPassword")}
        autoComplete="new-password"
        error={state.error}
        required
      />
      <Button type="submit" disabled={pending} className="mt-2 w-full">
        {pending ? tc("saving") : t("setPassword")}
      </Button>
    </form>
  );
}
