"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Modal, ConfirmDialog } from "@/components/admin";
import { Image as ImageIcon, Trash2, Copy, Check } from "lucide-react";
import type { Id } from "@/convex/_generated/dataModel";

export function MediaGrid() {
  const storageIds = useQuery(api.media.queries.list);
  const deleteMedia = useMutation(api.media.mutations.deleteMedia);
  const [deleteId, setDeleteId] = useState<Id<"_storage"> | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await deleteMedia({ storageId: deleteId });
      setDeleteId(null);
    } catch (error) {
      console.error("Failed to delete:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCopyUrl = async (storageId: string) => {
    const url = `${process.env.NEXT_PUBLIC_CONVEX_URL}/api/storage/${storageId}`;
    await navigator.clipboard.writeText(url);
    setCopiedId(storageId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getImageUrl = (storageId: string) => {
    return `${process.env.NEXT_PUBLIC_CONVEX_URL}/api/storage/${storageId}`;
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {storageIds?.map((storageId) => (
          <div
            key={storageId}
            className="group relative aspect-square bg-stone-100 dark:bg-stone-800 rounded-xl overflow-hidden border border-stone-200 dark:border-stone-700"
          >
            <img
              src={getImageUrl(storageId)}
              alt=""
              className="w-full h-full object-cover"
              onClick={() => setPreviewUrl(getImageUrl(storageId))}
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                onClick={() => setPreviewUrl(getImageUrl(storageId))}
                className="p-2 bg-white rounded-lg hover:bg-stone-100 transition-colors"
                title="Preview"
              >
                <ImageIcon className="w-5 h-5 text-stone-700" />
              </button>
              <button
                onClick={() => handleCopyUrl(storageId)}
                className="p-2 bg-white rounded-lg hover:bg-stone-100 transition-colors"
                title="Copy URL"
              >
                {copiedId === storageId ? (
                  <Check className="w-5 h-5 text-green-600" />
                ) : (
                  <Copy className="w-5 h-5 text-stone-700" />
                )}
              </button>
              <button
                onClick={() => setDeleteId(storageId as Id<"_storage">)}
                className="p-2 bg-white rounded-lg hover:bg-rose-100 transition-colors"
                title="Delete"
              >
                <Trash2 className="w-5 h-5 text-rose-600" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {(!storageIds || storageIds.length === 0) && (
        <div className="text-center py-12 text-stone-500 dark:text-stone-400">
          No media uploaded yet
        </div>
      )}

      <Modal
        isOpen={!!previewUrl}
        onClose={() => setPreviewUrl(null)}
        title="Image Preview"
        size="xl"
      >
        {previewUrl && (
          <img
            src={previewUrl}
            alt=""
            className="w-full h-auto rounded-lg"
          />
        )}
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Media"
        message="Are you sure you want to delete this image? This action cannot be undone."
        confirmText="Delete"
        isLoading={isDeleting}
      />
    </>
  );
}
