"use client";

import { useState } from "react";
import { Image as ImageIcon, FileText, X, Check, Upload, FolderOpen } from "lucide-react";
import Button from "@/components/ui/Button";
import { useFetch } from "@/hooks/useData";
import { CHURCH_IMAGES } from "@/lib/utils";

type SiteContent = {
  id: string;
  key: string;
  title: string | null;
  content: string | null;
  imageUrl: string | null;
  isActive: boolean;
  order: number;
};

const CONTENT_GROUPS = [
  {
    name: "Homepage Hero",
    description: "The main image and text shown at the top of the homepage",
    items: [
      { key: "hero_background", label: "Hero Image", type: "image" as const, fallbackKey: "hero.churchBuilding" },
      { key: "hero_title", label: "Title", type: "text" as const },
      { key: "hero_subtitle", label: "Subtitle", type: "text" as const },
    ],
  },
  {
    name: "About Page",
    description: "Content shown on the About page",
    items: [
      { key: "about_image", label: "Church Photo", type: "image" as const, fallbackKey: "congregation.main" },
      { key: "about_title", label: "Page Title", type: "text" as const },
      { key: "about_description", label: "Introduction", type: "textarea" as const },
    ],
  },
  {
    name: "Ministry Images",
    description: "Images shown on the Ministries page",
    items: [
      { key: "ministry_youth", label: "Youth Ministry", type: "image" as const, fallbackKey: "ministries.youth.main" },
      { key: "ministry_women", label: "Women's Ministry", type: "image" as const, fallbackKey: "ministries.womens.main" },
      { key: "ministry_men", label: "Men's Ministry", type: "image" as const, fallbackKey: "ministries.mens.main" },
      { key: "ministry_music", label: "Music Ministry", type: "image" as const, fallbackKey: "ministries.music.main" },
      { key: "ministry_community", label: "Community Services", type: "image" as const, fallbackKey: "ministries.community.main" },
      { key: "ministry_pathfinders", label: "Pathfinders", type: "image" as const, fallbackKey: "ministries.pathfinders.main" },
    ],
  },
];

function getFallbackImage(fallbackKey: string | null | undefined): string | null {
  if (!fallbackKey) return null;
  const keys = fallbackKey.split(".");
  let value: unknown = CHURCH_IMAGES;
  for (const key of keys) {
    if (value && typeof value === "object" && key in value) {
      value = (value as Record<string, unknown>)[key];
    } else {
      return null;
    }
  }
  return typeof value === "string" ? value : null;
}

export default function SiteContentAdminPage() {
  const { data: contents, refetch } = useFetch<SiteContent[]>("/api/site-content");
  const { data: media } = useFetch<{ id: string; name: string; url: string }[]>("/api/media");
  
  const [editingItem, setEditingItem] = useState<typeof CONTENT_GROUPS[0]["items"][0] | null>(null);
  const [formData, setFormData] = useState({ imageUrl: "", content: "", title: "" });
  const [isSaving, setIsSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");
  const [showMediaBrowser, setShowMediaBrowser] = useState(false);

  const getContentValue = (key: string): SiteContent | undefined => {
    return contents?.find((c) => c.key === key);
  };

  const handleSave = async () => {
    if (!editingItem) return;
    setIsSaving(true);
    
    try {
      const existing = getContentValue(editingItem.key);
      const data = {
        key: editingItem.key,
        title: editingItem.label,
        imageUrl: editingItem.type === "image" ? formData.imageUrl || null : null,
        content: editingItem.type !== "image" ? formData.content || null : null,
      };

      if (existing) {
        await fetch(`/api/site-content/${existing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      } else {
        await fetch("/api/site-content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      }

      setSavedMessage("Saved successfully!");
      setTimeout(() => setSavedMessage(""), 2000);
      refetch();
    } catch (error) {
      console.error("Failed to save:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const openEdit = (item: typeof CONTENT_GROUPS[0]["items"][0]) => {
    const existing = getContentValue(item.key);
    const fallbackKey = "fallbackKey" in item ? item.fallbackKey : null;
    setEditingItem(item);
    setFormData({
      imageUrl: existing?.imageUrl || getFallbackImage(fallbackKey) || "",
      content: existing?.content || "",
      title: existing?.title || "",
    });
  };

  const getPreviewContent = (key: string, fallbackKey?: string | null) => {
    const content = getContentValue(key);
    if (content?.imageUrl) return content.imageUrl;
    if (content?.content) return content.content.substring(0, 50) + "...";
    return getFallbackImage(fallbackKey);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
          Site Content
        </h1>
        <p className="text-stone-500 dark:text-stone-400 mt-1">
          Manage images and text content across your church website
        </p>
      </div>

      {savedMessage && (
        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 px-4 py-3 rounded-lg flex items-center gap-2">
          <Check className="w-5 h-5" />
          {savedMessage}
        </div>
      )}

      {CONTENT_GROUPS.map((group) => (
        <div key={group.name} className="bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 overflow-hidden">
          <div className="px-6 py-4 bg-stone-50 dark:bg-stone-900/50 border-b border-stone-200 dark:border-stone-700">
            <h2 className="font-semibold text-stone-900 dark:text-stone-100">{group.name}</h2>
            <p className="text-sm text-stone-500 dark:text-stone-400">{group.description}</p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {group.items.map((item) => {
                const content = getContentValue(item.key);
                const fallbackKey = "fallbackKey" in item ? item.fallbackKey : null;
                const preview = getPreviewContent(item.key, fallbackKey);
                const hasFallback = !!getFallbackImage(fallbackKey);

                return (
                  <div
                    key={item.key}
                    className={`relative rounded-xl border-2 transition-all ${
                      content?.imageUrl || content?.content
                        ? "border-emerald-500/50 bg-emerald-50/50 dark:bg-emerald-900/10"
                        : hasFallback
                        ? "border-amber-500/30 bg-amber-50/30 dark:bg-amber-900/5"
                        : "border-dashed border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-stone-900/30"
                    }`}
                  >
                    {item.type === "image" ? (
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <ImageIcon className="w-4 h-4 text-stone-500" />
                            <span className="text-sm font-medium text-stone-700 dark:text-stone-300">
                              {item.label}
                            </span>
                          </div>
                          {content?.imageUrl ? (
                            <span className="text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded">Custom</span>
                          ) : hasFallback ? (
                            <span className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded">Default</span>
                          ) : null}
                        </div>
                        {preview ? (
                          <div className="relative aspect-video rounded-lg overflow-hidden mb-3">
                            <img
                              src={preview}
                              alt={item.label}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="aspect-video rounded-lg bg-stone-200 dark:bg-stone-700 flex items-center justify-center mb-3">
                            <span className="text-sm text-stone-500">No image set</span>
                          </div>
                        )}
                        <Button
                          variant={content?.imageUrl ? "secondary" : "primary"}
                          size="sm"
                          className="w-full"
                          onClick={() => openEdit(item)}
                        >
                          {content?.imageUrl ? "Change Image" : hasFallback ? "Override" : "Add Image"}
                        </Button>
                      </div>
                    ) : (
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-stone-500" />
                            <span className="text-sm font-medium text-stone-700 dark:text-stone-300">
                              {item.label}
                            </span>
                          </div>
                          {content?.content ? (
                            <span className="text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded">Custom</span>
                          ) : null}
                        </div>
                        {preview ? (
                          <p className="text-sm text-stone-600 dark:text-stone-400 mb-3 line-clamp-2">
                            {preview}
                          </p>
                        ) : (
                          <p className="text-sm text-stone-400 mb-3">No text set</p>
                        )}
                        <Button
                          variant={content?.content ? "secondary" : "primary"}
                          size="sm"
                          className="w-full"
                          onClick={() => openEdit(item)}
                        >
                          {content?.content ? "Edit Text" : "Add Text"}
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ))}

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-stone-800 rounded-2xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 dark:border-stone-700">
              <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                Edit {editingItem.label}
              </h2>
              <button
                onClick={() => setEditingItem(null)}
                className="p-2 hover:bg-stone-100 dark:hover:bg-stone-700 rounded-lg"
              >
                <X className="w-5 h-5 text-stone-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {editingItem.type === "image" ? (
                <div>
                  <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                    Image URL
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                      className="flex-1 px-4 py-3 border border-stone-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-amber-500"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setShowMediaBrowser(true)}
                      className="flex items-center gap-2"
                    >
                      <FolderOpen className="w-4 h-4" />
                      Browse
                    </Button>
                  </div>
                  {formData.imageUrl && (
                    <div className="mt-3 relative aspect-video rounded-lg overflow-hidden border">
                      <img
                        src={formData.imageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23fee' width='100' height='100'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23991' font-family='system-ui'%3EInvalid URL%3C/text%3E%3C/svg%3E";
                        }}
                      />
                    </div>
                  )}
                  <p className="text-xs text-stone-500 mt-2">
                    Tip: Click "Browse" to select from uploaded images, or paste a URL
                  </p>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                    Text Content
                  </label>
                  {editingItem.type === "textarea" ? (
                    <textarea
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      rows={5}
                      className="w-full px-4 py-3 border border-stone-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-amber-500"
                    />
                  ) : (
                    <input
                      type="text"
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      className="w-full px-4 py-3 border border-stone-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-amber-500"
                    />
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t border-stone-200 dark:border-stone-700">
              <Button variant="secondary" onClick={() => setEditingItem(null)}>
                Cancel
              </Button>
              <Button onClick={handleSave} isLoading={isSaving}>
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Media Browser Modal */}
      {showMediaBrowser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white dark:bg-stone-800 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 dark:border-stone-700">
              <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                Select from Media Library
              </h2>
              <button
                onClick={() => setShowMediaBrowser(false)}
                className="p-2 hover:bg-stone-100 dark:hover:bg-stone-700 rounded-lg"
              >
                <X className="w-5 h-5 text-stone-500" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {!media || media.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-stone-100 dark:bg-stone-700 flex items-center justify-center mx-auto mb-4">
                    <ImageIcon className="w-8 h-8 text-stone-400" />
                  </div>
                  <p className="text-stone-500 dark:text-stone-400 mb-4">No images uploaded yet</p>
                  <Button variant="secondary" onClick={() => window.location.href = "/dashboard/media"}>
                    <Upload className="w-4 h-4 mr-2" />
                    Go to Media Upload
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  {media.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setFormData({ ...formData, imageUrl: item.url });
                        setShowMediaBrowser(false);
                      }}
                      className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all hover:ring-2 hover:ring-amber-500 ${
                        formData.imageUrl === item.url ? "border-amber-500 ring-2 ring-amber-500" : "border-transparent"
                      }`}
                    >
                      <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1">
                        <p className="text-xs text-white truncate">{item.name}</p>
                      </div>
                      {formData.imageUrl === item.url && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-between px-6 py-4 border-t border-stone-200 dark:border-stone-700">
              <Button variant="secondary" onClick={() => window.location.href = "/dashboard/media"}>
                <Upload className="w-4 h-4 mr-2" />
                Upload More
              </Button>
              <Button variant="secondary" onClick={() => setShowMediaBrowser(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}