import type { Metadata } from "next";
import { Alfa_Slab_One, Bangers, Special_Elite, Barlow_Condensed, Caveat } from "next/font/google";
import "./globals.css";

const slab = Alfa_Slab_One({ weight: "400", subsets: ["latin"], variable: "--font-slab", display: "swap" });
const comic = Bangers({ weight: "400", subsets: ["latin"], variable: "--font-comic", display: "swap" });
const type = Special_Elite({ weight: "400", subsets: ["latin"], variable: "--font-type", display: "swap" });
const hand = Caveat({ weight: ["500", "700"], subsets: ["latin"], variable: "--font-hand", display: "swap" });
const cond = Barlow_Condensed({ weight: ["500", "700", "900"], subsets: ["latin"], variable: "--font-cond", display: "swap" });

export const metadata: Metadata = {
  title: "$DIAMOND. The world's first anti-jeet memecoin.",
  description:
    "You can sell. You just can't jeet. Every wallet gets one outbound transaction per rolling 24 hours, capped at 1% of its holdings. Diamond hands, enforced by code.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "$DIAMOND. Diamond hands, enforced by code.",
    description: "The world's first anti-jeet memecoin. You can sell. You just can't jeet.",
    images: ["/art/briefcase.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${slab.variable} ${comic.variable} ${type.variable} ${cond.variable} ${hand.variable}`}>
      <body>{children}</body>
    </html>
  );
}
