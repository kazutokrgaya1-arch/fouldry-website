import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const body = Inter({ subsets: ["latin"], variable: "--font-body" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Foundry — Website Templates",
  description:
    "Fully coded HTML/CSS/JS website templates for coffee shops, portfolios, SaaS products, restaurants, and gyms.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${body.variable} ${mono.variable}`}>
      <body className="font-body bg-market-bg text-market-text antialiased">
        {children}
      </body>
    </html>
  );
}
