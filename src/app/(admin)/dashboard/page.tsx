"use client";

import Link from "next/link";
import {
  Calendar,
  Megaphone,
  Users,
  Mail,
  Clock,
  ArrowRight,
  Bell,
  TrendingUp,
  Plus,
  Upload,
  User,
} from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { format } from "date-fns";
import { useUser } from "@clerk/nextjs";
import { AdminBreadcrumbs } from "@/components/admin/AdminBreadcrumbs";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: number;
  icon: typeof Calendar;
  href: string;
  color: "amber" | "blue" | "green" | "purple" | "rose";
  trend?: { value: number; label: string };
}

const colorStyles: Record<string, { bg: string; text: string; icon: string; iconBg: string }> = {
  amber: { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-600", icon: "bg-amber-500", iconBg: "bg-amber-500/10" },
  blue: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-600", icon: "bg-blue-500", iconBg: "bg-blue-500/10" },
  green: { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-600", icon: "bg-green-500", iconBg: "bg-green-500/10" },
  purple: { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-600", icon: "bg-purple-500", iconBg: "bg-purple-500/10" },
  rose: { bg: "bg-rose-100 dark:bg-rose-900/30", text: "text-rose-600", icon: "bg-rose-500", iconBg: "bg-rose-500/10" },
};

function StatCard({ label, value, icon: Icon, href, color, trend }: StatCardProps) {
  const style = colorStyles[color];
  
  return (
    <Link
      href={href}
      className="bg-white dark:bg-stone-800 rounded-xl p-5 border border-stone-200 dark:border-stone-700 hover:border-amber-500 dark:hover:border-amber-500 transition-all duration-200 group"
    >
      <div className="flex items-start justify-between">
        <div className={cn("p-2.5 rounded-lg", style.iconBg)}>
          <Icon className={cn("w-5 h-5", style.text)} />
        </div>
        <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all" />
      </div>
      <div className="mt-4">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-stone-900 dark:text-stone-100">{value}</span>
          {trend && (
            <span className="text-xs font-medium text-green-600 dark:text-green-400 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" />
              {trend.value}%
            </span>
          )}
        </div>
        <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">{label}</p>
      </div>
    </Link>
  );
}

function QuickAction({ label, href, icon: Icon }: { label: string; href: string; icon: typeof Plus }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 p-3 rounded-lg hover:bg-stone-50 dark:hover:bg-stone-700/50 transition-colors group"
    >
      <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
        <Icon className="w-4 h-4 text-amber-600" />
      </div>
      <span className="text-sm font-medium text-stone-700 dark:text-stone-300 group-hover:text-amber-600 dark:group-hover:text-amber-400">
        {label}
      </span>
    </Link>
  );
}

export default function DashboardPage() {
  const { user } = useUser();
  
  const events = useQuery(api.events.queries.listUpcoming);
  const announcements = useQuery(api.announcements.queries.listLatest);
  const staff = useQuery(api.staff.queries.listAll);
  const ministries = useQuery(api.ministries.queries.listAll);
  const contactSubmissions = useQuery(api.contact.queries.listAll);
  const prayers = useQuery(api.prayerRequests.queries.listPublic);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const userName = user?.firstName || user?.emailAddresses[0]?.emailAddress?.split("@")[0] || "Admin";

  const unreadContacts = contactSubmissions?.filter((c) => !c.isRead).length || 0;
  const pendingPrayers = prayers?.filter((p) => !p.isAnswered).length || 0;

  return (
    <div className="space-y-6">
      <AdminBreadcrumbs />

      <div className="bg-gradient-to-r from-amber-600 to-amber-700 rounded-xl p-6 text-white">
        <p className="text-amber-100 text-sm font-medium">{getGreeting()}</p>
        <h1 className="text-2xl font-bold mt-1">Welcome back, {userName}</h1>
        <p className="text-amber-100/80 text-sm mt-2">
          Here&apos;s what&apos;s happening with your church website today.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Upcoming Events" value={events?.length || 0} icon={Calendar} href="/dashboard/events" color="amber" />
        <StatCard label="Announcements" value={announcements?.length || 0} icon={Bell} href="/dashboard/announcements" color="blue" />
        <StatCard label="Staff Members" value={staff?.length || 0} icon={Users} href="/dashboard/staff" color="green" />
        <StatCard label="Unread Messages" value={unreadContacts} icon={Mail} href="/dashboard/contact" color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 p-5">
            <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 gap-2">
              <QuickAction label="Add Event" href="/dashboard/events/new" icon={Plus} />
              <QuickAction label="Announcement" href="/dashboard/announcements/new" icon={Bell} />
              <QuickAction label="Add Staff" href="/dashboard/staff/new" icon={User} />
              <QuickAction label="Upload Media" href="/dashboard/media" icon={Upload} />
            </div>
          </div>

          <div className="bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 p-5">
            <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-4">
              At a Glance
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-stone-600 dark:text-stone-400">Ministries</span>
                <span className="text-sm font-semibold text-stone-900 dark:text-stone-100">{ministries?.length || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-stone-600 dark:text-stone-400">Pending Prayers</span>
                <span className="text-sm font-semibold text-stone-900 dark:text-stone-100">{pendingPrayers}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-stone-600 dark:text-stone-400">Total Staff</span>
                <span className="text-sm font-semibold text-stone-900 dark:text-stone-100">{staff?.length || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-stone-600 dark:text-stone-400">Active Events</span>
                <span className="text-sm font-semibold text-stone-900 dark:text-stone-100">{events?.length || 0}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 overflow-hidden">
            <div className="px-5 py-4 border-b border-stone-200 dark:border-stone-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                  Upcoming Events
                </h2>
                <Link href="/dashboard/events" className="text-sm text-amber-600 hover:text-amber-700 font-medium">
                  View all
                </Link>
              </div>
            </div>
            {events && events.length > 0 ? (
              <div className="divide-y divide-stone-100 dark:divide-stone-700">
                {events.slice(0, 4).map((event) => (
                  <div key={event._id} className="px-5 py-4 flex items-center gap-4 hover:bg-stone-50 dark:hover:bg-stone-700/30 transition-colors">
                    <div className="text-center bg-amber-100 dark:bg-amber-900/30 rounded-lg p-2.5 min-w-[56px]">
                      <p className="text-xs font-medium text-amber-600 uppercase">
                        {format(new Date(event.startDate), "MMM")}
                      </p>
                      <p className="text-lg font-bold text-amber-700 dark:text-amber-400">
                        {format(new Date(event.startDate), "d")}
                      </p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-stone-900 dark:text-stone-100 truncate">
                        {event.title}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-stone-500 dark:text-stone-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{format(new Date(event.startDate), "h:mm a")}</span>
                        {event.location && (
                          <>
                            <span>•</span>
                            <span className="truncate">{event.location}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <span className={cn(
                      "px-2 py-1 text-xs font-medium rounded-full",
                      event.category === "youth" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                      event.category === "service" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                      "bg-stone-100 text-stone-700 dark:bg-stone-700 dark:text-stone-300"
                    )}>
                      {event.category}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <Calendar className="w-10 h-10 mx-auto text-stone-300 dark:text-stone-600 mb-3" />
                <p className="text-stone-500 dark:text-stone-400">No upcoming events</p>
                <Link href="/dashboard/events/new" className="text-sm text-amber-600 hover:text-amber-700 font-medium mt-2 inline-block">
                  Create your first event
                </Link>
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 overflow-hidden">
            <div className="px-5 py-4 border-b border-stone-200 dark:border-stone-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                  Recent Announcements
                </h2>
                <Link href="/dashboard/announcements" className="text-sm text-amber-600 hover:text-amber-700 font-medium">
                  View all
                </Link>
              </div>
            </div>
            {announcements && announcements.length > 0 ? (
              <div className="divide-y divide-stone-100 dark:divide-stone-700">
                {announcements.slice(0, 3).map((announcement) => {
                  const Icon = announcement.priority === "high" ? Bell : Megaphone;
                  return (
                    <div key={announcement._id} className="px-5 py-4 hover:bg-stone-50 dark:hover:bg-stone-700/30 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "p-2 rounded-lg",
                          announcement.priority === "high" ? "bg-rose-100 dark:bg-rose-900/30" : "bg-blue-100 dark:bg-blue-900/30"
                        )}>
                          <Icon className={cn("w-4 h-4", announcement.priority === "high" ? "text-rose-600" : "text-blue-600")} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-stone-900 dark:text-stone-100 truncate">
                              {announcement.title}
                            </p>
                            {announcement.isPinned && (
                              <span className="px-1.5 py-0.5 text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded">
                                Pinned
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-stone-500 dark:text-stone-400 line-clamp-1 mt-1">
                            {announcement.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center">
                <Megaphone className="w-10 h-10 mx-auto text-stone-300 dark:text-stone-600 mb-3" />
                <p className="text-stone-500 dark:text-stone-400">No announcements</p>
                <Link href="/dashboard/announcements/new" className="text-sm text-amber-600 hover:text-amber-700 font-medium mt-2 inline-block">
                  Create your first announcement
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
