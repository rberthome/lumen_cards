import Link from "next/link";
import { Button } from "@/design-system";
import { db } from "@/lib/db";
import { getSession, logoutAction } from "@/features/auth";

export default async function Home() {
  const session = await getSession();
  const user = session
    ? await db.user.findUnique({ where: { id: session.userId } })
    : null;

  return (
    <main className="mx-auto flex max-w-2xl flex-col items-center px-6 py-24 text-center">
      <span
        className="mb-6 h-11 w-11 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 50% 38%, #FEF3C7 0%, #FBBF24 38%, #D97706 100%)",
          boxShadow: "var(--shadow-gold)",
        }}
      />
      <h1 className="mb-3 font-serif text-4xl font-semibold text-neutral-900">
        Bienvenue, {user?.name ?? "initié"}
      </h1>
      <p className="mb-2 text-base text-neutral-500">
        La boucle de révision arrive avec les prochaines issues.
      </p>
      {user && (
        <span className="mb-10 rounded-full border border-gold-200 bg-gold-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gold-700">
          {user.role === "admin" ? "Administrateur" : "Apprenant"}
        </span>
      )}

      <div className="flex items-center gap-3">
        {user?.role === "admin" && (
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 rounded-[var(--radius-md)] border border-gold-200 px-[22px] py-3 text-[15px] font-semibold text-gold-700 transition-colors hover:bg-gold-50"
          >
            ⚙️ Administration
          </Link>
        )}
        <form action={logoutAction}>
          <Button variant="secondary" type="submit">
            Déconnexion
          </Button>
        </form>
      </div>
    </main>
  );
}
