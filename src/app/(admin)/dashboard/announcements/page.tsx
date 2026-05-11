"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Pencil, Trash2, Pin, PinOff, Bell } from "lucide-react";
import { AdminPageShell, AdminTable, ConfirmDialog, Column } from "@/components/admin";
import { useFetch, deleteItem } from "@/hooks/useData";

type Announcement = {
  id: string;
  createdAt: string;
  title: string;
  content: string;
  date: string;
  category: "youth" | "community" | "general" | "ministry";
  priority: "low" | "normal" | "high";
  imageUrl?: string;
  expiresAt?: string;
  isPinned: boolean;
};

const priorityBadge: Record<string, string> = {
  high: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
  low: "bg-stone-100 text-stone-700 dark:bg-stone-700 dark:text-stone-300",
  normal: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
};

const priorityIconBg: Record<string, string> = {
  high: "bg-rose-100 dark:bg-rose-900/30 text-rose-600",
  low: "bg-stone-100 dark:bg-stone-700 text-stone-600",
  normal: "bg-amber-100 dark:bg-amber-900/30 text-amber-600",
};

export default function AnnouncementsAdminPage() {
  const { data: announcements, isLoading, refetch } = useFetch<Announcement[]>("/api/announcements");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await deleteItem(`/api/announcements/${deleteId}`);
      setDeleteId(null);
      refetch();
    } catch {
    } finally {
      setIsDeleting(false);
    }
  };

  const handleTogglePin = async (id: string, currentPinned: boolean) => {
    try {
      await fetch(`/api/announcements/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPinned: !currentPinned }),
      });
      refetch();
    } catch {}
  };

  const columns: Column<Announcement>[] = [
    {
      key: "title",
      header: "Announcement",
      sortable: true,
      render: (announcement) => (
        <div className="flex items-start gap-3">
          <div className={`mt-1 p-2 rounded-lg ${priorityIconBg[announcement.priority] || priorityIconBg.normal}`}>
            <Bell className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-medium text-stone-900 dark:text-stone-100 truncate">{announcement.title}</p>
              {announcement.isPinned && (
                <span className="px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded-full">Pinned</span>
              )}
            </div>
            <p className="text-sm text-stone-500 line-clamp-2 mt-1">{announcement.content}</p>
          </div>
        </div>
      ),
    },
    {
      key: "priority",
      header: "Priority",
      render: (announcement) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${priorityBadge[announcement.priority] || priorityBadge.normal}`}>
          {announcement.priority || "normal"}
        </span>
      ),
    },
    {
      key: "category",
      header: "Category",
      render: (announcement) => (
        <span className="text-sm text-stone-600 dark:text-stone-400">{announcement.category || "general"}</span>
      ),
    },
    {
      key: "date",
      header: "Date",
      sortable: true,
      render: (announcement) => (
        <span className="text-sm text-stone-500 dark:text-stone-400">{format(new Date(announcement.date), "MMM d, yyyy")}</span>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "w-32",
      render: (announcement) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); handleTogglePin(announcement.id, announcement.isPinned); }}
            className={`p-2 rounded-lg transition-colors ${announcement.isPinned ? "hover:bg-amber-100 dark:hover:bg-amber-900/30" : "hover:bg-stone-100 dark:hover:bg-stone-700"}`}
          >
            {announcement.isPinned ? <PinOff className="w-4 h-4 text-amber-600" /> : <Pin className="w-4 h-4 text-stone-400" />}
          </button>
          <a href={`/dashboard/announcements/${announcement.id}`} className="p-2 hover:bg-stone-100 dark:hover:bg-stone-700 rounded-lg transition-colors">
            <Pencil className="w-4 h-4 text-stone-500" />
          </a>
          <button
            onClick={(e) => { e.stopPropagation(); setDeleteId(announcement.id); }}
            className="p-2 hover:bg-rose-100 dark:hover:bg-rose-900/30 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4 text-rose-500" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminPageShell
      title="Announcements"
      description="Manage church announcements and news"
      addButtonLabel="Add Announcement"
      addButtonHref="/dashboard/announcements/new"
      isLoading={isLoading}
    >
      <AdminTable
        data={announcements || []}
        columns={columns}
        keyExtractor={(a) => a.id}
        emptyMessage="No announcements yet. Create your first announcement to get started."
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
    </AdminPageShell>
  );
}
