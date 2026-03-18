"use client";

import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  label?: string;
  title: string;
  href?: string;
  linkText?: string;
  icon?: LucideIcon;
  className?: string;
}

export function SectionHeader({
  label,
  title,
  href,
  linkText = "View All",
  icon: Icon,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12",
        className
      )}
    >
      <div className="flex items-start gap-4">
        {Icon && (
          <div className="hidden sm:flex p-3 bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-900/30 dark:to-amber-900/10 rounded-xl mt-1 shadow-sm">
            <Icon className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
        )}
        <div className="flex-1">
          {label && (
            <span className="inline-flex items-center gap-2 text-amber-600 dark:text-amber-400 font-semibold text-sm mb-3 block tracking-wider uppercase">
              <span className="w-8 h-0.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full" />
              {label}
            </span>
          )}
          <h2 className="text-4xl md:text-5xl font-black text-stone-900 dark:text-stone-100 leading-[1.1] font-[family-name:var(--font-playfair)]">
            {title}
          </h2>
        </div>
      </div>
      {href && (
        <Link
          href={href}
          className="inline-flex items-center gap-2 text-amber-600 dark:text-amber-400 font-semibold hover:underline group text-base self-start sm:self-end"
        >
          {linkText}
          <svg
            className="w-5 h-5 transition-transform group-hover:translate-x-1.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </Link>
      )}
    </div>
  );
}
