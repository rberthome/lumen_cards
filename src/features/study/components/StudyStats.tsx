import { getTranslations } from "next-intl/server";
import { Card } from "@/design-system";

// Encart de statistiques synthétiques en pied d'accueil.
export async function StudyStats({
  mastered,
  xp,
  due,
}: {
  mastered: number;
  xp: number;
  due: number;
}) {
  const t = await getTranslations("stats");

  const cells = [
    { value: mastered, label: t("mastered"), tone: "text-foreground" },
    { value: xp, label: t("xp"), tone: "text-accent-strong" },
    { value: due, label: t("due"), tone: "text-incorrect" },
  ];

  return (
    <Card padding="lg" className="grid grid-cols-3 gap-4">
      {cells.map((c, i) => (
        <div
          key={c.label}
          className={`text-center ${i === 1 ? "border-x border-line" : ""}`}
        >
          <div
            className={`font-serif text-[28px] font-semibold leading-none ${c.tone}`}
          >
            {c.value}
          </div>
          <div className="mt-1 text-xs text-muted">{c.label}</div>
        </div>
      ))}
    </Card>
  );
}
