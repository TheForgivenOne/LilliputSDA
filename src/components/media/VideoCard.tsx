"use client";

import { VideoThumbnail } from "./VideoThumbnail";
import { decodeHtmlEntities } from "@/lib/utils";
import type { YouTubeVideo } from "@/types";

interface VideoCardProps {
  video: YouTubeVideo;
  onClick: (video: YouTubeVideo) => void;
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
      />
      <div className="p-4">
        <h3 className="font-semibold text-stone-900 dark:text-stone-100 mb-1 line-clamp-2 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
          {decodeHtmlEntities(video.title)}
        </h3>
        <p className="text-sm text-stone-500 dark:text-stone-400">
          {new Date(video.publishedAt).toLocaleDateString()}
        </p>
      </div>
    </article>
  );
}
