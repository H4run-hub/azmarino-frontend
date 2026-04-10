import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Azmarino — ኣዝማሪኖ | Global Shopping for the Eritrean Diaspora",
  description: "Shop 2000+ products with free delivery in Europe. The world's first e-commerce platform for the Eritrean diaspora.",
  keywords: "Azmarino, Eritrean shopping, diaspora, ኣዝማሪኖ, Tigrinya",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">{children}</body>
    </html>
  );
}
