import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "../i18n/LanguageProvider";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.azmarino.online"),
  applicationName: "Azmarino",
  title: {
    default: "Azmarino — Global Premium Shopping",
    template: "%s | Azmarino",
  },
  description:
    "Curated global fashion, elite electronics, and worldwide delivery. Premium e-commerce for the modern shopper.",
  keywords: [
    "Azmarino",
    "global premium shopping",
    "premium marketplace",
    "global fashion",
    "electronics",
    "accessories",
    "multilingual shopping",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Azmarino — Global Premium Shopping",
    description:
      "Curated global fashion, elite electronics, and worldwide delivery. Premium e-commerce for the modern shopper.",
    url: "https://www.azmarino.online",
    siteName: "Azmarino",
    images: [{ url: "/logo.svg", width: 400, height: 300, alt: "Azmarino" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Azmarino — Global Premium Shopping",
    description:
      "Curated global fashion, elite electronics, and worldwide delivery.",
    images: ["/logo.svg"],
  },
  icons: {
    icon: [{ url: "/logo.svg", type: "image/svg+xml" }, { url: "/favicon.png", type: "image/png" }],
    apple: [{ url: "/favicon.png" }],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-white text-gray-900 antialiased">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
