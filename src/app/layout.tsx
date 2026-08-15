import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { LanguageProvider } from "@/components/providers/language-provider";
import { OfflineSyncProvider } from "@/components/providers/offline-sync-provider";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;
  return {
    metadataBase: new URL(origin),
    title: { default: "EcoQadam", template: "%s · EcoQadam" },
    description: "Xorazm o‘quvchilari uchun iqlim ta’limi va ekologik harakat platformasi.",
    applicationName: "EcoQadam",
    openGraph: { title: "EcoQadam — Climate Learning & Action", description: "O‘rganing. Harakat qiling. Ta’siringizni o‘lchang.", images: [{ url: `${origin}/og.png`, width: 1728, height: 912 }], locale: "uz_UZ", type: "website" },
    twitter: { card: "summary_large_image", title: "EcoQadam", description: "O‘rganing. Harakat qiling. Ta’siringizni o‘lchang.", images: [`${origin}/og.png`] },
  };
}

export const viewport: Viewport = {
  themeColor: "#123e35",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="uz">
      <body>
        <LanguageProvider><OfflineSyncProvider>{children}</OfflineSyncProvider></LanguageProvider>
      </body>
    </html>
  );
}
