"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { DecisionCardTrigger } from "@/components/modals/DecisionCardModal";
import { cn, throttle } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/ministries", label: "Ministries" },
  { href: "/media", label: "Media" },
  { href: "/events", label: "Events" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = throttle(() => {
      setIsScrolled(window.scrollY > 10);
    }, 100);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "bg-white/95 dark:bg-stone-900/95 backdrop-blur-md shadow-sm"
            : "bg-white dark:bg-stone-900"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group" aria-label="Lilliput SDA Church Home">
              <Image
                src="/images/logos/logo-128.png"
                alt="Lilliput SDA Church"
                width={56}
                height={56}
                className="w-12 h-12 lg:w-14 lg:h-14 flex-shrink-0 object-contain"
                priority
              />
              <div className="flex flex-col">
                <span className="text-lg lg:text-xl font-bold text-stone-900 dark:text-stone-100 font-[family-name:var(--font-playfair)] leading-tight">
                  Lilliput SDA
                </span>
                <span className="text-[10px] lg:text-xs text-stone-500 dark:text-stone-400 tracking-wide uppercase leading-none">
                  St. James, Jamaica
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors relative py-1",
                    pathname === item.href
                      ? "text-amber-700 dark:text-amber-400"
                      : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200"
                  )}
                >
                  {item.label}
                  {pathname === item.href && (
                    <span className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-amber-600 dark:bg-amber-400 rounded-full" />
                  )}
                </Link>
              ))}
            </nav>

            {/* Desktop CTAs */}
            <div className="hidden lg:flex items-center gap-3">
              <DecisionCardTrigger variant="outline" size="sm">
                Decision Card
              </DecisionCardTrigger>
              <Link
                href="/visit"
                className="px-5 py-2.5 bg-amber-700 text-white rounded-lg text-sm font-medium hover:bg-amber-800 transition-colors"
              >
                Join Us
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 -mr-2 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 transition-colors"
              aria-label="Open menu"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu - Slide-out Drawer */}
      <div
        id="mobile-menu"
        className={cn(
          "fixed inset-0 z-50 lg:hidden",
          isMobileMenuOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
        aria-hidden={!isMobileMenuOpen}
      >
        {/* Backdrop */}
        <div
          className={cn(
            "absolute inset-0 bg-stone-900/50 transition-opacity duration-300",
            isMobileMenuOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />

        {/* Drawer */}
        <div
          className={cn(
            "absolute right-0 top-0 h-full w-72 max-w-[85vw] bg-white dark:bg-stone-900 shadow-xl transition-transform duration-300 ease-out flex flex-col",
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          )}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between p-4 border-b border-stone-200 dark:border-stone-800">
            <span className="text-sm font-medium text-stone-500 dark:text-stone-400">
              Menu
            </span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-2 py-4" aria-label="Mobile navigation">
            <div className="space-y-0.5">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                    pathname === item.href
                      ? "text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20"
                      : "text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
                  )}
                  aria-current={pathname === item.href ? "page" : undefined}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>

          {/* Drawer Footer */}
          <div className="p-4 border-t border-stone-200 dark:border-stone-800 space-y-2">
            <DecisionCardTrigger
              variant="outline"
              size="sm"
              className="w-full justify-center"
            >
              Decision Card
            </DecisionCardTrigger>
            <Link
              href="/visit"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-center px-4 py-2.5 bg-amber-700 text-white rounded-lg text-sm font-medium hover:bg-amber-800 transition-colors"
            >
              Join Us
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
