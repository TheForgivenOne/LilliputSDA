"use client";

import { Play } from "lucide-react";

interface VideoErrorProps {
  error: string;
  channelUrl: string;
}

export function VideoError({ error, channelUrl }: VideoErrorProps) {
  return (
    <div className="bg-white dark:bg-stone-800 rounded-2xl p-8 text-center">
      <p className="text-stone-500 dark:text-stone-400 mb-4">{error}</p>
      <a
        href={channelUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-6 py-3 bg-amber-700 text-white rounded-lg font-medium hover:bg-amber-800 transition-colors"
      >
        <Play className="w-5 h-5" />
        Visit YouTube Channel
      </a>
    </div>
  );
}
