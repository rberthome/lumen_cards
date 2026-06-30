import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Icon } from "@/design-system";
import { logoutAction } from "@/features/auth";
import { ThemeToggle, getTheme } from "@/features/theme";

export async function StudyHeader({
  streakDays,
  isAdmin,
}: {
  streakDays: number;
  isAdmin: boolean;
}) {
  const t = await getTranslations("nav");
  const ts = await getTranslations("study");
  const theme = await getTheme();

  return (
    <header className="border-b border-line bg-surface">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-3">
        <Link
          href="/"
          className="font-serif text-lg font-semibold text-accent-strong"
        >
          LumenCards
        </Link>
        <div className="flex items-center gap-3">
          {streakDays > 0 && (
            <span
              title={ts("streakTitle", { count: streakDays })}
              className="flex items-center gap-1 rounded-full bg-accent-soft px-2.5 py-1 text-sm font-semibold text-accent-strong"
            >
              <Icon name="streak" size={15} /> {streakDays}
            </span>
          )}
          <Link
            href="/stats"
            className="flex items-center gap-1 text-sm font-medium text-muted transition-colors hover:text-foreground"
          >
            <Icon name="stats" size={16} /> {t("stats")}
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              className="flex items-center gap-1 text-sm font-medium text-muted transition-colors hover:text-foreground"
            >
              <Icon name="settings" size={16} /> {t("admin")}
            </Link>
          )}
          <ThemeToggle initial={theme} />
          <form action={logoutAction}>
            <button
              type="submit"
              className="text-sm text-muted transition-colors hover:text-foreground"
            >
              {t("logout")}
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
