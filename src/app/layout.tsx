import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/lib/providers";

export const metadata: Metadata = {
  title: "LumenCards",
  description:
    "Révision par répétition espacée — philosophie, Kabbale et symbolisme maçonnique.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="min-h-full bg-neutral-50 font-sans text-neutral-900">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
