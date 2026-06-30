import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Icon } from "@/design-system";

// Bandeau d'appel à l'action « réviser ce qui est dû » — dégradé or de marque.
export async function DueHero({ dueTotal }: { dueTotal: number }) {
  const t = await getTranslations("study");

  if (dueTotal === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-[var(--radius-lg)] border border-line bg-surface py-10">
        <p className="font-serif text-lg text-foreground">{t("upToDate")}</p>
        <Link
          href="/review"
          className="text-sm font-medium text-info hover:underline"
        >
          {t("reviewAhead")}
        </Link>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-[var(--radius-lg)] bg-gradient-to-br from-[#1e1a0e] to-[#3b2a06] p-7 shadow-[var(--shadow-gold)]">
      <div className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(251,191,36,.25),transparent_70%)]" />
      <div className="relative flex flex-col gap-1">
        <span className="font-serif text-2xl font-semibold text-neutral-50">
          {t("cardsDue", { count: dueTotal })}
        </span>
        <Link
          href="/review"
          className="mt-4 inline-flex w-fit items-center justify-center gap-2 rounded-[var(--radius-md)] bg-gold-400 px-7 py-3.5 text-[15px] font-bold text-[#1a1206] transition-all hover:-translate-y-px hover:bg-gold-500"
        >
<Icon name="cards" size={18} /> {t("reviewDue", { count: dueTotal })}
        </Link>
      </div>
    </div>
  );
}
