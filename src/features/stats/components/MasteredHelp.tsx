"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Icon, Modal } from "@/design-system";
import { INTERVAL_DAYS, MODE_THRESHOLD } from "@/features/review/scheduler";

// Nombre de jours minimal avant qu'une carte ne soit « connue » : il faut
// MODE_THRESHOLD réussites, chacune à l'échéance du palier précédent.
const minDays = INTERVAL_DAYS.slice(0, MODE_THRESHOLD - 1).reduce(
  (sum, days) => sum + days,
  0,
);

// Petit « i » qui ouvre une modale expliquant la règle des cartes connues.
export function MasteredHelp() {
  const t = useTranslations("stats.masteredHelp");
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label={t("aria")}
        onClick={() => setOpen(true)}
        className="inline-flex text-correct/70 transition-colors hover:text-correct"
      >
        <Icon name="info" size={16} />
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title={t("title")}>
        <div className="flex flex-col gap-3 text-sm leading-relaxed text-foreground">
          <p>{t("p1", { threshold: MODE_THRESHOLD })}</p>
          <p className="text-muted">{t("p2")}</p>
          <p>{t("p3", { minDays, threshold: MODE_THRESHOLD })}</p>
        </div>
      </Modal>
    </>
  );
}
