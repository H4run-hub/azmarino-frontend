import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Azmarino — Global Premium Shopping",
  description: "Curated global fashion, elite electronics, and worldwide delivery. Premium e-commerce.",
  keywords: "Azmarino, premium shopping, global fashion, electronics, accessories",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-white text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
