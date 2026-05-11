"use client";

import { Home, Compass, MapPin, Mail } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  icon: typeof Home;
  label: string;
  matchPrefix?: string;
}

const NAV: NavItem[] = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/ministries", icon: Compass, label: "Explore", matchPrefix: "/ministries" },
  { href: "/visit", icon: MapPin, label: "Visit", matchPrefix: "/visit" },
  { href: "/contact", icon: Mail, label: "Contact", matchPrefix: "/contact" },
];

export function MobileBottomBar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary mobile"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-t border-stone-200 dark:border-stone-800 shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.08)] md:hidden"
    >
      <ul className="grid grid-cols-4 h-16">
        {NAV.map(({ href, icon: Icon, label, matchPrefix }) => {
          const active = matchPrefix
            ? pathname.startsWith(matchPrefix)
            : pathname === href;
          return (
            <li key={href} className="contents">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex flex-col items-center justify-center gap-1 transition-colors",
                  active
                    ? "text-[var(--primary)] dark:text-[var(--accent-lilac)]"
                    : "text-stone-600 dark:text-stone-400 hover:text-[var(--primary)] dark:hover:text-[var(--accent-lilac)]",
                )}
              >
                <Icon className="w-5 h-5" strokeWidth={active ? 2.4 : 2} />
                <span className={cn("text-[11px]", active ? "font-semibold" : "font-medium")}>
                  {label}
                </span>
                {active && (
                  <span
                    aria-hidden
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-[var(--primary)] dark:bg-[var(--accent-lilac)]"
                  />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
