"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface AnchorPillItem {
  /** id of the target section element (must match an element's id in the page) */
  id: string;
  label: string;
}

interface AnchorPillNavProps {
  items: AnchorPillItem[];
  /** Sticky offset from top in px. Should equal the fixed header height. */
  offset?: number;
  className?: string;
}

/**
 * Sticky horizontal pill nav for long pages (Home, About, Visit).
 * Highlights the currently-visible section via IntersectionObserver.
 * Mobile: horizontal scroll-snap with edge-fade affordance.
 * Tablet+: same row centered, no scroll.
 */
export function AnchorPillNav({ items, offset = 64, className }: AnchorPillNavProps) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? "");
  const containerRef = useRef<HTMLDivElement>(null);
  const activePillRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              setActiveId(id);
            }
          }
        },
        {
          rootMargin: `-${offset + 8}px 0px -55% 0px`,
          threshold: 0,
        },
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [items, offset]);

  // Keep the active pill in view on mobile horizontal scroll.
  useEffect(() => {
    const pill = activePillRef.current;
    if (!pill || !containerRef.current) return;
    pill.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [activeId]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - offset - 8;
    window.scrollTo({ top: y, behavior: "smooth" });
    setActiveId(id);
  };

  return (
    <div
      className={cn(
        "sticky z-30 bg-[var(--background)]/85 backdrop-blur-md border-b border-[var(--border-subtle)]",
        className,
      )}
      style={{ top: offset }}
    >
      <div
        ref={containerRef}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div
          className="flex gap-2 overflow-x-auto scrollbar-hide py-3 -mx-1 px-1 lg:justify-center"
          role="navigation"
          aria-label="Section navigation"
        >
          {items.map(({ id, label }) => {
            const active = id === activeId;
            return (
              <a
                key={id}
                ref={active ? activePillRef : undefined}
                href={`#${id}`}
                onClick={(e) => handleClick(e, id)}
                aria-current={active ? "true" : undefined}
                className={cn(
                  "flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
                  active
                    ? "bg-[var(--primary)] text-white shadow-md shadow-[rgba(59,58,143,0.25)]"
                    : "bg-[var(--surface)] text-[var(--foreground)] hover:bg-[var(--primary)]/10 border border-[var(--border-subtle)]",
                )}
              >
                {label}
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
