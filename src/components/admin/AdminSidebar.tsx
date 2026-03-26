"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Megaphone,
  Users,
  Briefcase,
  Image,
  Heart,
  Mail,
  Menu,
  X,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  badge?: number;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: "Overview",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    ],
  },
  {
    title: "Content",
    items: [
      { href: "/dashboard/events", label: "Events", icon: Calendar },
      { href: "/dashboard/announcements", label: "Announcements", icon: Megaphone },
      { href: "/dashboard/media", label: "Media", icon: Image },
    ],
  },
  {
    title: "People",
    items: [
      { href: "/dashboard/staff", label: "Staff", icon: Users },
      { href: "/dashboard/ministries", label: "Ministries", icon: Briefcase },
    ],
  },
  {
    title: "Communication",
    items: [
      { href: "/dashboard/prayers", label: "Prayer Requests", icon: Heart },
      { href: "/dashboard/contact", label: "Contact", icon: Mail },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    const stored = localStorage.getItem("sidebar-collapsed");
    if (stored) setIsCollapsed(stored === "true");
  }, []);

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", String(isCollapsed));
  }, [isCollapsed]);

  return (
    <>
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-stone-900 text-white flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="p-2 hover:bg-stone-800 rounded-lg transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-bold text-lg">Admin</span>
        </div>
        <UserButton />
      </div>

      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 h-full bg-stone-900 text-white flex flex-col z-50 transition-all duration-300",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          isCollapsed ? "lg:w-20" : "lg:w-64"
        )}
      >
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-stone-800">
          <span className="font-bold text-lg">Admin Menu</span>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="p-2 hover:bg-stone-800 rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className={cn(
          "hidden lg:flex items-center border-b border-stone-800 transition-all duration-300",
          isCollapsed ? "justify-center p-4" : "p-6"
        )}>
          {isCollapsed ? (
            <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center font-bold text-xl">
              L
            </div>
          ) : (
            <>
              <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center font-bold text-xl">
                L
              </div>
              <div className="ml-3">
                <span className="font-bold text-lg block">Admin</span>
                <span className="text-xs text-stone-400">Lilliput SDA</span>
              </div>
            </>
          )}
        </div>

        <nav className="flex-1 py-4 overflow-y-auto">
          {navSections.map((section, sectionIndex) => (
            <div key={section.title} className={cn("mb-4", sectionIndex === 0 && "pt-2")}>
              {!isCollapsed && (
                <div className="px-4 mb-2">
                  <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                    {section.title}
                  </span>
                </div>
              )}
              <ul className={cn("space-y-1", isCollapsed && "px-2")}>
                {section.items.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setIsMobileOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors group relative",
                          isCollapsed && "justify-center px-2",
                          isActive
                            ? "bg-amber-600 text-white"
                            : "text-stone-300 hover:bg-stone-800 hover:text-white"
                        )}
                        title={isCollapsed ? item.label : undefined}
                      >
                        {isActive && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-amber-400 rounded-r-full" />
                        )}
                        <Icon className={cn("w-5 h-5 flex-shrink-0", isActive && "text-white")} />
                        {!isCollapsed && (
                          <>
                            <span className="flex-1">{item.label}</span>
                            {item.badge !== undefined && item.badge > 0 && (
                              <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-semibold bg-white/20 rounded-full">
                                {item.badge > 99 ? "99+" : item.badge}
                              </span>
                            )}
                          </>
                        )}
                        {isCollapsed && item.badge !== undefined && item.badge > 0 && (
                          <span className="absolute top-1 right-1 w-2 h-2 bg-amber-400 rounded-full" />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className={cn(
          "border-t border-stone-800 transition-all duration-300",
          isCollapsed ? "p-2" : "p-4"
        )}>
          <div className="flex items-center justify-between">
            {!isCollapsed ? (
              <div className="hidden lg:flex items-center gap-3">
                <UserButton />
                <div className="text-sm">
                  <p className="font-medium truncate max-w-[120px]">
                    {user?.fullName || user?.emailAddresses[0]?.emailAddress}
                  </p>
                  <p className="text-stone-400 text-xs">Admin</p>
                </div>
              </div>
            ) : (
              <div className="hidden lg:flex justify-center w-full">
                <UserButton />
              </div>
            )}
            <div className={cn("flex items-center", isCollapsed ? "gap-1" : "gap-2")}>
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg hover:bg-stone-800 transition-colors"
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {isCollapsed ? (
                  <ChevronRight className="w-4 h-4 text-stone-400" />
                ) : (
                  <ChevronLeft className="w-4 h-4 text-stone-400" />
                )}
              </button>
              <Link
                href="/"
                className={cn(
                  "flex items-center gap-2 text-stone-400 hover:text-white transition-colors text-sm",
                  isCollapsed && "justify-center w-8 h-8 lg:hidden"
                )}
                title="Back to Site"
              >
                <LogOut className="w-4 h-4" />
                {!isCollapsed && <span>Back to Site</span>}
              </Link>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
