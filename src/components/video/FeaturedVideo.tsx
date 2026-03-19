"use client";

import { Play } from "lucide-react";
import Image from "next/image";
import { decodeHtmlEntities } from "@/lib/utils";
import type { YouTubeVideo } from "@/types";

interface FeaturedVideoProps {
  video: YouTubeVideo;
  isPlaying: boolean;
  onPlay: () => void;
}

export function FeaturedVideo({ video, isPlaying, onPlay }: FeaturedVideoProps) {
  return (
    <div className="bg-white dark:bg-stone-800 rounded-2xl overflow-hidden shadow-lg">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="aspect-video lg:aspect-auto relative bg-stone-900">
          {isPlaying ? (
            <iframe
              src={`https://www.youtube.com/embed/${video.id}?autoplay=1`}
              title={decodeHtmlEntities(video.title)}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <>
              <Image
                src={video.thumbnailUrl}
                alt={decodeHtmlEntities(video.title)}
                fill
                className="object-cover"
                onError={() => {}}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <button onClick={onPlay} className="group">
                  <div className="w-20 h-20 rounded-full bg-amber-600 flex items-center justify-center group-hover:bg-amber-500 transition-colors shadow-lg">
                    <Play className="w-8 h-8 text-white ml-1" />
                  </div>
                </button>
              </div>
              <div className="absolute bottom-4 right-4 bg-black/75 text-white text-sm px-3 py-1 rounded">
                {video.duration}
              </div>
            </>
          )}
        </div>
        <div className="p-8 lg:p-12 flex flex-col justify-center">
          <span className="text-amber-700 dark:text-amber-400 font-medium mb-2">
            {new Date(video.publishedAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <h3 className="text-2xl lg:text-3xl font-bold text-stone-900 dark:text-stone-100 mb-4">
            {decodeHtmlEntities(video.title)}
          </h3>
          <p className="text-stone-600 dark:text-stone-300 mb-4 line-clamp-3">
            {decodeHtmlEntities(video.description)}
          </p>
          <div className="flex flex-wrap gap-4 text-sm text-stone-500 dark:text-stone-400 mb-6">
            <span className="flex items-center gap-1">
              {parseInt(video.viewCount).toLocaleString()} views
            </span>
          </div>
          <button
            onClick={onPlay}
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-700 text-white rounded-lg font-medium hover:bg-amber-800 transition-colors w-fit"
          >
            <Play className="w-5 h-5" />
            Watch Now
          </button>
        </div>
      </div>
    </div>
  );
}
