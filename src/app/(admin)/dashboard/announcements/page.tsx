"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { format } from "date-fns";
import { Plus, Pencil, Trash2, Pin, Bell } from "lucide-react";
import { AdminTable, PageHeader, ConfirmDialog, Column, ActionMenuItem } from "@/components/admin";
import { useToast } from "@/components/ui/Toast";
import Button from "@/components/ui/Button";
import type { Id } from "@/convex/_generated/dataModel";

type Announcement = {
  _id: Id<"announcements">;
  _creationTime: number;
  title: string;
  content: string;
  date: string;
  category: "youth" | "community" | "general" | "ministry";
  priority: "low" | "normal" | "high";
  imageUrl?: string;
  expiresAt?: string;
  isPinned: boolean;
};

export default function AnnouncementsAdminPage() {
  const { success, error: showError } = useToast();
  const announcements = useQuery(api.announcements.queries.listLatest);
  const deleteAnnouncement = useMutation(api.announcements.mutations.deleteAnnouncement);
  const togglePin = useMutation(api.announcements.mutations.togglePin);

  const [deleteId, setDeleteId] = useState<Id<"announcements"> | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await deleteAnnouncement({ id: deleteId });
      setDeleteId(null);
      success("Announcement deleted successfully");
    } catch (err) {
      showError("Failed to delete announcement");
      console.error("Failed to delete:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleTogglePin = async (id: Id<"announcements">) => {
    try {
      await togglePin({ id });
      success("Pin status updated");
    } catch (err) {
      showError("Failed to update pin status");
      console.error("Failed to toggle pin:", err);
    }
  };

  const columns: Column<Announcement>[] = [
    {
      key: "title",
      header: "Announcement",
      sortable: true,
      searchable: true,
      render: (announcement) => (
        <div className="flex items-start gap-3">
          <div
            className={`mt-1 p-2 rounded-lg ${
              announcement.priority === "high"
                ? "bg-rose-100 dark:bg-rose-900/30"
                : announcement.priority === "low"
                ? "bg-stone-100 dark:bg-stone-700"
                : "bg-blue-100 dark:bg-blue-900/30"
            }`}
          >
            <Bell
              className={`w-4 h-4 ${
                announcement.priority === "high"
                  ? "text-rose-600"
                  : "text-blue-600"
              }`}
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-medium text-stone-900 dark:text-stone-100 truncate">
                {announcement.title}
              </p>
              {announcement.isPinned && (
                <span className="px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded-full">
                  Pinned
                </span>
              )}
            </div>
            <p className="text-sm text-stone-500 line-clamp-2 mt-1">
              {announcement.content}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "priority",
      header: "Priority",
      render: (announcement) => (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            announcement.priority === "high"
              ? "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
              : announcement.priority === "low"
              ? "bg-stone-100 text-stone-700 dark:bg-stone-700 dark:text-stone-300"
              : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
          }`}
        >
          {announcement.priority || "normal"}
        </span>
      ),
    },
    {
      key: "category",
      header: "Category",
      render: (announcement) => (
        <span className="text-sm text-stone-600 dark:text-stone-400">
          {announcement.category || "general"}
        </span>
      ),
    },
    {
      key: "date",
      header: "Date",
      sortable: true,
      render: (announcement) => (
        <span className="text-sm text-stone-500 dark:text-stone-400">
          {format(new Date(announcement.date), "MMM d, yyyy")}
        </span>
      ),
    },
  ];

  const actions: ActionMenuItem<Announcement>[] = [
    {
      label: (a) => a.isPinned ? "Unpin" : "Pin",
      icon: <Pin className="w-4 h-4" />,
      onClick: (announcement) => handleTogglePin(announcement._id),
    },
    {
      label: "Edit",
      icon: <Pencil className="w-4 h-4" />,
      onClick: (announcement) => {
        window.location.href = `/dashboard/announcements/${announcement._id}`;
      },
    },
    {
      label: "Delete",
      icon: <Trash2 className="w-4 h-4" />,
      onClick: (announcement) => setDeleteId(announcement._id),
      variant: "danger",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Announcements"
        description="Manage church announcements and news"
        count={announcements?.length}
        actions={
          <Link href="/dashboard/announcements/new">
            <Button leftIcon={<Plus className="w-4 h-4" />}>Add Announcement</Button>
          </Link>
        }
      />

      <AdminTable
        data={announcements}
        columns={columns}
        keyExtractor={(a) => a._id}
        emptyMessage="No announcements yet. Create your first announcement to get started."
        emptyIcon="inbox"
        selectable
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Search announcements..."
        actions={actions}
      />

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Announcement"
        message="Are you sure you want to delete this announcement? This action cannot be undone."
        confirmText="Delete"
        isLoading={isDeleting}
      />
    </div>
  );
}
