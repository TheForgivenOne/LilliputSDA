"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input, Textarea, Select, Checkbox } from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { createItem, updateItem } from "@/hooks/useData";

const departments = [
  { value: "pastoral", label: "Pastoral" },
  { value: "elder", label: "Elder" },
  { value: "deacon", label: "Deacon" },
  { value: "music", label: "Music Ministry" },
  { value: "youth", label: "Youth" },
  { value: "children", label: "Children's Ministry" },
  { value: "outreach", label: "Community Outreach" },
  { value: "administration", label: "Administration" },
];

interface StaffFormProps {
  staff?: {
    _id: string;
    name: string;
    role?: string;
    title: string;
    bio?: string;
    photoUrl?: string;
    email?: string;
    phone?: string;
    department?: string;
    order?: number;
    isActive?: boolean;
  };
}

export function StaffForm({ staff }: StaffFormProps) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: staff?.name || "",
    role: staff?.role || "",
    title: staff?.title || "",
    bio: staff?.bio || "",
    photoUrl: staff?.photoUrl || "",
    email: staff?.email || "",
    phone: staff?.phone || "",
    department: staff?.department || "",
    order: staff?.order ?? 0,
    isActive: staff?.isActive ?? true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const data = {
        name: formData.name,
        role: formData.role,
        title: formData.title,
        bio: formData.bio || undefined,
        photoUrl: formData.photoUrl || undefined,
        email: formData.email || undefined,
        phone: formData.phone || undefined,
        department: formData.department || undefined,
        order: formData.order,
        isActive: formData.isActive,
      };

      if (staff?._id) {
        await updateItem(`/api/staff/${staff._id}`, data);
      } else {
        await createItem("/api/staff", data);
      }

      router.push("/dashboard/staff");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save staff member");
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Full Name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="John Smith"
        />

        <Input
          label="Role/Position"
          required
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          placeholder="Senior Pastor, Elder, etc."
        />
      </div>

      <Input
        label="Title"
        required
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        placeholder="Formal title"
      />

      <Textarea
        label="Biography"
        rows={4}
        value={formData.bio}
        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
        placeholder="Brief biography..."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Photo URL"
          type="url"
          value={formData.photoUrl}
          onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
          placeholder="https://example.com/photo.jpg"
        />

        <Select
          label="Department"
          options={departments}
          value={formData.department}
          onChange={(e) => setFormData({ ...formData, department: e.target.value })}
          placeholder="Select department"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="john@example.com"
        />

        <Input
          label="Phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="(555) 123-4567"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Display Order"
          type="number"
          min={0}
          value={formData.order}
          onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
          helperText="Lower numbers appear first"
        />

        <Checkbox
          label="Active"
          checked={formData.isActive}
          onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
          helperText="Inactive staff won't be displayed on the website"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {staff ? "Update Staff" : "Add Staff Member"}
        </Button>
      </div>
    </form>
  );
}
