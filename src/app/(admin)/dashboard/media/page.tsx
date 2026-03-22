"use client";

import { MediaUploader } from "@/components/admin/media/MediaUploader";
import { MediaGrid } from "@/components/admin/media/MediaGrid";

export default function MediaAdminPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">
          Media Library
        </h1>
        <p className="text-stone-600 dark:text-stone-400 mt-1">
          Upload and manage church images
        </p>
      </div>

      <div className="bg-white dark:bg-stone-800 rounded-xl p-6 border border-stone-200 dark:border-stone-700">
        <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-4">
          Upload New Image
        </h2>
        <MediaUploader />
      </div>

      <div className="bg-white dark:bg-stone-800 rounded-xl p-6 border border-stone-200 dark:border-stone-700">
        <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-4">
          Uploaded Images
        </h2>
        <MediaGrid />
      </div>
    </div>
  );
}
