import type { Metadata } from "next";
import { Big_Shoulders, Geist, IBM_Plex_Mono, Share_Tech_Mono } from "next/font/google";
import "./globals.css";

const display = Big_Shoulders({ weight: ["700", "800", "900"], subsets: ["latin"], variable: "--font-display", display: "swap" });
const sans = Geist({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const term = Share_Tech_Mono({ weight: "400", subsets: ["latin"], variable: "--font-term", display: "swap" });
const mono = IBM_Plex_Mono({ weight: ["400", "500", "600"], subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  title: "$DIAMOND. The world's first anti-jeet memecoin.",
  description:
    "You can sell. You just can't jeet. Every wallet gets one outbound transaction per rolling 24 hours, capped at 1% of its holdings. Diamond hands, enforced by code.",
  icons: { icon: "/favicon.png" },
  openGraph: {
    title: "$DIAMOND. Diamond hands, enforced by code.",
    description: "The world's first anti-jeet memecoin. You can sell. You just can't jeet.",
    images: ["/art/case/banner.webp"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable} ${term.variable}`}>
      <body>{children}</body>
    </html>
  );
}
