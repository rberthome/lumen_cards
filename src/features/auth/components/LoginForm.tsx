"use client";

import { useActionState, useState } from "react";
import { useTranslations } from "next-intl";
import { Button, Input, Loader } from "@/design-system";
import { loginAction, type AuthState } from "../actions";

const initial: AuthState = {};

export function LoginForm() {
  const t = useTranslations("auth");
  const [state, action, pending] = useActionState(loginAction, initial);
  const [showPw, setShowPw] = useState(false);

  return (
    <form action={action} className="flex flex-col gap-4">
      <Input
        name="email"
        type="email"
        label={t("email")}
        placeholder={t("emailPlaceholder")}
        autoComplete="email"
        autoFocus
        required
      />
      <div className="relative">
        <Input
          name="password"
          type={showPw ? "text" : "password"}
          label={t("password")}
          autoComplete="current-password"
          className="pr-11"
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
      {state.error && (
        <p
          role="alert"
          className="flex items-center gap-2 text-sm text-incorrect"
        >
          <span aria-hidden>⚠️</span>
          {state.error}
        </p>
      )}
      <Button type="submit" disabled={pending} className="mt-2 w-full">
        {pending && <Loader size="sm" />}
        {pending ? t("signingIn") : t("signIn")}
      </Button>
    </form>
  );
}
