"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Phone, MapPin, Mail, Heart, X } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ActionItem {
  href: string;
  external?: boolean;
  icon: typeof Plus;
  label: string;
}

const ACTIONS: ActionItem[] = [
  {
    href: "https://maps.google.com/?q=Lilliput+SDA+Church+Montego+Bay+Jamaica",
    external: true,
    icon: MapPin,
    label: "Directions",
  },
  { href: "tel:+18769521234", icon: Phone, label: "Call" },
  { href: "mailto:lhamilton@westjamaica.org", icon: Mail, label: "Email" },
  { href: "/contact#prayer", icon: Heart, label: "Prayer" },
];

/**
 * Floating action button (mobile-only) that fans out the four quick contact
 * actions previously crammed into the bottom nav. Sits bottom-right above the
 * MobileBottomBar (which is itself bottom: 0).
 */
export function QuickActionFAB() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  return (
    <div
      ref={containerRef}
      className="fixed right-4 bottom-20 z-40 flex flex-col items-end gap-3 md:hidden"
    >
      {ACTIONS.map((action, i) => {
        const Inner = (
          <span
            className={cn(
              "inline-flex items-center gap-2 pl-3 pr-4 py-2.5 rounded-full",
              "bg-white dark:bg-stone-800 shadow-lg shadow-black/10",
              "text-sm font-medium text-stone-800 dark:text-stone-100",
              "border border-stone-200 dark:border-stone-700",
              "transition-all duration-200",
              open
                ? "opacity-100 translate-y-0 pointer-events-auto"
                : "opacity-0 translate-y-2 pointer-events-none",
            )}
            style={{ transitionDelay: open ? `${i * 40}ms` : "0ms" }}
          >
            <action.icon className="w-4 h-4 text-[var(--primary)] dark:text-[var(--accent-lilac)]" />
            {action.label}
          </span>
        );

        return action.external ? (
          <a
            key={action.label}
            href={action.href}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={open ? 0 : -1}
            aria-hidden={!open}
            onClick={() => setOpen(false)}
          >
            {Inner}
          </a>
        ) : (
          <Link
            key={action.label}
            href={action.href}
            tabIndex={open ? 0 : -1}
            aria-hidden={!open}
            onClick={() => setOpen(false)}
          >
            {Inner}
          </Link>
        );
      })}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "Close quick actions" : "Open quick actions"}
        className={cn(
          "w-14 h-14 rounded-full flex items-center justify-center",
          "bg-[var(--primary)] text-white shadow-xl shadow-[rgba(59,58,143,0.40)]",
          "hover:bg-[var(--primary-hover)] active:scale-95",
          "transition-all duration-300",
          "focus:outline-none focus:ring-4 focus:ring-[var(--primary)]/40",
        )}
      >
        <span
          className={cn(
            "transition-transform duration-300",
            open ? "rotate-45" : "rotate-0",
          )}
        >
          {open ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
        </span>
      </button>
    </div>
  );
}
