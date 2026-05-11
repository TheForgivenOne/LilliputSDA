"use client";

import { useEffect } from "react";
import { X, SlidersHorizontal, Check } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  label: string;
  icon?: LucideIcon;
}

interface FilterDrawerProps {
  categories: Category[];
  selected: string;
  onSelect: (id: string) => void;
  /** Controls drawer visibility. Parent owns state to allow the trigger to live elsewhere. */
  open: boolean;
  onClose: () => void;
  /** Singular noun for header (e.g., "ministry", "event"). */
  itemNoun?: string;
}

/**
 * Mobile bottom-sheet filter drawer. Pairs with a "Filters" trigger button.
 * Hidden on tablet+ (where the inline CategoryFilter pill row is shown instead).
 */
export function FilterDrawer({
  categories,
  selected,
  onSelect,
  open,
  onClose,
  itemNoun = "items",
}: FilterDrawerProps) {
  // Lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Esc to close.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div
      aria-hidden={!open}
      className={cn(
        "fixed inset-0 z-50 md:hidden transition-opacity",
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
      )}
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close filter"
        onClick={onClose}
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
      />

      {/* Sheet */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Filter ${itemNoun}`}
        className={cn(
          "absolute inset-x-0 bottom-0 bg-[var(--surface)] dark:bg-stone-900 rounded-t-2xl shadow-2xl",
          "max-h-[80vh] flex flex-col transition-transform duration-300 ease-out",
          open ? "translate-y-0" : "translate-y-full",
        )}
      >
        <div className="flex items-center justify-between p-5 border-b border-[var(--border-subtle)] dark:border-stone-800">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-[var(--primary)] dark:text-[var(--accent-lilac)]" />
            <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100 font-[family-name:var(--font-playfair)]">
              Filter {itemNoun}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5 text-stone-600 dark:text-stone-300" />
          </button>
        </div>

        <ul className="flex-1 overflow-y-auto p-3">
          {categories.map((c) => {
            const Icon = c.icon;
            const active = c.id === selected;
            return (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => {
                    onSelect(c.id);
                    onClose();
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-colors text-left",
                    active
                      ? "bg-[var(--primary)]/10 text-[var(--primary)] dark:text-[var(--accent-lilac)]"
                      : "text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800",
                  )}
                >
                  {Icon && <Icon className="w-5 h-5 flex-shrink-0" />}
                  <span className="flex-1 font-medium">{c.label}</span>
                  {active && <Check className="w-5 h-5 flex-shrink-0" />}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
