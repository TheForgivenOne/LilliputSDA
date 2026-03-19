"use client";

import { X } from "lucide-react";
import { decodeHtmlEntities } from "@/lib/utils";
import type { YouTubeVideo } from "@/types";

interface VideoModalProps {
  video: YouTubeVideo | null;
  onClose: () => void;
}

export function VideoModal({ video, onClose }: VideoModalProps) {
  if (!video) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90"
      onClick={onClose}
    >
      <div className="relative w-full max-w-5xl">
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-amber-400 transition-colors"
          aria-label="Close video"
        >
          <X className="w-8 h-8" />
        </button>
        <div className="aspect-video bg-black rounded-lg overflow-hidden">
          <iframe
            src={`https://www.youtube.com/embed/${video.id}?autoplay=1`}
            title={decodeHtmlEntities(video.title)}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}
