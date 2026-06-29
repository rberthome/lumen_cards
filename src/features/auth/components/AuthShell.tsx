import type { ReactNode } from "react";
import { LumenMark } from "@/design-system";
import { LocaleSwitcher } from "@/features/locale";
import { ThemeToggle, getTheme } from "@/features/theme";

// Coquille centrée et sobre pour les écrans d'authentification.
export async function AuthShell({
  title,
  subtitle,
  footer,
  children,
}: {
  title: string;
  subtitle?: string;
  footer?: string;
  children: ReactNode;
}) {
  const theme = await getTheme();

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4">
            <LumenMark />
          </div>
          <h1 className="font-serif text-2xl font-semibold text-foreground">
            {title}
          </h1>
          {subtitle && <p className="mt-2 text-sm text-muted">{subtitle}</p>}
        </div>
        <div className="rounded-[var(--radius-lg)] border border-line bg-surface p-7 shadow-[var(--shadow-md)]">
          {children}
        </div>
        {footer && (
          <p className="mt-5 text-center text-xs leading-relaxed text-muted">
            {footer}
          </p>
        )}
        <div className="mt-6 flex items-center justify-center gap-4">
          <LocaleSwitcher />
          <ThemeToggle initial={theme} />
        </div>
      </div>
    </main>
  );
}
