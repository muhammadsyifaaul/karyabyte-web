import type { Metadata, Viewport } from "next";
import "./globals.css";
import LenisProvider from "./components/ui/LenisProvider";

export const metadata: Metadata = {
  title: "KaryaByte — Independent Digital Product & Systems Studio",
  description:
    "Enterprise-grade architecture meets craft-level design — delivered with two-person agility and zero overhead.",
  keywords: [
    "digital product studio",
    "systems engineering",
    "UI/UX design",
    "fullstack development",
    "KaryaByte",
  ],
  authors: [{ name: "KaryaByte" }],
  openGraph: {
    title: "KaryaByte",
    description: "Independent Digital Product & Systems Studio",
    type: "website",
    locale: "en_US",
  },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/*
          Google Fonts loaded via standard <link> — avoids the
          @vercel/turbopack-next/internal/font/google/font bug in Next.js 16.
          preconnect tags reduce DNS + TLS latency.
        */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:wght@300;400;500;600&display=swap"
        />
      </head>
      <body className="bg-[#050505] text-white antialiased overflow-x-hidden">
        <LenisProvider>
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}
