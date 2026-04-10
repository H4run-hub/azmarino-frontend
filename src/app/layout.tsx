import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "../context/LanguageContext";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Azmarino — ኣዝማሪኖ | Global Shopping for the Eritrean Diaspora",
  description: "Shop 1,184+ products with free delivery in Europe. The world's first e-commerce platform for the Eritrean diaspora.",
  keywords: "Azmarino, Eritrean shopping, diaspora, ኣዝማሪኖ, Tigrinya",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-white text-gray-900 antialiased">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
