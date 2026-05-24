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
  X,
  LogOut,
  ClipboardList,
  MessageSquare,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

const navGroups: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
    ],
  },
  {
    label: "Content",
    items: [
      { href: "/dashboard/events", label: "Events", icon: Calendar },
      { href: "/dashboard/announcements", label: "Announcements", icon: Megaphone },
      { href: "/dashboard/site-content", label: "Site Content", icon: Settings },
    ],
  },
  {
    label: "People",
    items: [
      { href: "/dashboard/staff", label: "Staff", icon: Users },
      { href: "/dashboard/ministries", label: "Ministries", icon: Briefcase },
    ],
  },
  {
    label: "Engage",
    items: [
      { href: "/dashboard/media", label: "Media", icon: Image },
      { href: "/dashboard/prayers", label: "Prayers", icon: Heart },
      { href: "/dashboard/contact", label: "Contact", icon: Mail },
      { href: "/dashboard/decisions", label: "Decisions", icon: ClipboardList },
      { href: "/dashboard/testimonials", label: "Testimonials", icon: MessageSquare },
    ],
  },
];

interface AdminSidebarProps {
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

export function AdminSidebar({ isMobileOpen, onMobileClose }: AdminSidebarProps) {
  const pathname = usePathname();

  const checkActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-64 flex flex-col z-50 transition-transform duration-300",
          "bg-[#1B1A2E]",
          "lg:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Mobile Header Row */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--primary)] to-amber-500 flex items-center justify-center font-serif font-black text-[#1B1A2E] text-base shadow-md">
              L
            </div>
            <span className="font-serif font-bold text-white text-lg leading-none">Lilliput</span>
          </div>
          <button
            onClick={onMobileClose}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 text-stone-400" />
          </button>
        </div>

        {/* Brand (Desktop) */}
        <div className="hidden lg:flex items-center gap-3 px-6 py-5 border-b border-white/10">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--primary)] to-amber-500 flex items-center justify-center font-serif font-black text-[#1B1A2E] text-lg shadow-lg shadow-amber-900/20 flex-shrink-0">
            L
          </div>
          <div>
            <span className="font-serif font-bold text-white text-base block leading-tight">Lilliput</span>
            <span className="text-[10px] uppercase tracking-widest text-stone-500 font-semibold">SDA Admin</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-2 overflow-y-auto">
          {navGroups.map((group) => (
            <div key={group.label} className="mb-1">
              <p className="px-5 pt-4 pb-1.5 text-[9px] uppercase tracking-[0.15em] font-bold text-stone-600">
                {group.label}
              </p>
              <ul className="px-3 space-y-0.5">
                {group.items.map((item) => {
                  const active = checkActive(item.href, item.exact);
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onMobileClose}
                        className={cn(
                          "relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 text-sm group",
                          active
                            ? "text-white bg-white/10"
                            : "text-stone-400 hover:text-white hover:bg-white/5"
                        )}
                      >
                        {active && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-[var(--primary)] rounded-r-full" />
                        )}
                        <Icon
                          className={cn(
                            "w-4 h-4 flex-shrink-0 transition-colors",
                            active ? "text-[var(--primary)]" : "group-hover:text-stone-200"
                          )}
                        />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-stone-500 hover:text-stone-200 transition-colors text-sm group"
          >
            <div className="p-1.5 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors flex-shrink-0">
              <LogOut className="w-3.5 h-3.5" />
            </div>
            <span>Back to Site</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
