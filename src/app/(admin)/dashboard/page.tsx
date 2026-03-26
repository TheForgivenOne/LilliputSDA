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
} from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { format } from "date-fns";
import { PageHeader } from "@/components/admin/PageHeader";
import { AdminBreadcrumbs } from "@/components/admin/AdminBreadcrumbs";

const statCards = [
  { label: "Upcoming Events", icon: Calendar, href: "/dashboard/events", color: "amber" },
  { label: "Active Announcements", icon: Megaphone, href: "/dashboard/announcements", color: "blue" },
  { label: "Staff Members", icon: Users, href: "/dashboard/staff", color: "green" },
  { label: "Contact Submissions", icon: Mail, href: "/dashboard/contact", color: "purple" },
];

const quickActions = [
  { label: "Add Event", href: "/dashboard/events/new", icon: Calendar },
  { label: "Add Announcement", href: "/dashboard/announcements/new", icon: Megaphone },
  { label: "Add Staff", href: "/dashboard/staff/new", icon: Users },
  { label: "Upload Media", href: "/dashboard/media", icon: Heart },
];

export default function DashboardPage() {
  const events = useQuery(api.events.queries.listUpcoming);
  const announcements = useQuery(api.announcements.queries.listLatest);
  const staff = useQuery(api.staff.queries.listAll);
  const ministries = useQuery(api.ministries.queries.listAll);

  const colorStyles: Record<string, { bg: string; text: string; icon: string }> = {
    amber: { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-600", icon: "bg-amber-500" },
    blue: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-600", icon: "bg-blue-500" },
    green: { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-600", icon: "bg-green-500" },
    purple: { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-600", icon: "bg-purple-500" },
  };

  return (
    <div className="space-y-8">
      <AdminBreadcrumbs />

      <PageHeader
        title="Dashboard"
        description="Welcome back! Here's an overview of your church website."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const style = colorStyles[stat.color];
          const Icon = stat.icon;
          let count = 0;
          if (stat.label.includes("Events") && events) count = events.length;
          if (stat.label.includes("Announcements") && announcements) count = announcements.length;
          if (stat.label.includes("Staff") && staff) count = staff.length;

          return (
            <Link
              key={stat.href}
              href={stat.href}
              className="bg-white dark:bg-stone-800 rounded-xl p-6 border border-stone-200 dark:border-stone-700 hover:border-amber-500 dark:hover:border-amber-500 transition-colors group"
            >
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-lg ${style.bg}`}>
                  <Icon className={`w-6 h-6 ${style.text}`} />
                </div>
                <ArrowRight className="w-5 h-5 text-stone-400 group-hover:text-amber-500 transition-colors" />
              </div>
              <p className="mt-4 text-3xl font-bold text-stone-900 dark:text-stone-100">
                {count}
              </p>
              <p className="text-sm text-stone-500 dark:text-stone-400">{stat.label}</p>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-4">
            Quick Actions
          </h2>
          <div className="bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 overflow-hidden">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.href}
                  href={action.href}
                  className={`flex items-center gap-4 p-4 hover:bg-stone-50 dark:hover:bg-stone-700/50 transition-colors ${
                    index !== quickActions.length - 1
                      ? "border-b border-stone-200 dark:border-stone-700"
                      : ""
                  }`}
                >
                  <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                    <Icon className="w-5 h-5 text-amber-600" />
                  </div>
                  <span className="font-medium text-stone-900 dark:text-stone-100">
                    {action.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
              Upcoming Events
            </h2>
            <Link
              href="/dashboard/events"
              className="text-sm text-amber-600 hover:text-amber-700 font-medium"
            >
              View all
            </Link>
          </div>
          <div className="bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 overflow-hidden">
            {events && events.length > 0 ? (
              <div className="divide-y divide-stone-200 dark:divide-stone-700">
                {events.slice(0, 5).map((event) => (
                  <div key={event._id} className="p-4 flex items-center gap-4">
                    <div className="flex-shrink-0 text-center bg-amber-100 dark:bg-amber-900/30 rounded-lg p-3">
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
                        <Clock className="w-4 h-4" />
                        <span>{format(new Date(event.startDate), "h:mm a")}</span>
                        {event.location && (
                          <>
                            <span>•</span>
                            <span className="truncate">{event.location}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        event.category === "youth"
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                          : event.category === "service"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-stone-100 text-stone-700 dark:bg-stone-700 dark:text-stone-300"
                      }`}
                    >
                      {event.category}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-stone-500 dark:text-stone-400">
                No upcoming events
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
              Recent Announcements
            </h2>
            <Link
              href="/dashboard/announcements"
              className="text-sm text-amber-600 hover:text-amber-700 font-medium"
            >
              View all
            </Link>
          </div>
          <div className="bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 overflow-hidden">
            {announcements && announcements.length > 0 ? (
              <div className="divide-y divide-stone-200 dark:divide-stone-700">
                {announcements.slice(0, 5).map((announcement) => (
                  <div key={announcement._id} className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                        <Megaphone className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-stone-900 dark:text-stone-100 truncate">
                            {announcement.title}
                          </p>
                          {announcement.isPinned && (
                            <span className="px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded-full">
                              Pinned
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-stone-500 dark:text-stone-400 line-clamp-2 mt-1">
                          {announcement.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-stone-500 dark:text-stone-400">
                No announcements
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
              Ministries
            </h2>
            <Link
              href="/dashboard/ministries"
              className="text-sm text-amber-600 hover:text-amber-700 font-medium"
            >
              View all
            </Link>
          </div>
          <div className="bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 overflow-hidden">
            {ministries && ministries.length > 0 ? (
              <div className="divide-y divide-stone-200 dark:divide-stone-700">
                {ministries.slice(0, 5).map((ministry) => (
                  <div key={ministry._id} className="p-4 flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                      <Heart className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-stone-900 dark:text-stone-100">
                        {ministry.name}
                      </p>
                      {ministry.meetingTime && (
                        <p className="text-sm text-stone-500 dark:text-stone-400">
                          {ministry.meetingTime}
                        </p>
                      )}
                    </div>
                    {ministry.category && (
                      <span className="px-2 py-1 text-xs font-medium bg-stone-100 text-stone-700 dark:bg-stone-700 dark:text-stone-300 rounded-full">
                        {ministry.category}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-stone-500 dark:text-stone-400">
                No ministries
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
