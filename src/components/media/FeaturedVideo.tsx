"use client";

import { useState, useEffect } from "react";
import { Play, Clock } from "lucide-react";
import Image from "next/image";
import { decodeHtmlEntities } from "@/lib/utils";
import { isMobileDevice, openYouTubeVideo } from "@/lib/youtube";
import type { YouTubeVideo } from "@/types";

interface FeaturedVideoProps {
  video: YouTubeVideo;
  isPlaying: boolean;
  onPlay: () => void;
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
  return date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }) + ` at ${time}`;
}

export function FeaturedVideo({ video, isPlaying, onPlay }: FeaturedVideoProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [thumbnailSrc, setThumbnailSrc] = useState(video.thumbnailUrl);
  const [thumbnailFallbackUsed, setThumbnailFallbackUsed] = useState(false);

  useEffect(() => {
    setIsMobile(isMobileDevice());
  }, []);

  const handleThumbnailError = () => {
    if (!thumbnailFallbackUsed) {
      setThumbnailSrc(`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`);
      setThumbnailFallbackUsed(true);
    }
  };

  const handlePlay = () => {
    if (isMobile) {
      openYouTubeVideo(video.id);
    } else {
      onPlay();
    }
  };

  return (
    <div className="bg-white dark:bg-stone-800 rounded-2xl overflow-hidden shadow-lg">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="aspect-video lg:aspect-auto relative bg-stone-900">
          {isPlaying && !isMobile ? (
            <iframe
              src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1`}
              title={decodeHtmlEntities(video.title)}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <>
              <Image
                src={thumbnailSrc}
                alt={decodeHtmlEntities(video.title)}
                fill
                className="object-cover"
                onError={handleThumbnailError}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <button onClick={handlePlay} className="group">
                  <div className="w-20 h-20 rounded-full bg-amber-600 flex items-center justify-center group-hover:bg-amber-500 transition-colors shadow-lg">
                    <Play className="w-8 h-8 text-white ml-1" />
                  </div>
                </button>
              </div>

              {video.status === "live" ? (
                <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-red-600 text-white text-sm font-bold px-3 py-1.5 rounded-lg shadow-lg">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
                  </span>
                  LIVE
                </div>
              ) : video.status === "upcoming" ? (
                <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-blue-600 text-white text-sm font-bold px-3 py-1.5 rounded-lg shadow-lg">
                  <Clock className="w-4 h-4" />
                  UPCOMING
                </div>
              ) : null}

              {video.status === "past" && (
                <div className="absolute bottom-4 right-4 bg-black/75 text-white text-sm px-3 py-1 rounded">
                  {video.duration}
                </div>
              )}
            </>
          )}
        </div>
        <div className="p-8 lg:p-12 flex flex-col justify-center">
          {video.status === "live" ? (
            <div className="flex items-center gap-2 mb-2">
              <span className="flex items-center gap-1 text-red-600 dark:text-red-400 font-semibold text-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600" />
                </span>
                Live Now
              </span>
            </div>
          ) : video.status === "upcoming" ? (
            <div className="flex items-center gap-2 mb-2">
              <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-semibold text-sm">
                <Clock className="w-4 h-4" />
                {video.scheduledStartTime ? formatScheduledTime(video.scheduledStartTime) : "Upcoming"}
              </span>
            </div>
          ) : (
            <span className="text-amber-700 dark:text-amber-400 font-medium mb-2">
              {new Date(video.publishedAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          )}

          <h3 className="text-2xl lg:text-3xl font-bold text-stone-900 dark:text-stone-100 mb-4">
            {decodeHtmlEntities(video.title)}
          </h3>
          <p className="text-stone-600 dark:text-stone-300 mb-4 line-clamp-3">
            {decodeHtmlEntities(video.description)}
          </p>
          <div className="flex flex-wrap gap-4 text-sm text-stone-500 dark:text-stone-400 mb-6">
            {video.status !== "upcoming" && (
              <span className="flex items-center gap-1">
                {parseInt(video.viewCount).toLocaleString()} views
              </span>
            )}
          </div>
          <button
            onClick={handlePlay}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors w-fit ${
              video.status === "live"
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-amber-700 text-white hover:bg-amber-800"
            }`}
          >
            <Play className="w-5 h-5" />
            {video.status === "live"
              ? "Watch Live"
              : video.status === "upcoming"
              ? "Set Reminder"
              : isMobile
              ? "Watch on YouTube"
              : "Watch Now"}
          </button>
        </div>
      </div>
    </div>
  );
}
