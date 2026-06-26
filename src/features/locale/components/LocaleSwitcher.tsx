"use client";

import { useTransition } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { setLocale } from "../actions";

const LOCALES = [
  { code: "fr", label: "FR" },
  { code: "en", label: "EN" },
];

export function LocaleSwitcher() {
  const current = useLocale();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex justify-center gap-2 text-xs">
      {LOCALES.map((l) => (
        <button
          key={l.code}
          type="button"
          disabled={pending || l.code === current}
          onClick={() =>
            startTransition(async () => {
              await setLocale(l.code);
              router.refresh();
            })
          }
          className={
            l.code === current
              ? "font-semibold text-gold-700"
              : "text-neutral-400 transition-colors hover:text-neutral-600"
          }
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
