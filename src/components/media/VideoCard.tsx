"use client";

import { VideoThumbnail } from "./VideoThumbnail";
import { decodeHtmlEntities } from "@/lib/utils";
import type { YouTubeVideo } from "@/types";

interface VideoCardProps {
  video: YouTubeVideo;
  onClick: (video: YouTubeVideo) => void;
}

function formatScheduledTime(isoString?: string): string {
  if (!isoString) return "";
  const date = new Date(isoString);
  const now = new Date();
  const time = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === now.toDateString()) return `Today at ${time}`;
  if (date.toDateString() === tomorrow.toDateString()) return `Tomorrow at ${time}`;
  return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) + ` at ${time}`;
}

export function VideoCard({ video, onClick }: VideoCardProps) {
  return (
    <article
      onClick={() => onClick(video)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick(video);
        }
      }}
      role="button"
      tabIndex={0}
      className="group bg-white dark:bg-stone-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer"
    >
      <VideoThumbnail
        thumbnailUrl={video.thumbnailUrl}
        title={video.title}
        duration={video.duration}
        onPlay={() => onClick(video)}
        size="sm"
        status={video.status}
      />
      <div className="p-4">
        <h3 className="font-semibold text-stone-900 dark:text-stone-100 mb-1 line-clamp-2 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
          {decodeHtmlEntities(video.title)}
        </h3>
        <p className="text-sm text-stone-500 dark:text-stone-400">
          {video.status === "live" ? (
            <span className="text-red-600 dark:text-red-400 font-medium">Live now</span>
          ) : video.status === "upcoming" ? (
            <span className="text-blue-600 dark:text-blue-400 font-medium">
              {video.scheduledStartTime
                ? `Check back ${formatScheduledTime(video.scheduledStartTime)}`
                : "Scheduled"}
            </span>
          ) : (
            new Date(video.publishedAt).toLocaleDateString()
          )}
        </p>
      </div>
    </article>
  );
}
