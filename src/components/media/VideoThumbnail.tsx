"use client";

import Image from "next/image";
import { PlayButton } from "./PlayButton";
import { decodeHtmlEntities } from "@/lib/utils";

interface VideoThumbnailProps {
  thumbnailUrl: string;
  title: string;
  duration?: string;
  onPlay: () => void;
  size?: "sm" | "md" | "lg";
}

export function VideoThumbnail({
  thumbnailUrl,
  title,
  duration,
  onPlay,
  size = "md",
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
      {duration && (
        <div className="absolute bottom-2 right-2 bg-black/75 text-white text-xs px-2 py-0.5 rounded font-medium">
          {duration}
        </div>
      )}
    </div>
  );
}
