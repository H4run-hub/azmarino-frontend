import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "../context/LanguageContext";
import SaraChat from "../components/SaraChat";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.azmarino.online"),
  applicationName: "Azmarino",
  title: {
    default: "Azmarino | Premium Global E-commerce",
    template: "%s | Azmarino",
  },
  description:
    "Discover curated global fashion, beauty, and technology with secure checkout and worldwide delivery.",
  keywords: [
    "Azmarino",
    "global ecommerce",
    "premium marketplace",
    "luxury fashion",
    "tech accessories",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Azmarino | Premium Global E-commerce",
    description:
      "Curated global collection of fashion, beauty, and technology with secure worldwide shipping.",
    url: "https://www.azmarino.online",
    siteName: "Azmarino",
    images: [
      {
        url: "/logo.jpg",
        width: 1200,
        height: 1200,
        alt: "Azmarino",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Azmarino | Premium Global E-commerce",
    description:
      "Global collection of curated products with secure payments and trusted delivery.",
    images: ["/logo.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.png", type: "image/png" },
    ],
    apple: [{ url: "/favicon.png" }],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col antialiased">
        <LanguageProvider>
          {children}
          <SaraChat />
        </LanguageProvider>
      </body>
    </html>
  );
}
