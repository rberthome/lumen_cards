import type { ReactNode } from "react";
import { LocaleSwitcher } from "@/features/locale";

// Coquille centrée et sobre pour les écrans d'authentification.
export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <span
            className="mb-4 h-11 w-11 rounded-full"
            style={{
              background:
                "radial-gradient(circle at 50% 38%, #FEF3C7 0%, #FBBF24 38%, #D97706 100%)",
              boxShadow: "var(--shadow-gold)",
            }}
          />
          <h1 className="font-serif text-2xl font-semibold text-neutral-900">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 text-sm text-neutral-500">{subtitle}</p>
          )}
        </div>
        <div className="rounded-[var(--radius-lg)] border border-neutral-200 bg-white p-7 shadow-[var(--shadow-md)]">
          {children}
        </div>
        <div className="mt-6">
          <LocaleSwitcher />
        </div>
      </div>
    </main>
  );
}
