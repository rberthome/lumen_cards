import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import "./globals.css";
import { Providers } from "@/lib/providers";
import { getTheme } from "@/features/theme";

export const metadata: Metadata = {
  title: "LumenCards",
  description:
    "Révision par répétition espacée — philosophie, Kabbale et symbolisme maçonnique.",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();
  const messages = await getMessages();
  const theme = await getTheme();

  return (
    <html
      lang={locale}
      className={`h-full antialiased${theme === "dark" ? " dark" : ""}`}
    >
      <body
        className="min-h-full bg-background font-sans text-foreground"
        suppressHydrationWarning
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
