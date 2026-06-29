import Link from "next/link";
import { getTranslations } from "next-intl/server";

export async function ReviewEmpty() {
  const t = await getTranslations("study");
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-6 py-24 text-center">
      <p className="font-serif text-2xl text-foreground">{t("nothingDue")}</p>
      <Link href="/" className="text-sm font-medium text-info hover:underline">
        {t("backHome")}
      </Link>
    </div>
  );
}
