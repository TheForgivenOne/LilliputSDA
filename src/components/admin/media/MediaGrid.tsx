"use client";

import { useState, useEffect } from "react";
import { Image, Trash2, Loader2 } from "lucide-react";
import NextImage from "next/image";

interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: string;
  uploadedAt: string;
}

export function MediaGrid() {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      const response = await fetch("/api/media");
      if (response.ok) {
        const data = await response.json();
        setMediaList(data);
      }
    } catch {
      setError("Failed to load media");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/media/${id}`, { method: "DELETE" });
      setMediaList(mediaList.filter((m) => m.id !== id));
    } catch {
      setError("Failed to delete media");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
      </div>
    );
  }

  if (mediaList.length === 0) {
    return (
      <div className="text-center py-12 text-stone-500 dark:text-stone-400">
        <Image className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>No media uploaded yet. Add image URLs above.</p>
      </div>
    );
  }

  return (
    <div>
      {error && <p className="text-rose-600 dark:text-rose-400 text-sm mb-4">{error}</p>}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {mediaList.map((media) => (
          <div key={media.id} className="group relative aspect-square bg-stone-100 dark:bg-stone-700 rounded-lg overflow-hidden">
            <NextImage
              src={media.url}
              alt={media.name}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 16vw"
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                onClick={() => handleDelete(media.id)}
                className="p-2 bg-rose-600 hover:bg-rose-700 rounded-full text-white"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <p className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 truncate">
              {media.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}