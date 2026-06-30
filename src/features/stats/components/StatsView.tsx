import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { Card, Icon, type IconName } from "@/design-system";
import type { LearnerStats } from "../repository";
import { MasteredHelp } from "./MasteredHelp";

// Encart héros du streak : dégradé "or de marque", identique en clair et sombre.
function StreakHero({
  streakDays,
  xp,
  label,
  xpLabel,
}: {
  streakDays: number;
  xp: number;
  label: string;
  xpLabel: string;
}) {
  return (
    <div className="flex items-center gap-5 rounded-[var(--radius-lg)] bg-gradient-to-br from-[#1E1A0E] to-[#3B2A06] p-7">
      <span className="leading-none text-gold-200">
        <Icon name="streak" size={48} />
      </span>
      <div className="flex-1">
        <div className="mb-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-gold-400">
          {label}
        </div>
        <div className="font-serif text-4xl font-semibold leading-none text-gold-200">
          {streakDays}
        </div>
      </div>
      <div className="text-right">
        <div className="font-serif text-2xl font-semibold text-gold-400">
          {xp}
        </div>
        <div className="text-xs text-gold-700">{xpLabel}</div>
      </div>
    </div>
  );
}

// Carte de stat colorée (acquises = vert, à réviser = ambre).
function StatCard({
  value,
  label,
  icon,
  tone,
  info,
}: {
  value: number;
  label: string;
  icon: IconName;
  tone: "correct" | "accent";
  info?: ReactNode;
}) {
  const tones = {
    correct: "bg-correct/10 border-correct/25 text-correct",
    accent: "bg-accent-soft border-accent-line text-accent-strong",
  } as const;
  return (
    <Card
      elevation="none"
      padding="none"
      className={`relative flex flex-col items-center gap-1 p-5 text-center ${tones[tone]}`}
    >
      {info && <span className="absolute right-2.5 top-2.5">{info}</span>}
      <Icon name={icon} size={24} />
      <span className="font-serif text-2xl font-semibold leading-none">
        {value}
      </span>
      <span className="text-xs text-muted">{label}</span>
    </Card>
  );
}

export async function StatsView({ stats }: { stats: LearnerStats }) {
  const t = await getTranslations("stats");
  return (
    <section className="flex flex-col gap-5">
      <h1 className="font-serif text-2xl font-semibold text-foreground">
        {t("title")}
      </h1>

      <StreakHero
        streakDays={stats.streakDays}
        xp={stats.xp}
        label={t("streak")}
        xpLabel={t("xp")}
      />

      <div className="grid grid-cols-2 gap-3">
        <StatCard
          value={stats.mastered}
          label={t("mastered")}
          icon="correct"
          tone="correct"
          info={<MasteredHelp />}
        />
        <StatCard
          value={stats.due}
          label={t("due")}
          icon="due"
          tone="accent"
        />
      </div>
    </section>
  );
}
