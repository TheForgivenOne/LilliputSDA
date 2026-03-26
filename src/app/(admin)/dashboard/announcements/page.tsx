"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Plus, Pencil, Trash2, Pin, PinOff, Bell } from "lucide-react";
import { AdminTable, ConfirmDialog, Column } from "@/components/admin";
import Button from "@/components/ui/Button";

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
  const announcements = useQuery(api.announcements.queries.listLatest);
  const deleteAnnouncement = useMutation(api.announcements.mutations.deleteAnnouncement);
  const togglePin = useMutation(api.announcements.mutations.togglePin);

  const [deleteId, setDeleteId] = useState<Id<"announcements"> | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await deleteAnnouncement({ id: deleteId });
      setDeleteId(null);
    } catch (error) {
      console.error("Failed to delete:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleTogglePin = async (id: Id<"announcements">) => {
    try {
      await togglePin({ id });
    } catch (error) {
      console.error("Failed to toggle pin:", error);
    }
  };

  const columns: Column<Announcement>[] = [
    {
      key: "title",
      header: "Announcement",
      sortable: true,
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
    {
      key: "actions",
      header: "",
      className: "w-32",
      render: (announcement) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleTogglePin(announcement._id);
            }}
            className={`p-2 rounded-lg transition-colors ${
              announcement.isPinned
                ? "hover:bg-amber-100 dark:hover:bg-amber-900/30"
                : "hover:bg-stone-100 dark:hover:bg-stone-700"
            }`}
          >
            {announcement.isPinned ? (
              <PinOff className="w-4 h-4 text-amber-600" />
            ) : (
              <Pin className="w-4 h-4 text-stone-400" />
            )}
          </button>
          <a
            href={`/dashboard/announcements/${announcement._id}`}
            className="p-2 hover:bg-stone-100 dark:hover:bg-stone-700 rounded-lg transition-colors"
          >
            <Pencil className="w-4 h-4 text-stone-500" />
          </a>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDeleteId(announcement._id);
            }}
            className="p-2 hover:bg-rose-100 dark:hover:bg-rose-900/30 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4 text-rose-500" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">
            Announcements
          </h1>
          <p className="text-stone-600 dark:text-stone-400 mt-1">
            Manage church announcements and news
          </p>
        </div>
        <Link href="/dashboard/announcements/new">
          <Button leftIcon={<Plus className="w-4 h-4" />}>Add Announcement</Button>
        </Link>
      </div>

      {announcements === undefined ? (
        <div className="bg-white dark:bg-stone-800 rounded-xl p-12 text-center border border-stone-200 dark:border-stone-700">
          <div className="animate-pulse">
            <div className="h-6 bg-stone-200 dark:bg-stone-700 rounded w-1/4 mx-auto mb-4" />
            <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded w-1/2 mx-auto" />
          </div>
        </div>
      ) : (
        <AdminTable
          data={announcements}
          columns={columns}
          keyExtractor={(a) => a._id}
          emptyMessage="No announcements yet. Create your first announcement to get started."
        />
      )}

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
