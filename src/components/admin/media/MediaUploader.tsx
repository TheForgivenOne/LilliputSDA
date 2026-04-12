"use client";

import { useState, useRef } from "react";
import { Upload, X, Image, Loader2 } from "lucide-react";

export function MediaUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [nameInput, setNameInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setNameInput(selectedFile.name.replace(/\.[^/.]+$/, ""));
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!file) {
      setError("Please select a file");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("name", nameInput || file.name);

      const response = await fetch("/api/media", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to upload");
      }

      setSuccess("File uploaded successfully!");
      setFile(null);
      setPreview(null);
      setNameInput("");
      if (inputRef.current) inputRef.current.value = "";
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFile(null);
    setPreview(null);
    setNameInput("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleUpload} className="space-y-4">
        {!file ? (
          <div className="border-2 border-dashed border-stone-300 dark:border-stone-600 rounded-xl p-8 text-center hover:border-amber-500 transition-colors">
            <label className="cursor-pointer">
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <Upload className="w-12 h-12 mx-auto text-stone-400 mb-4" />
              <p className="text-stone-600 dark:text-stone-400">
                Click to select an image to upload
              </p>
              <p className="text-sm text-stone-500 mt-2">
                PNG, JPG, GIF up to 4.5MB
              </p>
            </label>
          </div>
        ) : (
          <div className="bg-stone-50 dark:bg-stone-800 rounded-lg p-4">
            <div className="flex items-center gap-4 mb-4">
              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-20 h-20 object-cover rounded-lg"
                />
              )}
              <div className="flex-1">
                <p className="font-medium text-stone-900 dark:text-stone-100">{file.name}</p>
                <p className="text-sm text-stone-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <button
                type="button"
                onClick={handleCancel}
                className="p-2 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-full"
              >
                <X className="w-5 h-5 text-stone-500" />
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
                Name (optional)
              </label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Enter a name for this image"
                className="w-full px-4 py-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
          </div>
        )}

        {error && <p className="text-rose-600 dark:text-rose-400 text-sm">{error}</p>}
        {success && <p className="text-emerald-600 dark:text-emerald-400 text-sm">{success}</p>}

        {file && (
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white rounded-lg transition-colors"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            Upload Image
          </button>
        )}
      </form>
    </div>
  );
}