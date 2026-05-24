"use client";

import Link from "next/link";
import {
  Calendar,
  Megaphone,
  Users,
  Mail,
  Heart,
  Clock,
  ArrowRight,
  ClipboardList,
  Image,
} from "lucide-react";
import { format } from "date-fns";
import { useFetch } from "@/hooks/useData";

type DashboardEvent = {
  id: string;
  title: string;
  startDate: string;
  location?: string;
  category: string;
};

type DashboardAnnouncement = {
  id: string;
  title: string;
  content: string;
  isPinned: boolean;
};

type DashboardMinistry = {
  id: string;
  name: string;
  meetingTime?: string;
  category: string;
};

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

const categoryColors: Record<string, string> = {
  youth: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
  service: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  special: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
  community: "bg-stone-100 text-stone-600 dark:bg-stone-700 dark:text-stone-300",
};

export default function DashboardPage() {
  const { data: events } = useFetch<DashboardEvent[]>("/api/events?upcoming=true&limit=5");
  const { data: announcements } = useFetch<DashboardAnnouncement[]>("/api/announcements?limit=5");
  const { data: staff } = useFetch<{ id: string }[]>("/api/staff?active=true");
  const { data: ministries } = useFetch<DashboardMinistry[]>("/api/ministries");
  const { data: contactSubmissions } = useFetch<{ id: string }[]>("/api/contact");
  const { data: decisions } = useFetch<{ id: string }[]>("/api/decision");

  const stats = [
    { label: "Upcoming Events", count: events?.length ?? 0, icon: Calendar, href: "/dashboard/events", color: "from-amber-400 to-amber-500" },
    { label: "Announcements", count: announcements?.length ?? 0, icon: Megaphone, href: "/dashboard/announcements", color: "from-amber-400 to-amber-500" },
    { label: "Staff Members", count: staff?.length ?? 0, icon: Users, href: "/dashboard/staff", color: "from-emerald-400 to-teal-500" },
    { label: "Contact Requests", count: contactSubmissions?.length ?? 0, icon: Mail, href: "/dashboard/contact", color: "from-stone-400 to-stone-500" },
    { label: "Decisions", count: decisions?.length ?? 0, icon: ClipboardList, href: "/dashboard/decisions", color: "from-amber-400 to-amber-500" },
  ];

  const quickActions = [
    { label: "Add Event", href: "/dashboard/events/new", icon: Calendar },
    { label: "Announcement", href: "/dashboard/announcements/new", icon: Megaphone },
    { label: "Add Staff", href: "/dashboard/staff/new", icon: Users },
    { label: "Upload Media", href: "/dashboard/media", icon: Image },
  ];

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div>
        <h1 className="text-3xl font-black font-serif text-stone-900 dark:text-stone-100 tracking-tight">
          {getGreeting()} 👋
        </h1>
        <p className="text-stone-500 dark:text-stone-400 mt-1 text-sm">
          Here&apos;s what&apos;s happening at Lilliput SDA today.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.href}
              href={stat.href}
              className="group bg-white dark:bg-stone-900 rounded-2xl p-5 border border-stone-200 dark:border-stone-700 hover:border-[var(--primary)] hover:-translate-y-0.5 hover:shadow-md dark:hover:border-amber-500/50 transition-all duration-200"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 shadow-sm`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-3xl font-black font-serif text-stone-900 dark:text-stone-100 leading-none">
                {stat.count}
              </p>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1.5 font-medium">{stat.label}</p>
              <ArrowRight className="w-3.5 h-3.5 text-stone-300 group-hover:text-[var(--primary)] mt-2 transition-colors duration-200" />
            </Link>
          );
        })}
      </div>

      {/* Quick Actions + Events */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-stone-400 dark:text-stone-500 mb-3">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.href}
                  href={action.href}
                  className="group flex flex-col items-center justify-center gap-2 p-4 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-700 hover:border-[var(--primary)] hover:shadow-sm dark:hover:border-amber-500/50 transition-all duration-200 text-center"
                >
                  <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30 flex items-center justify-center group-hover:bg-[var(--primary)] group-hover:border-[var(--primary)] transition-all duration-200">
                    <Icon className="w-4 h-4 text-amber-600 group-hover:text-[#1B1A2E] transition-colors duration-200" />
                  </div>
                  <span className="text-xs font-semibold text-stone-700 dark:text-stone-300 leading-tight">
                    {action.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold uppercase tracking-widest text-stone-400 dark:text-stone-500">
              Upcoming Events
            </h2>
            <Link href="/dashboard/events" className="text-xs font-semibold text-[var(--primary)] hover:underline">
              View all
            </Link>
          </div>
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-700 overflow-hidden shadow-sm">
            {events && events.length > 0 ? (
              <div className="divide-y divide-stone-100 dark:divide-stone-800">
                {events.slice(0, 5).map((event) => (
                  <div key={event.id} className="p-4 flex items-center gap-4 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
                    <div className="flex-shrink-0 text-center bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30 rounded-xl px-3 py-2 min-w-[52px]">
                      <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">
                        {format(new Date(event.startDate), "MMM")}
                      </p>
                      <p className="text-xl font-black font-serif text-amber-700 dark:text-amber-400 leading-none mt-0.5">
                        {format(new Date(event.startDate), "d")}
                      </p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-stone-900 dark:text-stone-100 truncate text-sm">
                        {event.title}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-stone-400 dark:text-stone-500 mt-0.5">
                        <Clock className="w-3 h-3" />
                        <span>{format(new Date(event.startDate), "h:mm a")}</span>
                        {event.location && (
                          <>
                            <span>·</span>
                            <span className="truncate">{event.location}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full flex-shrink-0 ${categoryColors[event.category] ?? categoryColors.community}`}>
                      {event.category}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-10 text-center text-stone-400 dark:text-stone-500 text-sm">
                No upcoming events
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Announcements + Ministries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Announcements */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold uppercase tracking-widest text-stone-400 dark:text-stone-500">
              Recent Announcements
            </h2>
            <Link href="/dashboard/announcements" className="text-xs font-semibold text-[var(--primary)] hover:underline">
              View all
            </Link>
          </div>
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-700 overflow-hidden shadow-sm">
            {announcements && announcements.length > 0 ? (
              <div className="divide-y divide-stone-100 dark:divide-stone-800">
                {announcements.slice(0, 5).map((a) => (
                  <div key={a.id} className="p-4 flex items-start gap-3 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Megaphone className="w-3.5 h-3.5 text-amber-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-stone-900 dark:text-stone-100 truncate text-sm">
                          {a.title}
                        </p>
                        {a.isPinned && (
                          <span className="flex-shrink-0 px-1.5 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded-full">
                            Pinned
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-400 dark:text-stone-500 line-clamp-2 mt-0.5">
                        {a.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-10 text-center text-stone-400 dark:text-stone-500 text-sm">
                No announcements
              </div>
            )}
          </div>
        </div>

        {/* Ministries */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold uppercase tracking-widest text-stone-400 dark:text-stone-500">
              Ministries
            </h2>
            <Link href="/dashboard/ministries" className="text-xs font-semibold text-[var(--primary)] hover:underline">
              View all
            </Link>
          </div>
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-700 overflow-hidden shadow-sm">
            {ministries && ministries.length > 0 ? (
              <div className="divide-y divide-stone-100 dark:divide-stone-800">
                {ministries.slice(0, 5).map((m) => (
                  <div key={m.id} className="p-4 flex items-center gap-3 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/30 flex items-center justify-center flex-shrink-0">
                      <Heart className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-stone-900 dark:text-stone-100 text-sm truncate">
                        {m.name}
                      </p>
                      {m.meetingTime && (
                        <p className="text-xs text-stone-400 dark:text-stone-500">{m.meetingTime}</p>
                      )}
                    </div>
                    {m.category && (
                      <span className="flex-shrink-0 px-2 py-0.5 text-[10px] font-semibold bg-stone-100 text-stone-600 dark:bg-stone-700 dark:text-stone-300 rounded-full">
                        {m.category}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-10 text-center text-stone-400 dark:text-stone-500 text-sm">
                No ministries
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
