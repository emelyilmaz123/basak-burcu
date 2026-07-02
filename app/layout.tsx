import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Başak Burcu ♍ — Astral Arşivler",
  description: "Başak burcunun gizemli dünyasına hoş geldiniz.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={playfair.className}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=VT323&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
