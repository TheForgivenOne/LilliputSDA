"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

const pathLabels: Record<string, string> = {
  "/dashboard": "Overview",
  "/dashboard/events": "Events",
  "/dashboard/announcements": "Announcements",
  "/dashboard/staff": "Staff",
  "/dashboard/ministries": "Ministries",
  "/dashboard/media": "Media",
  "/dashboard/prayers": "Prayers",
  "/dashboard/contact": "Contact",
  "/dashboard/decisions": "Decisions",
  "/dashboard/testimonials": "Testimonials",
  "/dashboard/site-content": "Site Content",
};

function getPageLabel(pathname: string): string {
  if (pathLabels[pathname]) return pathLabels[pathname];
  const segments = pathname.split("/").filter(Boolean);
  const last = segments[segments.length - 1];
  if (!last) return "Dashboard";
  const mapped = pathLabels[`/dashboard/${last}`];
  if (mapped) return mapped;
  return last.charAt(0).toUpperCase() + last.slice(1).replace(/-/g, " ");
}

function getInitials(name?: string | null): string {
  if (!name) return "A";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "A";
  return ((parts[0][0] ?? "") + (parts[parts.length - 1][0] ?? "")).toUpperCase();
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((session) => {
        if (!session?.user) {
          router.push("/sign-in?callbackUrl=/dashboard");
        } else if (session.user.role !== "admin") {
          router.push("/");
        } else {
          setAuthorized(true);
          setUserName(session.user.name ?? session.user.email ?? null);
        }
      })
      .catch(() => {
        router.push("/sign-in?callbackUrl=/dashboard");
      });
  }, [router]);

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-stone-200 border-t-[var(--primary)] rounded-full animate-spin" />
          <p className="text-stone-400 text-sm font-medium">Loading…</p>
        </div>
      </div>
    );
  }

  const pageLabel = getPageLabel(pathname);
  const initials = getInitials(userName);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <AdminSidebar isMobileOpen={isMobileOpen} onMobileClose={() => setIsMobileOpen(false)} />

      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-16 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border-b border-stone-200/80 dark:border-stone-800 flex items-center justify-between px-4 lg:px-6 gap-4">
          <div className="flex items-center gap-3">
            {/* Hamburger — mobile only */}
            <button
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden p-2 -ml-1 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5 text-stone-600 dark:text-stone-400" />
            </button>

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-stone-500 dark:text-stone-400">
              <span className="hidden lg:inline">Admin</span>
              <span className="hidden lg:inline text-stone-300 dark:text-stone-600">/</span>
              <span className="font-semibold text-stone-900 dark:text-stone-100">{pageLabel}</span>
            </div>
          </div>

          {/* Right: user avatar */}
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--primary)] to-amber-500 flex items-center justify-center text-[#1B1A2E] text-xs font-bold shadow-sm cursor-default select-none"
              title={userName ?? "Admin"}
            >
              {initials}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
