import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "../context/LanguageContext";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.azmarino.online"),
  applicationName: "Azmarino",
  title: {
    default: "Azmarino | Premium Global Shopping for the Eritrean Diaspora",
    template: "%s | Azmarino",
  },
  description:
    "Azmarino is a premium global shopping experience built for the Eritrean diaspora, with secure payments, curated products, and delivery across Europe and beyond.",
  keywords: [
    "Azmarino",
    "Eritrean diaspora shopping",
    "global ecommerce",
    "premium marketplace",
    "Tigrinya shopping",
    "diaspora marketplace",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Azmarino | Premium Global Shopping for the Eritrean Diaspora",
    description:
      "Discover curated fashion, beauty, and technology with secure checkout, multilingual support, and trusted delivery across Europe and beyond.",
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
    title: "Azmarino | Premium Global Shopping for the Eritrean Diaspora",
    description:
      "A calmer, premium online marketplace for curated products, secure payments, and trusted delivery.",
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
      <body className="min-h-full flex flex-col antialiased site-bg text-[var(--ink-strong)]">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
