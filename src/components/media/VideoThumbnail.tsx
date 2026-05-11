"use client";

import Image from "next/image";
import { PlayButton } from "./PlayButton";
import { decodeHtmlEntities } from "@/lib/utils";
import type { VideoStatus } from "@/types";

interface VideoThumbnailProps {
  thumbnailUrl: string;
  title: string;
  duration?: string;
  onPlay: () => void;
  size?: "sm" | "md" | "lg";
  status?: VideoStatus;
}

export function VideoThumbnail({
  thumbnailUrl,
  title,
  duration,
  onPlay,
  size = "md",
  status,
}: VideoThumbnailProps) {
  const buttonSizes = {
    sm: "sm",
    md: "md",
    lg: "lg",
  } as const;

  return (
    <div className="aspect-video relative bg-stone-900 group">
      <Image
        src={thumbnailUrl}
        alt={decodeHtmlEntities(title)}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover group-hover:scale-105 transition-transform duration-300"
        onError={() => {}}
      />
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <PlayButton size={buttonSizes[size]} onClick={onPlay} />
      </div>

      {status === "live" && (
        <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-lg">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
          </span>
          LIVE
        </div>
      )}

      {status === "upcoming" && (
        <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-lg">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          UPCOMING
        </div>
      )}

      {status === "past" && duration && (
        <div className="absolute bottom-2 right-2 bg-black/75 text-white text-xs px-2 py-0.5 rounded font-medium">
          {duration}
        </div>
      )}
    </div>
  );
}
