"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { format } from "date-fns";
import { Plus, Pencil, Trash2, Calendar, MapPin, Clock } from "lucide-react";
import { AdminTable, PageHeader, ConfirmDialog, Column, ActionMenuItem } from "@/components/admin";
import { useToast } from "@/components/ui/Toast";
import Button from "@/components/ui/Button";
import type { Id } from "@/convex/_generated/dataModel";
import type { AdminEvent } from "@/types/admin";

export default function EventsAdminPage() {
  const router = useRouter();
  const { success, error: showError } = useToast();
  const events = useQuery(api.events.queries.listAll);
  const deleteEvent = useMutation(api.events.mutations.deleteEvent);

  const [deleteId, setDeleteId] = useState<Id<"events"> | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await deleteEvent({ id: deleteId });
      setDeleteId(null);
      success("Event deleted successfully");
    } catch (err) {
      showError("Failed to delete event");
      console.error("Failed to delete:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: Column<AdminEvent>[] = [
    {
      key: "title",
      header: "Event",
      sortable: true,
      searchable: true,
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
  ];

  const actions: ActionMenuItem<AdminEvent>[] = [
    {
      label: "Edit",
      icon: <Pencil className="w-4 h-4" />,
      onClick: (event) => router.push(`/dashboard/events/${event._id}`),
    },
    {
      label: "Delete",
      icon: <Trash2 className="w-4 h-4" />,
      onClick: (event) => setDeleteId(event._id as Id<"events">),
      variant: "danger",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Events"
        description="Manage church events and calendar"
        count={events?.length}
        actions={
          <Link href="/dashboard/events/new">
            <Button leftIcon={<Plus className="w-4 h-4" />}>Add Event</Button>
          </Link>
        }
      />

      <AdminTable
        data={events}
        columns={columns}
        keyExtractor={(event) => event._id}
        onRowClick={(event) => router.push(`/dashboard/events/${event._id}`)}
        emptyMessage="No events yet. Create your first event to get started."
        emptyIcon="inbox"
        selectable
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Search events..."
        actions={actions}
      />

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
