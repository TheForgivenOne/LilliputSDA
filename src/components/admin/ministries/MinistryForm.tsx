"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Input, Textarea, Select } from "@/components/ui/Input";
import Button from "@/components/ui/Button";

const categories = [
  { value: "youth", label: "Youth" },
  { value: "adult", label: "Adult" },
  { value: "family", label: "Family" },
  { value: "music", label: "Music" },
];

interface MinistryFormProps {
  ministry?: {
    _id: string;
    name: string;
    description: string;
    leaderId?: string;
    meetingTime?: string;
    meetingLocation?: string;
    imageUrl?: string;
    category?: string;
    order?: number;
  };
}

export function MinistryForm({ ministry }: MinistryFormProps) {
  const router = useRouter();
  const createMinistry = useMutation(api.ministries.mutations.create);
  const updateMinistry = useMutation(api.ministries.mutations.update);
  const staffMembers = useQuery(api.staff.queries.listAll);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: ministry?.name || "",
    description: ministry?.description || "",
    leaderId: ministry?.leaderId || "",
    meetingTime: ministry?.meetingTime || "",
    meetingLocation: ministry?.meetingLocation || "",
    imageUrl: ministry?.imageUrl || "",
    category: ministry?.category || "youth",
    order: ministry?.order ?? 0,
  });

  const staffOptions = [
    { value: "", label: "No leader assigned" },
    ...(staffMembers?.map((s) => ({ value: s._id, label: s.name })) || []),
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data: any = {
        name: formData.name,
        description: formData.description,
        leaderId: formData.leaderId || undefined,
        meetingTime: formData.meetingTime || undefined,
        meetingLocation: formData.meetingLocation || undefined,
        imageUrl: formData.imageUrl || undefined,
        category: formData.category as "youth" | "adult" | "family" | "music",
        order: formData.order,
      };

      if (ministry?._id) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await updateMinistry({ id: ministry._id as any, ...data });
      } else {
        await createMinistry(data);
      }

      router.push("/dashboard/ministries");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save ministry");
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
        label="Ministry Name"
        required
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="e.g., Youth Fellowship"
      />

      <Textarea
        label="Description"
        required
        rows={4}
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        placeholder="Describe this ministry..."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Leader"
          options={staffOptions}
          value={formData.leaderId}
          onChange={(e) => setFormData({ ...formData, leaderId: e.target.value })}
        />

        <Select
          label="Category"
          required
          options={categories}
          value={formData.category}
          onChange={(e) =>
            setFormData({
              ...formData,
              category: e.target.value as "youth" | "adult" | "family" | "music",
            })
          }
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Meeting Time"
          value={formData.meetingTime}
          onChange={(e) => setFormData({ ...formData, meetingTime: e.target.value })}
          placeholder="Sabbath 3:00 PM"
        />

        <Input
          label="Meeting Location"
          value={formData.meetingLocation}
          onChange={(e) => setFormData({ ...formData, meetingLocation: e.target.value })}
          placeholder="Room 101"
        />
      </div>

      <Input
        label="Image URL"
        type="url"
        value={formData.imageUrl}
        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
        placeholder="https://example.com/image.jpg"
      />

      <Input
        label="Display Order"
        type="number"
        min={0}
        value={formData.order}
        onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
        helperText="Lower numbers appear first"
      />

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {ministry ? "Update Ministry" : "Create Ministry"}
        </Button>
      </div>
    </form>
  );
}
