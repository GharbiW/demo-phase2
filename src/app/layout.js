import "./globals.css";
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import { AppShell } from "@/components/layout/AppShell";
import { DemoStoreProvider } from "@/stores/demoStore";

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex-sans",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata = {
  title: {
    default: "Demo Phase 2 · Parnass",
  },
  description: "Démo (statique) — Phase 2 Parnass",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className="light" suppressHydrationWarning>
      <body
        className={`${plexSans.variable} ${plexMono.variable} font-sans bg-neutral-50 antialiased`}
        suppressHydrationWarning
      >
        <DemoStoreProvider>
          <AppShell>{children}</AppShell>
        </DemoStoreProvider>
      </body>
    </html>
  );
}

