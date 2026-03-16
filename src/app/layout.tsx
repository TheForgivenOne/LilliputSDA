import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider, Show, UserButton } from "@clerk/nextjs";
import ConvexClientProvider from "@/components/ConvexClientProvider";
import { Church } from "lucide-react";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lilliput SDA Church",
  description: "Growing together in faith",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <ConvexClientProvider>
            <header className="fixed top-0 left-0 right-0 z-50 px-8 md:px-16 lg:px-24 py-4">
              <div className="flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-3">
                  <Church className="w-8 h-8 text-amber-700 dark:text-amber-500" />
                  <span className="text-xl font-semibold text-stone-800 dark:text-stone-100">
                    Lilliput SDA
                  </span>
                </div>

                {/* Auth buttons */}
                <div className="flex items-center gap-3">
                  <Show when="signed-out">
                    <Link
                      href="/sign-in"
                      className="px-4 py-2 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 font-medium transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/sign-up"
                      className="px-4 py-2 bg-amber-700 dark:bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-800 dark:hover:bg-amber-700 transition-colors"
                    >
                      Join Us
                    </Link>
                  </Show>
                  <Show when="signed-in">
                    <UserButton />
                  </Show>
                </div>
              </div>
            </header>
            <div className="pt-20">
              {children}
            </div>
          </ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
