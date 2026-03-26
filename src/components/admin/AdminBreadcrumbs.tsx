"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface AdminBreadcrumbsProps {
  items?: BreadcrumbItem[];
  homeHref?: string;
  className?: string;
}

const pathToLabel: Record<string, string> = {
  dashboard: "Dashboard",
  events: "Events",
  announcements: "Announcements",
  staff: "Staff",
  ministries: "Ministries",
  media: "Media",
  prayers: "Prayer Requests",
  contact: "Contact",
  new: "Create",
};

function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [];

  let currentPath = "";
  for (const segment of segments) {
    currentPath += `/${segment}`;

    const label = pathToLabel[segment] || segment;
    const isLast = segment === segments[segments.length - 1];
    const isId = /^[a-zA-Z0-9]{16,}$/.test(segment);

    if (isId) {
      breadcrumbs.push({ label: "Edit" });
    } else if (!isLast) {
      breadcrumbs.push({ label, href: currentPath });
    } else {
      breadcrumbs.push({ label });
    }
  }

  return breadcrumbs;
}

export function AdminBreadcrumbs({
  items,
  homeHref = "/dashboard",
  className,
}: AdminBreadcrumbsProps) {
  const pathname = usePathname();
  const breadcrumbs = items || generateBreadcrumbs(pathname);

  if (breadcrumbs.length === 0) return null;

  return (
    <nav
      className={cn("flex items-center gap-1.5 text-sm text-stone-500 dark:text-stone-400", className)}
      aria-label="Breadcrumb"
    >
      <Link
        href={homeHref}
        className="flex items-center justify-center w-7 h-7 rounded-md hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
        aria-label="Go to dashboard"
      >
        <Home className="w-4 h-4" />
      </Link>

      {breadcrumbs.map((crumb, index) => (
        <span key={index} className="flex items-center gap-1.5">
          <ChevronRight className="w-4 h-4 text-stone-300 dark:text-stone-600" />
          {crumb.href && index < breadcrumbs.length - 1 ? (
            <Link
              href={crumb.href}
              className="px-1.5 py-0.5 rounded hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-700 dark:hover:text-stone-300 transition-colors"
            >
              {crumb.label}
            </Link>
          ) : (
            <span className="px-1.5 py-0.5 font-medium text-stone-700 dark:text-stone-300">
              {crumb.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
