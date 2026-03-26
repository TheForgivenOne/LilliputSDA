"use client";

import { useState } from "react";
import { Input, Textarea, Select, Checkbox } from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";
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

export default function NewAnnouncementPage() {
  const router = useRouter();
  const createAnnouncement = useMutation(api.announcements.mutations.create);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<{
    title: string;
    content: string;
    priority: AnnouncementPriority;
    category: AnnouncementCategory;
    expiresAt: string;
    isPinned: boolean;
  }>({
    title: "",
    content: "",
    priority: "normal",
    category: "general",
    expiresAt: "",
    isPinned: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await createAnnouncement({
        title: formData.title,
        content: formData.content,
        priority: formData.priority,
        category: formData.category,
        expiresAt: formData.expiresAt || undefined,
        isPinned: formData.isPinned,
      });

      router.push("/dashboard/announcements");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create announcement");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100 mb-2">
        Create Announcement
      </h1>
      <p className="text-stone-600 dark:text-stone-400 mb-8">
        Add a new announcement to the church
      </p>
      <div className="bg-white dark:bg-stone-800 rounded-xl p-6 border border-stone-200 dark:border-stone-700">
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
            placeholder="Enter announcement title"
          />

          <Textarea
            label="Content"
            required
            rows={4}
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            placeholder="Write your announcement..."
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
            helperText="Optional: Announcement will auto-hide after this date"
          />

          <Checkbox
            label="Pin to top"
            checked={formData.isPinned}
            onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
            helperText="This announcement will appear at the top of the list"
          />

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading}>
              Create Announcement
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
