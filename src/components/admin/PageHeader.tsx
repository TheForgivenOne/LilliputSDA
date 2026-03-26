"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: Breadcrumb[];
  actions?: ReactNode;
  count?: number;
  badge?: {
    label: string;
    variant?: "default" | "success" | "warning" | "danger" | "info";
  };
  backHref?: string;
  className?: string;
}

const badgeVariants = {
  default: "bg-stone-100 text-stone-700 dark:bg-stone-700 dark:text-stone-300",
  success: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  warning: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  danger: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
  info: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
};

export function PageHeader({
  title,
  description,
  breadcrumbs,
  actions,
  count,
  badge,
  backHref,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("mb-6", className)}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-2 text-sm text-stone-500 dark:text-stone-400 mb-3" aria-label="Breadcrumb">
          {breadcrumbs.map((crumb, index) => (
            <span key={index} className="flex items-center gap-2">
              {index > 0 && <ChevronLeft className="w-4 h-4 rotate-180" />}
              {crumb.href ? (
                <Link
                  href={crumb.href}
                  className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-stone-700 dark:text-stone-300 font-medium">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          {backHref && (
            <Link
              href={backHref}
              className="flex-shrink-0 p-2 -ml-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              aria-label="Go back"
            >
              <ChevronLeft className="w-5 h-5 text-stone-500" />
            </Link>
          )}
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">{title}</h1>
              {count !== undefined && (
                <span className="inline-flex items-center justify-center min-w-[28px] h-7 px-2 text-sm font-semibold bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400 rounded-full">
                  {count}
                </span>
              )}
              {badge && (
                <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", badgeVariants[badge.variant || "default"])}>
                  {badge.label}
                </span>
              )}
            </div>
            {description && (
              <p className="text-stone-600 dark:text-stone-400 mt-1">{description}</p>
            )}
          </div>
        </div>
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>
    </div>
  );
}
