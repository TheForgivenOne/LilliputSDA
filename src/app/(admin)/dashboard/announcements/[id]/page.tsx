"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Input, Textarea, Select, Checkbox } from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useFetch, updateItem } from "@/hooks/useData";
import type { AnnouncementPriority, AnnouncementCategory } from "@/types/admin";

const priorities: { value: AnnouncementPriority; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "normal", label: "Normal" },
  { value: "high", label: "High" },
];

const categories: { value: AnnouncementCategory; label: string }[] = [
  { value: "general", label: "General" },
  { value: "youth", label: "Youth" },
  { value: "ministry", label: "Ministry" },
  { value: "community", label: "Community" },
];

type Announcement = {
  id: string;
  title: string;
  content: string;
  priority: AnnouncementPriority;
  category: AnnouncementCategory;
  expiresAt?: string;
  isPinned: boolean;
};

export default function EditAnnouncementPage() {
  const params = useParams();
  const router = useRouter();
  const announcementId = params.id as string;
  
  const { data: announcements, isLoading } = useFetch<Announcement[]>("/api/announcements");
  const announcement = announcements?.find((a) => a.id === announcementId);

  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    priority: "normal" as AnnouncementPriority,
    category: "general" as AnnouncementCategory,
    expiresAt: "",
    isPinned: false,
  });

  useEffect(() => {
    if (announcement) {
      setFormData({
        title: announcement.title || "",
        content: announcement.content || "",
        priority: announcement.priority || "normal",
        category: announcement.category || "general",
        expiresAt: announcement.expiresAt?.slice(0, 16) || "",
        isPinned: announcement.isPinned || false,
      });
    }
  }, [announcement]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoadingSubmit(true);

    try {
      await updateItem(`/api/announcements/${announcementId}`, {
        title: formData.title,
        content: formData.content,
        priority: formData.priority,
        category: formData.category,
        expiresAt: formData.expiresAt ? new Date(formData.expiresAt).toISOString() : undefined,
        isPinned: formData.isPinned,
      });

      router.push("/dashboard/announcements");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update announcement");
    } finally {
      setIsLoadingSubmit(false);
    }
  };

  if (!announcement && !isLoading) {
    router.push("/dashboard/announcements");
    return null;
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100 mb-2">
        Edit Announcement
      </h1>
      <p className="text-stone-600 dark:text-stone-400 mb-8">
        Update announcement details
      </p>
      <div className="bg-white dark:bg-stone-800 rounded-xl p-6 border border-stone-200 dark:border-stone-700">
        {announcement ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-lg text-rose-700 dark:text-rose-400">
                {error}
              </div>
            )}

            <Input
              label="Title"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />

            <Textarea
              label="Content"
              required
              rows={4}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Priority"
                options={priorities}
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as AnnouncementPriority })}
              />

              <Select
                label="Category"
                options={categories}
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as AnnouncementCategory })}
              />
            </div>

            <Input
              label="Expiration Date"
              type="datetime-local"
              value={formData.expiresAt}
              onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
            />

            <Checkbox
              label="Pin to top"
              checked={formData.isPinned}
              onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
            />

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" isLoading={isLoadingSubmit}>
                Update Announcement
              </Button>
            </div>
          </form>
        ) : (
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-stone-200 dark:bg-stone-700 rounded w-3/4" />
            <div className="h-24 bg-stone-200 dark:bg-stone-700 rounded" />
            <div className="h-10 bg-stone-200 dark:bg-stone-700 rounded w-1/2" />
          </div>
        )}
      </div>
    </div>
  );
}