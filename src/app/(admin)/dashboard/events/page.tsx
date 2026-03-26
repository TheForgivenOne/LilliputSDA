"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Plus, Pencil, Trash2, Calendar, MapPin, Clock } from "lucide-react";
import { AdminTable, ConfirmDialog, Column } from "@/components/admin";
import Button from "@/components/ui/Button";
import { useFetch, deleteItem } from "@/hooks/useData";

type AdminEvent = {
  id: string;
  createdAt: string;
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

export default function EventsAdminPage() {
  const router = useRouter();
  const { data: events, isLoading, refetch } = useFetch<AdminEvent[]>("/api/events");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await deleteItem(`/api/events/${deleteId}`);
      setDeleteId(null);
      refetch();
    } catch (error) {
      console.error("Failed to delete:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: Column<AdminEvent>[] = [
    {
      key: "title",
      header: "Event",
      sortable: true,
      render: (event) => (
        <div className="flex items-center gap-3">
          {event.imageUrl ? (
            <img
              src={event.imageUrl}
              alt=""
              className="w-12 h-12 rounded-lg object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-amber-600" />
            </div>
          )}
          <div>
            <p className="font-medium text-stone-900 dark:text-stone-100">
              {event.title}
            </p>
            {event.description && (
              <p className="text-sm text-stone-500 line-clamp-1">
                {event.description}
              </p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "startDate",
      header: "Date & Time",
      sortable: true,
      render: (event) => (
        <div className="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-400">
          <Clock className="w-4 h-4" />
          <span>{format(new Date(event.startDate), "MMM d, yyyy h:mm a")}</span>
        </div>
      ),
    },
    {
      key: "location",
      header: "Location",
      render: (event) => (
        <div className="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-400">
          <MapPin className="w-4 h-4" />
          <span>{event.location || "TBD"}</span>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      render: (event) => (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            event.category === "youth"
              ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
              : event.category === "service"
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              : event.category === "community"
              ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
              : "bg-stone-100 text-stone-700 dark:bg-stone-700 dark:text-stone-300"
          }`}
        >
          {event.category}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "w-24",
      render: (event) => (
        <div className="flex items-center justify-end gap-2">
          <Link
            href={`/dashboard/events/${event.id}`}
            className="p-2 hover:bg-stone-100 dark:hover:bg-stone-700 rounded-lg transition-colors"
          >
            <Pencil className="w-4 h-4 text-stone-500" />
          </Link>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDeleteId(event.id);
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
            Events
          </h1>
          <p className="text-stone-600 dark:text-stone-400 mt-1">
            Manage church events and calendar
          </p>
        </div>
        <Link href="/dashboard/events/new">
          <Button leftIcon={<Plus className="w-4 h-4" />}>Add Event</Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="bg-white dark:bg-stone-800 rounded-xl p-12 text-center border border-stone-200 dark:border-stone-700">
          <div className="animate-pulse">
            <div className="h-6 bg-stone-200 dark:bg-stone-700 rounded w-1/4 mx-auto mb-4" />
            <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded w-1/2 mx-auto" />
          </div>
        </div>
      ) : (
        <AdminTable
          data={events || []}
          columns={columns}
          keyExtractor={(event) => event.id}
          onRowClick={(event) => router.push(`/dashboard/events/${event.id}`)}
          emptyMessage="No events yet. Create your first event to get started."
        />
      )}

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Event"
        message="Are you sure you want to delete this event? This action cannot be undone."
        confirmText="Delete"
        isLoading={isDeleting}
      />
    </div>
  );
}