"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/design-system";

export default function Error({ reset }: { reset: () => void }) {
  const t = useTranslations("errors");
  const ts = useTranslations("study");

  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-6 py-20 text-center">
      <p className="font-serif text-lg text-foreground">{t("generic")}</p>
      <div className="flex items-center gap-3">
        <Button onClick={reset}>{ts("continue")}</Button>
        <Link
          href="/"
          className="text-sm font-medium text-info hover:underline"
        >
          {ts("backHome")}
        </Link>
      </div>
    </div>
  );
}
