import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

export const SUPPORTED_LOCALES = ["fr", "en"] as const;
export const DEFAULT_LOCALE = "fr";
export const LOCALE_COOKIE = "locale";

// Sans routing d'URL : la locale vient d'un cookie (défaut fr). Public privé, un seul domaine.
export default getRequestConfig(async () => {
  const store = await cookies();
  const requested = store.get(LOCALE_COOKIE)?.value;
  const locale = (SUPPORTED_LOCALES as readonly string[]).includes(
    requested ?? "",
  )
    ? (requested as string)
    : DEFAULT_LOCALE;

  return {
    locale,
    messages: (await import(`./locales/${locale}.json`)).default,
  };
});
