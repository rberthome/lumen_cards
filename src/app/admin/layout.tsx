import type { ReactNode } from "react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { requireAdmin, logoutAction } from "@/features/auth";

const navLink =
  "flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-neutral-900";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireAdmin();
  const t = await getTranslations("nav");

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <aside className="flex w-56 flex-col border-r border-neutral-200 bg-white px-3 py-6">
        <div className="mb-8 px-3">
          <span className="font-serif text-lg font-semibold text-gold-600">
            LumenCards
          </span>
          <p className="text-xs text-neutral-400">{t("admin")}</p>
        </div>

        <nav className="flex flex-1 flex-col gap-1">
          <Link href="/admin/categories" className={navLink}>
            <span className="text-base">🗂️</span> {t("categories")}
          </Link>
          <Link href="/admin/decks" className={navLink}>
            <span className="text-base">📚</span> {t("decks")}
          </Link>
          <Link href="/admin/users" className={navLink}>
            <span className="text-base">👥</span> {t("users")}
          </Link>
        </nav>

        <div className="flex flex-col gap-1 border-t border-neutral-100 pt-4">
          <Link href="/" className={navLink}>
            <span className="text-base">🎓</span> {t("backToApp")}
          </Link>
          <form action={logoutAction}>
            <button type="submit" className={`${navLink} w-full`}>
              <span className="text-base">↩</span> {t("logout")}
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 overflow-auto p-8">{children}</main>
    </div>
  );
}
