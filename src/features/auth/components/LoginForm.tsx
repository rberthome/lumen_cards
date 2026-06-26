"use client";

import { useActionState } from "react";
import { Button, Input } from "@/design-system";
import { loginAction, type AuthState } from "../actions";

const initial: AuthState = {};

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, initial);

  return (
    <form action={action} className="flex flex-col gap-4">
      <Input
        name="email"
        type="email"
        label="Adresse e-mail"
        placeholder="vous@exemple.fr"
        autoComplete="email"
        autoFocus
        required
      />
      <Input
        name="password"
        type="password"
        label="Mot de passe"
        autoComplete="current-password"
        required
      />
      {state.error && <p className="text-sm text-error">{state.error}</p>}
      <Button type="submit" disabled={pending} className="mt-2 w-full">
        {pending ? "Connexion…" : "Se connecter"}
      </Button>
    </form>
  );
}
