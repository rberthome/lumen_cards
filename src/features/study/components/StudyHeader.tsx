import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { logoutAction } from "@/features/auth";

export async function StudyHeader({
  streakDays,
  isAdmin,
}: {
  streakDays: number;
  isAdmin: boolean;
}) {
  const t = await getTranslations("nav");
  const ts = await getTranslations("study");

  return (
    <header className="border-b border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-3">
        <Link
          href="/"
          className="font-serif text-lg font-semibold text-gold-600"
        >
          LumenCards
        </Link>
        <div className="flex items-center gap-3">
          {streakDays > 0 && (
            <span
              title={ts("streakTitle", { count: streakDays })}
              className="flex items-center gap-1 rounded-full bg-gold-50 px-2.5 py-1 text-sm font-semibold text-gold-700"
            >
              🔥 {streakDays}
            </span>
          )}
          <Link
            href="/stats"
            className="text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-800"
          >
            📊 {t("stats")}
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              className="text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-800"
            >
              ⚙️ {t("admin")}
            </Link>
          )}
          <form action={logoutAction}>
            <button
              type="submit"
              className="text-sm text-neutral-400 transition-colors hover:text-neutral-700"
            >
              {t("logout")}
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
