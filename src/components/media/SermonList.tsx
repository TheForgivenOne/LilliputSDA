"use client";

import { VideoCard } from "./VideoCard";
import { VideoCardSkeleton } from "./VideoSkeleton";
import type { YouTubeVideo } from "@/types";

interface SermonListProps {
  videos: YouTubeVideo[];
  onVideoClick: (video: YouTubeVideo) => void;
  loading?: boolean;
  maxItems?: number;
}

export function SermonList({
  videos,
  onVideoClick,
  loading = false,
  maxItems = 3,
}: SermonListProps) {
  if (loading) {
    return (
      <div className="flex gap-6 overflow-x-auto pb-4 -mx-4 px-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="w-[280px] sm:w-[320px] lg:w-[360px] flex-shrink-0"
          >
            <VideoCardSkeleton />
          </div>
        ))}
      </div>
    );
  }

  const displayVideos = videos.slice(0, maxItems);

  return (
    <div className="flex gap-6 overflow-x-auto pb-4 -mx-4 px-4">
      {displayVideos.map((video) => (
        <div
          key={video.id}
          className="w-[280px] sm:w-[320px] lg:w-[360px] flex-shrink-0"
        >
          <VideoCard video={video} onClick={onVideoClick} />
        </div>
      ))}
    </div>
  );
}
