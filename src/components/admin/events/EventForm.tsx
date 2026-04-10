"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input, Textarea, Select, Checkbox } from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { createItem, updateItem } from "@/hooks/useData";

const categories = [
  { value: "service", label: "Service" },
  { value: "special", label: "Special" },
  { value: "youth", label: "Youth" },
  { value: "community", label: "Community" },
];

const recurrencePatterns = [
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

interface EventFormProps {
  event?: {
    id: string;
    title: string;
    description: string;
    startDate: string;
    endDate?: string;
    location: string;
    category: "service" | "special" | "youth" | "community";
    imageUrl?: string;
    isRecurring: boolean;
    recurrencePattern?: "weekly" | "monthly";
  };
  onSuccess?: () => void;
}

export function EventForm({ event, onSuccess }: EventFormProps) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: event?.title || "",
    description: event?.description || "",
    startDate: event?.startDate?.slice(0, 16) || "",
    endDate: event?.endDate?.slice(0, 16) || "",
    location: event?.location || "",
    category: event?.category || "service",
    imageUrl: event?.imageUrl || "",
    isRecurring: event?.isRecurring || false,
    recurrencePattern: event?.recurrencePattern || "weekly",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const data = {
        title: formData.title,
        description: formData.description,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : undefined,
        location: formData.location,
        category: formData.category as "service" | "special" | "youth" | "community",
        imageUrl: formData.imageUrl || undefined,
        isRecurring: formData.isRecurring,
        recurrencePattern: formData.isRecurring
          ? (formData.recurrencePattern as "weekly" | "monthly")
          : undefined,
      };

      if (event?.id) {
        await updateItem(`/api/events/${event.id}`, data);
      } else {
        await createItem("/api/events", data);
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/dashboard/events");
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save event");
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
        placeholder="Enter event title"
      />

      <Textarea
        label="Description"
        required
        rows={4}
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        placeholder="Describe the event..."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Start Date & Time"
          required
          type="datetime-local"
          value={formData.startDate}
          onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
        />

        <Input
          label="End Date & Time"
          type="datetime-local"
          value={formData.endDate}
          onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
          helperText="Leave empty for no end time"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Location"
          required
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          placeholder="Church hall, Room 101, etc."
        />

        <Select
          label="Category"
          required
          options={categories}
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value as "service" | "special" | "youth" | "community" })}
        />
      </div>

      <Input
        label="Image URL"
        type="url"
        value={formData.imageUrl}
        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
        placeholder="https://example.com/image.jpg"
        helperText="Optional: Add an image for the event"
      />

      <div className="space-y-4">
        <Checkbox
          label="Recurring Event"
          checked={formData.isRecurring}
          onChange={(e) =>
            setFormData({ ...formData, isRecurring: e.target.checked })
          }
        />

        {formData.isRecurring && (
          <Select
            label="Recurrence Pattern"
            options={recurrencePatterns}
            value={formData.recurrencePattern}
            onChange={(e) =>
              setFormData({
                ...formData,
                recurrencePattern: e.target.value as "weekly" | "monthly",
              })
            }
          />
        )}
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {event ? "Update Event" : "Create Event"}
        </Button>
      </div>
    </form>
  );
}
