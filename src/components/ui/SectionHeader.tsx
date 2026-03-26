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
  align?: "left" | "center";
}

export function SectionHeader({
  label,
  title,
  href,
  linkText = "View All",
  icon: Icon,
  className,
  align = "left",
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12",
        align === "center" && "text-center items-center",
        className
      )}
    >
      <div className={cn("flex items-start gap-4", align === "center" && "flex-col items-center")}>
        {Icon && (
          <div className="hidden sm:flex p-3 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl mt-1 shadow-lg shadow-amber-500/25">
            <Icon className="w-5 h-5 text-white" />
          </div>
        )}
        <div className="flex-1">
          {label && (
            <span className="inline-flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm mb-3 block tracking-widest uppercase">
              <span className={cn("w-8 h-0.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full", align === "center" && "hidden")} />
              {label}
              <span className={cn("w-8 h-0.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full", align === "left" && "hidden")} />
            </span>
          )}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-stone-900 dark:text-stone-100 leading-[1.05] font-[family-name:var(--font-playfair)] tracking-tight">
            {title}
          </h2>
        </div>
      </div>
      {href && (
        <Link
          href={href}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:-translate-y-0.5 transition-all duration-200 group text-sm self-start sm:self-end"
        >
          {linkText}
          <svg
            className="w-4 h-4 transition-transform group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </Link>
      )}
    </div>
  );
}
