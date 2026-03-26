"use client";

import { DataLoadError } from "@/components/ui/DataLoadError";
import { AnnouncementCard } from "@/components/ui/Card";
import type { Announcement } from "@/types";
import { FALLBACK_ANNOUNCEMENTS } from "@/config/staticData";

interface AnnouncementsListProps {
  announcements: Announcement[];
  isLoading: boolean;
  isError: boolean;
}

export function AnnouncementsList({ announcements, isLoading, isError }: AnnouncementsListProps) {
  if (isError) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DataLoadError
          title="Unable to Load Announcements"
          message="We're having trouble loading announcements. Please check your connection."
          variant="card"
        />
        <AnnouncementCard
          title="Stay Connected"
          content="Check back soon for updates from our church community."
          date={new Date().toISOString()}
          priority="normal"
          category="General"
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white dark:bg-stone-800 rounded-2xl p-6 shadow-sm border-l-4 border-amber-500">
            <div className="h-6 bg-stone-200 dark:bg-stone-700 rounded animate-pulse w-2/3 mb-3" />
            <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded animate-pulse mb-2" />
            <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded animate-pulse w-4/5" />
          </div>
        ))}
      </div>
    );
  }

  if (!announcements || announcements.length === 0) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {FALLBACK_ANNOUNCEMENTS.map((announcement) => (
          <AnnouncementCard
            key={announcement._id}
            title={announcement.title}
            content={announcement.content}
            date={announcement.date}
            priority={announcement.priority as "low" | "normal" | "high" | undefined}
            category={announcement.category}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {announcements.slice(0, 2).map((announcement: Announcement) => (
        <AnnouncementCard
          key={announcement._id}
          title={announcement.title}
          content={announcement.content}
          date={announcement.date}
          priority={announcement.priority as "low" | "normal" | "high" | undefined}
          category={announcement.category}
        />
      ))}
    </div>
  );
}
