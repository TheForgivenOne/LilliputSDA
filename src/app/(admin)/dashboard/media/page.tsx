"use client";

import { MediaUploader } from "@/components/admin/media/MediaUploader";
import { MediaGrid } from "@/components/admin/media/MediaGrid";
import { PageHeader } from "@/components/admin/PageHeader";
import { AdminBreadcrumbs } from "@/components/admin/AdminBreadcrumbs";

export default function MediaAdminPage() {
  return (
    <div className="space-y-6">
      <AdminBreadcrumbs />
      
      <PageHeader
        title="Media Library"
        description="Upload and manage church images"
      />

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
