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
  const [scrollProgress, setScrollProgress] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = throttle(() => {
      const scrolled = window.scrollY;
      const threshold = 20;
      const progress = Math.min(scrolled / threshold, 1);
      setScrollProgress(progress);
    }, 16);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

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

  const p = scrollProgress;
  const scaleValue = 0.95 + (p * 0.05);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          p > 0.3 
            ? "bg-white/95 dark:bg-stone-900/95 backdrop-blur-xl shadow-lg shadow-stone-900/5 py-2" 
            : "bg-transparent py-4"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 lg:h-16">
            <Link href="/" className="flex items-center gap-3 group" aria-label="Lilliput SDA Church Home">
              <div 
                className="relative p-2 rounded-xl transition-all duration-500 ease-out"
                style={{
                  transform: `scale(${scaleValue})`,
                  background: p > 0.3 
                    ? "linear-gradient(135deg, rgba(245,158,11,0.9), rgba(249,115,22,0.9))"
                    : "rgba(255,255,255,0.9)",
                  boxShadow: p > 0.5 ? "0 10px 15px -3px rgba(245,158,11,0.3)" : "none",
                }}
              >
                <Image
                  src="/images/logos/logo-128.png"
                  alt="Lilliput SDA Church"
                  width={40}
                  height={40}
                  className="w-10 h-10 flex-shrink-0 object-contain transition-all duration-500 ease-out group-hover:scale-110"
                  style={{
                    filter: p < 0.5 ? "brightness(0)" : "brightness(1)",
                    opacity: p < 0.5 ? 0.9 : 1,
                  }}
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span 
                  className="text-lg lg:text-xl font-bold font-[family-name:var(--font-playfair)] leading-tight transition-all duration-500 ease-out"
                  style={{
                    color: p < 0.5 ? "rgba(255,255,255,1)" : "rgba(28,25,23,1)",
                    textShadow: p < 0.5 ? "0 2px 4px rgba(0,0,0,0.3)" : "none",
                  }}
                >
                  Lilliput SDA
                </span>
                <span 
                  className="text-[10px] lg:text-xs tracking-wide uppercase leading-none font-medium transition-all duration-500 ease-out"
                  style={{
                    color: p < 0.5 ? "rgba(255,255,255,0.8)" : "rgba(120,113,108,1)",
                    textShadow: p < 0.5 ? "0 1px 2px rgba(0,0,0,0.2)" : "none",
                  }}
                >
                  St. James, Jamaica
                </span>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300",
                    p > 0.3
                      ? pathname === item.href
                        ? "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20"
                        : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800"
                      : pathname === item.href
                        ? "text-amber-300 bg-white/10"
                        : "text-white/90 hover:text-white hover:bg-white/10"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="hidden lg:flex items-center gap-3">
              <DecisionCardTrigger 
                variant="ghost" 
                size="sm"
                className={cn(
                  "!bg-transparent",
                  p > 0.3 
                    ? "!text-stone-600 hover:!text-amber-600 dark:!text-stone-400 dark:hover:!text-amber-400"
                    : "!text-white/90 hover:!text-white hover:!bg-white/10"
                )}
              >
                Decision Card
              </DecisionCardTrigger>
              <Link
                href="/visit"
                className={cn(
                  "px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 shadow-lg hover:-translate-y-0.5 hover:shadow-xl",
                  p > 0.3
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-amber-500/25 hover:shadow-amber-500/40"
                    : "bg-white text-amber-600 shadow-white/20 hover:shadow-white/40"
                )}
              >
                Join Us
              </Link>
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 -mr-2 rounded-lg transition-all duration-500 ease-out"
              style={{
                color: p < 0.5 
                  ? `rgba(255,255,255,${1 - p * 0.2})`
                  : "rgba(28,25,23,1)",
              }}
              aria-label="Open menu"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      <div
        id="mobile-menu"
        className={cn(
          "fixed inset-0 z-50 lg:hidden",
          isMobileMenuOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
        aria-hidden={!isMobileMenuOpen}
      >
        <div
          className={cn(
            "absolute inset-0 bg-stone-900/80 backdrop-blur-sm transition-opacity duration-300",
            isMobileMenuOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />

        <div
          className={cn(
            "absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-white dark:bg-stone-900 shadow-2xl transition-transform duration-500 ease-out flex flex-col",
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          )}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <div className="flex items-center justify-between p-4 border-b border-stone-100 dark:border-stone-800">
            <span className="text-sm font-bold text-stone-900 dark:text-stone-100 font-[family-name:var(--font-playfair)]">
              Lilliput SDA
            </span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-lg text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 px-3 py-6" aria-label="Mobile navigation">
            <div className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center px-4 py-3.5 text-sm font-semibold rounded-xl transition-all duration-200",
                    pathname === item.href
                      ? "text-amber-600 dark:text-amber-400 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30"
                      : "text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800"
                  )}
                  aria-current={pathname === item.href ? "page" : undefined}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>

          <div className="p-4 border-t border-stone-100 dark:border-stone-800 space-y-3">
            <DecisionCardTrigger
              variant="outline"
              size="sm"
              className="w-full justify-center !rounded-xl"
            >
              Decision Card
            </DecisionCardTrigger>
            <Link
              href="/visit"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-center px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold text-sm shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all"
            >
              Join Us
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}