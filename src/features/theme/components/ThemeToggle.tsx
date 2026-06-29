"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { THEME_COOKIE, type Theme } from "../theme";

const MAX_AGE = 60 * 60 * 24 * 365;

// Bascule instantanée : on flippe la classe .dark sur <html> et on persiste le
// cookie côté client. Le root layout relit ce cookie au prochain rendu serveur.
export function ThemeToggle({ initial }: { initial: Theme }) {
  const t = useTranslations("theme");
  const [theme, setTheme] = useState<Theme>(initial);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    document.cookie = `${THEME_COOKIE}=${next};path=/;max-age=${MAX_AGE};samesite=lax`;
  }

  const isDark = theme === "dark";
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={t("label")}
      className="flex items-center gap-1 rounded-full border border-line px-2.5 py-1 text-sm font-medium text-muted transition-colors hover:text-foreground"
    >
      {isDark ? `☀️ ${t("light")}` : `🌙 ${t("dark")}`}
    </button>
  );
}
