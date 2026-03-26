"use client";

import { Upload } from "lucide-react";

export function MediaUploader() {
  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-stone-300 dark:border-stone-600 rounded-xl p-8 text-center">
        <Upload className="w-12 h-12 mx-auto text-stone-400 mb-4" />
        <p className="text-stone-600 dark:text-stone-400">
          Media upload is disabled (Convex storage not available)
        </p>
        <p className="text-sm text-stone-500 mt-2">
          Use external image URLs instead
        </p>
      </div>
    </div>
  );
}
