import type { ReactNode } from "react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { LumenMark, Icon } from "@/design-system";
import { ThemeToggle, getTheme } from "@/features/theme";
import { requireAdmin, logoutAction } from "@/features/auth";

// La sidebar reprend l'esprit de la maquette : navy de marque constant
// (clair comme sombre), item actif en or. Couleurs de marque volontairement
// fixes — la sidebar reste sombre dans les deux thèmes.
const navLink =
  "flex items-center gap-2.5 rounded-[8px] px-3 py-2.5 text-sm font-medium text-neutral-400 transition-colors hover:bg-white/[0.07] hover:text-neutral-50";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireAdmin();
  const t = await getTranslations("nav");
  const tu = await getTranslations("users");
  const theme = await getTheme();

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="sticky top-0 flex h-screen w-56 flex-shrink-0 flex-col bg-[#0f172a]">
        <div className="border-b border-white/10 px-5 pb-4 pt-6">
          <div className="mb-1 flex items-center gap-2.5">
            <LumenMark size="md" />
            <span className="font-serif text-lg font-semibold text-neutral-50">
              LumenCards
            </span>
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-neutral-500">
            {t("admin")}
          </p>
        </div>

        <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-2.5 py-3.5">
          <Link href="/admin/categories" className={navLink}>
            <Icon name="categories" size={18} /> {t("categories")}
          </Link>
          <Link href="/admin/decks" className={navLink}>
            <Icon name="decks" size={18} /> {t("decks")}
          </Link>
          <Link href="/admin/users" className={navLink}>
            <Icon name="users" size={18} /> {t("users")}
          </Link>
          <Link href="/" className={navLink}>
            <Icon name="graduation" size={18} /> {t("backToApp")}
          </Link>
        </nav>

        <div className="flex flex-col gap-3 border-t border-white/10 px-4 py-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white/10">
              <Icon name="graduation" size={16} />
            </span>
            <span className="truncate text-sm font-semibold text-neutral-50">
              {tu("roleAdmin")}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <ThemeToggle initial={theme} />
            <form action={logoutAction}>
              <button
                type="submit"
                className="text-xs font-medium text-neutral-400 transition-colors hover:text-neutral-50"
              >
                {t("logout")}
              </button>
            </form>
          </div>
        </div>
      </aside>

      <main className="min-w-0 flex-1 overflow-x-auto p-8">{children}</main>
    </div>
  );
}
