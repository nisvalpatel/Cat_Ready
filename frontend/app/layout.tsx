import type { Metadata, Viewport } from "next";
import { Inter, IBM_Plex_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
});

// Using Inter for now, but this could be replaced with a more industrial condensed font
const heading = Inter({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: "CAT Ready | Voice-First Inspection System",
  description:
    "Voice-first inspection system for Caterpillar field operators. Speak it. See it. Submit it. Built on Caterpillar inspection standards, powered by AI.",
  keywords: [
    "Caterpillar",
    "CAT",
    "inspection",
    "fleet management",
    "AI",
    "voice",
    "equipment",
  ],
};

export const viewport: Viewport = {
  themeColor: "#FFCD11",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${ibmPlexMono.variable} ${heading.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
