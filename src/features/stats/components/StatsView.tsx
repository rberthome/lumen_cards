import { getTranslations } from "next-intl/server";
import type { LearnerStats } from "../repository";

function StatCard({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-[var(--radius-lg)] border border-neutral-200 bg-white p-6 text-center shadow-[var(--shadow-sm)]">
      <span className="font-serif text-4xl font-semibold text-neutral-900">
        {value}
      </span>
      <span className="text-sm text-neutral-500">{label}</span>
    </div>
  );
}

export async function StatsView({ stats }: { stats: LearnerStats }) {
  const t = await getTranslations("stats");
  return (
    <section className="flex flex-col gap-6">
      <h1 className="font-serif text-2xl font-semibold text-neutral-900">
        {t("title")}
      </h1>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard value={stats.streakDays} label={`🔥 ${t("streak")}`} />
        <StatCard value={stats.xp} label={t("xp")} />
        <StatCard value={stats.mastered} label={t("mastered")} />
        <StatCard value={stats.due} label={t("due")} />
      </div>
    </section>
  );
}
