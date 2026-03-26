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
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/events", label: "Events", icon: Calendar },
  { href: "/dashboard/announcements", label: "Announcements", icon: Megaphone },
  { href: "/dashboard/staff", label: "Staff", icon: Users },
  { href: "/dashboard/ministries", label: "Ministries", icon: Briefcase },
  { href: "/dashboard/media", label: "Media", icon: Image },
  { href: "/dashboard/prayers", label: "Prayers", icon: Heart },
  { href: "/dashboard/contact", label: "Contact", icon: Mail },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-stone-900 text-white flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="p-2 hover:bg-stone-800 rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-bold text-lg">Admin</span>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-64 bg-stone-900 text-white flex flex-col z-50 transition-transform duration-300",
          "lg:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Mobile Close Button */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-stone-800">
          <span className="font-bold text-lg">Admin Menu</span>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="p-2 hover:bg-stone-800 rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Logo */}
        <div className="hidden lg:flex items-center gap-3 p-6 border-b border-stone-800">
          <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center font-bold text-xl">
            L
          </div>
          <div>
            <span className="font-bold text-lg block">Admin</span>
            <span className="text-xs text-stone-400">Lilliput SDA</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-1 px-3">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                      isActive
                        ? "bg-amber-600 text-white"
                        : "text-stone-300 hover:bg-stone-800 hover:text-white"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-stone-800">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 text-stone-400 hover:text-white transition-colors text-sm"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden lg:inline">Back to Site</span>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
