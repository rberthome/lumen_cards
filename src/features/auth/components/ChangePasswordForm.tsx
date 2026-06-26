"use client";

import { useActionState } from "react";
import { Button, Input } from "@/design-system";
import { changePasswordAction, type AuthState } from "../actions";

const initial: AuthState = {};

export function ChangePasswordForm() {
  const [state, action, pending] = useActionState(
    changePasswordAction,
    initial,
  );

  return (
    <form action={action} className="flex flex-col gap-4">
      <Input
        name="newPassword"
        type="password"
        label="Nouveau mot de passe"
        autoComplete="new-password"
        autoFocus
        required
      />
      <Input
        name="confirm"
        type="password"
        label="Confirmer le mot de passe"
        autoComplete="new-password"
        error={state.error}
        required
      />
      <Button type="submit" disabled={pending} className="mt-2 w-full">
        {pending ? "Enregistrement…" : "Définir le mot de passe"}
      </Button>
    </form>
  );
}
