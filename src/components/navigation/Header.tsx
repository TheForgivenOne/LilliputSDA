"use client";

import { useState, useEffect, useRef, KeyboardEvent, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Church, Menu, X, Phone, MapPin } from "lucide-react";
import { cn, throttle } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/ministries", label: "Ministries" },
  { href: "/media", label: "Media" },
  { href: "/events", label: "Events" },
  { href: "/contact", label: "Contact" },
];

function getPrefersReducedMotionSnapshot(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function subscribeReducedMotion(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const handler = () => callback();
  mediaQuery.addEventListener("change", handler);
  return () => mediaQuery.removeEventListener("change", handler);
}

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getPrefersReducedMotionSnapshot,
    getPrefersReducedMotionSnapshot
  );
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScroll = throttle(() => {
      setIsScrolled(window.scrollY > 20);
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
    const handleKeyDown = (e: KeyboardEvent | globalThis.KeyboardEvent) => {
      if (e.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (isMobileMenuOpen && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [isMobileMenuOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          isScrolled
            ? "bg-white/98 dark:bg-stone-900/98 backdrop-blur-xl shadow-lg shadow-stone-900/5"
            : "bg-white/90 dark:bg-stone-900/90 backdrop-blur-sm"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo with dramatic styling */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="p-2.5 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-lg shadow-amber-500/25 group-hover:shadow-amber-500/40 group-hover:scale-105 transition-all duration-300">
                <Church className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-stone-800 dark:text-stone-100 tracking-tight font-[family-name:var(--font-playfair)]">
                  Lilliput SDA
                </span>
                <span className="text-xs text-stone-500 dark:text-stone-400 -mt-0.5 tracking-wider uppercase">
                  St. James, Jamaica
                </span>
              </div>
            </Link>

            {/* Desktop Navigation with hover effects */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 relative group",
                    pathname === item.href
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
                  )}
                >
                  {item.label}
                  {/* Underline effect - respects reduced motion */}
                  <span className={cn(
                    "absolute bottom-1 left-4 right-4 h-0.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-transform duration-300 origin-left",
                    pathname === item.href ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                    prefersReducedMotion && "transition-none scale-x-100"
                  )} />
                  {pathname === item.href && (
                    <span className="absolute inset-0 bg-amber-50 dark:bg-amber-900/20 rounded-lg -z-10" />
                  )}
                </Link>
              ))}
            </nav>

            {/* Desktop CTA - Bold button */}
            <div className="hidden lg:flex items-center gap-3">
              <Link
                href="/contact"
                className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl font-semibold hover:from-amber-700 hover:to-amber-800 transition-all duration-300 shadow-lg shadow-amber-600/25 hover:shadow-amber-600/40 hover:-translate-y-0.5"
              >
                Join Us
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-3 rounded-xl text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" aria-hidden="true" />
              ) : (
                <Menu className="w-6 h-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <div
        ref={menuRef}
        id="mobile-menu"
        className={cn(
          "fixed inset-0 z-40 lg:hidden transition-opacity duration-300",
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Main navigation menu"
      >
        {/* Backdrop with blur */}
        <div
          className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />

        {/* Drawer with dramatic styling */}
        <div
          className={cn(
            "absolute top-0 right-0 h-full w-80 max-w-[85vw] bg-white dark:bg-stone-900 shadow-2xl transition-all duration-500 ease-out-expo",
            isMobileMenuOpen 
              ? "translate-x-0 opacity-100" 
              : "translate-x-full opacity-0",
            prefersReducedMotion && "transition-none translate-x-0 opacity-100"
          )}
        >
          <div className="flex flex-col h-full">
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-5 border-b border-stone-200 dark:border-stone-800">
              <span className="text-lg font-bold text-stone-800 dark:text-stone-100 font-[family-name:var(--font-playfair)]">
                Navigation
              </span>
              <button
                ref={closeButtonRef}
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-lg text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-stone-900"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" aria-hidden="true" />
              </button>
            </div>

            {/* Navigation Links with stagger animation */}
            <nav 
              className="flex-1 overflow-y-auto py-4" 
              role="navigation" 
              aria-label="Mobile navigation"
            >
              {navItems.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center px-6 py-4 min-h-[44px] text-base font-semibold transition-all duration-300 border-l-4",
                    "focus:outline-none focus:ring-2 focus:ring-inset focus:ring-amber-500 focus:bg-stone-50 dark:focus:bg-stone-800",
                    "animate-slide-in-right opacity-0",
                    prefersReducedMotion && "opacity-100 animate-none",
                    pathname === item.href
                      ? "text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-900/10 border-amber-500"
                      : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-50 dark:hover:bg-stone-800 border-transparent"
                  )}
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}
                  aria-current={pathname === item.href ? "page" : undefined}
                >
                  <span className="flex-1">{item.label}</span>
                  {pathname === item.href && (
                    <span className="w-2 h-2 bg-amber-500 rounded-full ml-2" aria-hidden="true" />
                  )}
                </Link>
              ))}
            </nav>

            {/* Quick Actions with gradient backgrounds */}
            <div className="p-5 border-t border-stone-200 dark:border-stone-800 space-y-3">
              <a
                href="https://maps.google.com/?q=Lilliput+SDA+Church+Montego+Bay+Jamaica"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-5 py-4 bg-stone-100 dark:bg-stone-800 rounded-xl text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
              >
                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                  <MapPin className="w-5 h-5 text-amber-600 dark:text-amber-400" aria-hidden="true" />
                </div>
                <span className="font-semibold">Get Directions</span>
              </a>
              <a
                href="tel:+18761234567"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl hover:from-amber-700 hover:to-amber-800 transition-all duration-300 shadow-lg shadow-amber-600/25"
              >
                <div className="p-2 bg-white/20 rounded-lg">
                  <Phone className="w-5 h-5" aria-hidden="true" />
                </div>
                <span className="font-semibold">Call Church</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
