"use client";

import { useActionState, useState } from "react";
import { useTranslations } from "next-intl";
import { Button, Input, Loader } from "@/design-system";
import { changePasswordAction, type AuthState } from "../actions";

const initial: AuthState = {};

export function ChangePasswordForm() {
  const t = useTranslations("auth");
  const tc = useTranslations("common");
  const [state, action, pending] = useActionState(
    changePasswordAction,
    initial,
  );
  const [showPw, setShowPw] = useState(false);
  const type = showPw ? "text" : "password";

  return (
    <form action={action} className="flex flex-col gap-4">
      <div className="relative">
        <Input
          name="newPassword"
          type={type}
          label={t("newPassword")}
          autoComplete="new-password"
          className="pr-11"
          autoFocus
          required
        />
        <button
          type="button"
          aria-label={showPw ? t("hidePassword") : t("showPassword")}
          aria-pressed={showPw}
          onClick={() => setShowPw((v) => !v)}
          className="absolute right-3 top-[34px] text-base text-muted transition-colors hover:text-foreground"
        >
          {showPw ? "🙈" : "👁️"}
        </button>
      </div>
      <Input
        name="confirm"
        type={type}
        label={t("confirmPassword")}
        autoComplete="new-password"
        error={state.error}
        required
      />
      <Button type="submit" disabled={pending} className="mt-2 w-full">
        {pending && <Loader size="sm" />}
        {pending ? tc("saving") : t("setPassword")}
      </Button>
    </form>
  );
}
