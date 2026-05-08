import type { Metadata } from "next";
import { DM_Sans, Playfair_Display, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@/styles/tokens.css";
import { DirectionProvider } from "@/components/providers/DirectionProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { Analytics as VercelAnalytics } from "@vercel/analytics/next"
import { Analytics } from "@/components/Analytics";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://lilliputsda.org"

export const metadata: Metadata = {
  title: "Lilliput SDA Church | Growing Together in Faith",
  description:
    "A warm Seventh-day Adventist congregation in Lilliput, Montego Bay, St. James, Jamaica. Saturdays at 11AM.",
  metadataBase: new URL(BASE_URL),
  keywords: [
    "Lilliput SDA",
    "Seventh-day Adventist",
    "Montego Bay",
    "St. James",
    "Jamaica",
    "Church",
    "Worship",
  ],
  openGraph: {
    title: "Lilliput SDA Church | Growing Together in Faith",
    description:
      "A warm Seventh-day Adventist congregation in Lilliput, Montego Bay, St. James, Jamaica. Saturdays at 11AM.",
    url: "/",
    type: "website",
    siteName: "Lilliput SDA Church",
    images: [
      {
        url: "/images/logos/og-image.png",
        width: 1200,
        height: 630,
        alt: "Lilliput SDA Church",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lilliput SDA Church | Growing Together in Faith",
    description:
      "A warm Seventh-day Adventist congregation in Lilliput, Montego Bay, St. James, Jamaica. Saturdays at 11AM.",
    images: ["/images/logos/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicons/favicon.ico", sizes: "any", type: "image/x-icon" },
      { url: "/favicons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/favicons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    other: [
      { url: "/favicons/android-chrome-192x192.png", sizes: "192x192", type: "image/png", rel: "icon" },
      { url: "/favicons/android-chrome-512x512.png", sizes: "512x512", type: "image/png", rel: "icon" },
      { url: "/favicons/favicon.svg", type: "image/svg+xml", rel: "icon" },
    ],
  },
  manifest: "/manifest.json",
  themeColor: "#1A0800",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" data-scroll-behavior="smooth">
      <body
        className={`${dmSans.variable} ${playfair.variable} ${geistMono.variable} antialiased bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-stone-100`}
      >
        <AuthProvider>
          <DirectionProvider>
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-amber-600 focus:text-white focus:rounded-lg focus:font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              Skip to main content
            </a>
            {children}
          </DirectionProvider>
        </AuthProvider>
        <Analytics />
        <VercelAnalytics />
      </body>
    </html>
  );
}