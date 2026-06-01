import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import { THEME_COOKIE, MODE_COOKIE, TEXT_COOKIE, resolveTheme } from "@/lib/theme";
import { IconSprite } from "@/components/IconSprite";
import { AppClient } from "@/components/AppClient";
import "./globals.css";

export const metadata: Metadata = {
  title: "SantriKalong — Cahaya di Keheningan Malam",
  description: "Belajar ilmu agama & bahasa Arab online: tahsin, bahasa Arab, dauroh — live maupun rekaman.",
  manifest: "/manifest.webmanifest",
  applicationName: "SantriKalong",
  appleWebApp: { capable: true, title: "SantriKalong", statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0E1A17" },
    { media: "(prefers-color-scheme: light)", color: "#FAF6EF" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const jar = await cookies();
  const { theme, mode, textLarge } = resolveTheme({
    cookieTheme: jar.get(THEME_COOKIE)?.value,
    cookieMode: jar.get(MODE_COOKIE)?.value,
    cookieText: jar.get(TEXT_COOKIE)?.value,
  });

  return (
    <html
      lang="id"
      data-theme={theme}
      data-mode={mode}
      {...(textLarge ? { "data-textsize": "large" } : {})}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Amiri:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <IconSprite />
        {children}
        <AppClient />
      </body>
    </html>
  );
}
