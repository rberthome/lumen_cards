import { cookies } from "next/headers";
import { THEME_COOKIE, type Theme } from "./theme";

// Lit le thème depuis le cookie côté serveur (root layout) — évite le flash SSR.
export async function getTheme(): Promise<Theme> {
  const store = await cookies();
  return store.get(THEME_COOKIE)?.value === "dark" ? "dark" : "light";
}
