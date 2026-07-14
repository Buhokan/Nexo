import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers/QueryProvider";
import { Toaster } from "sonner";
import { ClerkProvider } from "@clerk/nextjs";
import { esES } from "@clerk/localizations";
import { ServiceWorkerRegistrar } from "@/components/ServiceWorkerRegistrar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Nexo — Finanzas Personales",
    template: "%s · Nexo",
  },
  description:
    "Tu plataforma personal de finanzas. Registra gastos, establece objetivos y toma el control de tu dinero.",
  keywords: ["finanzas personales", "gastos", "ahorro", "presupuesto", "dinero"],
  authors: [{ name: "Nexo" }],
  creator: "Nexo",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Nexo",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/icons/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0B0B0F",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      localization={esES}
      appearance={{
        variables: {
          colorPrimary: "#7C5CFF",
          colorBackground: "#0B0B0F",
          borderRadius: "0.75rem",
          fontFamily: "var(--font-geist-sans)",
        },
        elements: {
          card: { backgroundColor: "#17171F", border: "1px solid rgba(255,255,255,0.06)", boxShadow: "none" },
          formButtonPrimary: { backgroundColor: "#7C5CFF", "&:hover": { backgroundColor: "#9B82FF" } },
        },
      }}
    >
      <html lang="es" className="dark">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          suppressHydrationWarning
        >
          <QueryProvider>
            <ServiceWorkerRegistrar />
            {children}
            <Toaster theme="dark" position="top-center" richColors />
          </QueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
