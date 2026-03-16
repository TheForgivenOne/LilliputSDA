import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider, Show, UserButton } from "@clerk/nextjs";
import ConvexClientProvider from "@/components/ConvexClientProvider";
import { Church, Menu, X } from "lucide-react";
import Link from "next/link";
import { MobileMenu } from "@/components/MobileMenu";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lilliput SDA Church | Under Construction",
  description: "Growing together in faith. This site is currently being built. Thank you for your patience!",
  robots: "noindex, nofollow",
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
            <header className="fixed top-0 left-0 right-0 z-50 bg-stone-50/95 dark:bg-stone-900/95 backdrop-blur-sm border-b border-stone-200 dark:border-stone-800 shadow-sm/20">
              <div className="px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 py-3">
                <div className="flex items-center justify-between">
                  {/* Logo */}
                  <div className="flex items-center gap-3 group">
                    <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg group-hover:bg-amber-200 dark:group-hover:bg-amber-800/40 transition-colors">
                      <Church className="w-6 h-6 text-amber-700 dark:text-amber-500" />
                    </div>
                    <span className="text-lg font-semibold text-stone-800 dark:text-stone-100 tracking-tight">
                      Lilliput SDA
                    </span>
                    <span className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full ml-2 font-medium tracking-wide">
                      BETA
                    </span>
                  </div>

                  {/* Main Navigation - Hidden until sections exist */}
                  <nav className="hidden md:flex items-center gap-1">
                    {/* Navigation links will be added when pages/sections exist */}
                  </nav>

                  {/* Auth buttons */}
                  <div className="flex items-center gap-3">
                    <Show when="signed-out">
                      <Link
                        href="/sign-in"
                        className="hidden sm:inline-flex px-4 py-2 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 font-medium transition-colors text-sm"
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/sign-up"
                        className="px-4 py-2 bg-amber-700 dark:bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-800 dark:hover:bg-amber-700 transition-all duration-200 shadow-sm hover:shadow-md text-sm"
                      >
                        Join Us
                      </Link>
                    </Show>
                    <Show when="signed-in">
                      <UserButton />
                    </Show>
                    
                    {/* Mobile menu button */}
                    <MobileMenu />
                  </div>
                </div>
              </div>
            </header>
            <div className="pt-16 sm:pt-18 md:pt-20">
              {children}
            </div>
          </ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
