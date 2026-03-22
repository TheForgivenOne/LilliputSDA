"use client";

import { useState, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Upload } from "lucide-react";

export function MediaUploader() {
  const generateUploadUrl = useMutation(api.media.mutations.generateUploadUrl);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }

    setError(null);

    try {
      const uploadUrl = await generateUploadUrl();
      
      const response = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    }
  };

  return (
    <div className="space-y-4">
      <div
        className="border-2 border-dashed border-stone-300 dark:border-stone-600 rounded-xl p-8 text-center hover:border-amber-500 dark:hover:border-amber-500 transition-colors cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="hidden"
        />
        <Upload className="w-12 h-12 mx-auto text-stone-400 mb-4" />
        <p className="text-stone-600 dark:text-stone-400">
          <span className="text-amber-600 font-medium">Click to upload</span> or drag and drop
        </p>
        <p className="text-sm text-stone-500 mt-2">
          PNG, JPG, GIF up to 5MB
        </p>
      </div>
      {error && (
        <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>
      )}
    </div>
  );
}
