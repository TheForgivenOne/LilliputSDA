import type { Metadata } from "next";
import { DM_Sans, Playfair_Display, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@/styles/tokens.css";
import { ClerkProvider } from "@clerk/nextjs";
import ConvexClientProvider from "@/components/providers/ConvexClientProvider";
import { DirectionProvider } from "@/components/providers/DirectionProvider";
import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/navigation/Footer";
import { MobileBottomBar } from "@/components/navigation/MobileBottomBar";

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

export const metadata: Metadata = {
  title: "Lilliput SDA Church | Growing Together in Faith",
  description:
    "Welcome to Lilliput Seventh-day Adventist Church in St. James, Jamaica. Join us for worship, fellowship, and community service.",
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
    title: "Lilliput SDA Church",
    description: "Growing together in faith since 1974",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="scroll-smooth">
        <body
          className={`${dmSans.variable} ${playfair.variable} ${geistMono.variable} antialiased bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-stone-100`}
        >
          <ConvexClientProvider>
            <DirectionProvider>
              <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-amber-600 focus:text-white focus:rounded-lg focus:font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                Skip to main content
              </a>
              <div className="min-h-screen flex flex-col">
                <Header />
                <main id="main-content" className="flex-1 pt-16 pb-20 lg:pb-0">{children}</main>
                <Footer />
                <MobileBottomBar />
              </div>
            </DirectionProvider>
          </ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
