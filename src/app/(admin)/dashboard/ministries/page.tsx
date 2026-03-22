"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Plus, Pencil, Trash2, Clock, MapPin, User } from "lucide-react";
import { AdminTable, ConfirmDialog, Column } from "@/components/admin";
import Button from "@/components/ui/Button";
import type { Id } from "@/convex/_generated/dataModel";

type Ministry = {
  _id: Id<"ministries">;
  _creationTime: number;
  name: string;
  description: string;
  category: "youth" | "adult" | "family" | "music";
  imageUrl?: string;
  leaderId?: Id<"staff">;
  meetingTime?: string;
  meetingLocation?: string;
  order: number;
};

type StaffMember = {
  _id: Id<"staff">;
  name: string;
};

export default function MinistriesAdminPage() {
  const router = useRouter();
  const ministries = useQuery(api.ministries.queries.listAll);
  const staff = useQuery(api.staff.queries.listActive);
  const deleteMinistry = useMutation(api.ministries.mutations.deleteMinistry);

  const [deleteId, setDeleteId] = useState<Id<"ministries"> | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const getLeaderName = (leaderId?: Id<"staff">) => {
    if (!leaderId) return "Unassigned";
    const leader = staff?.find((s: StaffMember) => s._id === leaderId);
    return leader?.name || "Unknown";
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await deleteMinistry({ id: deleteId });
      setDeleteId(null);
    } catch (error) {
      console.error("Failed to delete:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: Column<Ministry>[] = [
    {
      key: "name",
      header: "Ministry",
      sortable: true,
      render: (ministry) => (
        <div className="flex items-center gap-3">
          {ministry.imageUrl ? (
            <img
              src={ministry.imageUrl}
              alt=""
              className="w-12 h-12 rounded-lg object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <span className="text-lg font-semibold text-green-700 dark:text-green-400">
                {ministry.name.charAt(0)}
              </span>
            </div>
          )}
          <div>
            <p className="font-medium text-stone-900 dark:text-stone-100">
              {ministry.name}
            </p>
            <p className="text-sm text-stone-500 line-clamp-1">
              {ministry.description}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "leader",
      header: "Leader",
      render: (ministry) => (
        <div className="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-400">
          <User className="w-4 h-4" />
          <span>{getLeaderName(ministry.leaderId)}</span>
        </div>
      ),
    },
    {
      key: "meetingTime",
      header: "Meeting",
      render: (ministry) => (
        <div className="space-y-1">
          {ministry.meetingTime && (
            <div className="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-400">
              <Clock className="w-4 h-4" />
              <span>{ministry.meetingTime}</span>
            </div>
          )}
          {ministry.meetingLocation && (
            <div className="flex items-center gap-2 text-sm text-stone-500">
              <MapPin className="w-4 h-4" />
              <span>{ministry.meetingLocation}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      render: (ministry) => (
        <span className="px-2 py-1 text-xs font-medium bg-stone-100 text-stone-700 dark:bg-stone-700 dark:text-stone-300 rounded-full">
          {ministry.category}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "w-24",
      render: (ministry) => (
        <div className="flex items-center justify-end gap-2">
          <Link
            href={`/dashboard/ministries/${ministry._id}`}
            className="p-2 hover:bg-stone-100 dark:hover:bg-stone-700 rounded-lg transition-colors"
          >
            <Pencil className="w-4 h-4 text-stone-500" />
          </Link>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDeleteId(ministry._id);
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
            Ministries
          </h1>
          <p className="text-stone-600 dark:text-stone-400 mt-1">
            Manage church ministries and programs
          </p>
        </div>
        <Link href="/dashboard/ministries/new">
          <Button leftIcon={<Plus className="w-4 h-4" />}>Add Ministry</Button>
        </Link>
      </div>

      {ministries === undefined ? (
        <div className="bg-white dark:bg-stone-800 rounded-xl p-12 text-center border border-stone-200 dark:border-stone-700">
          <div className="animate-pulse">
            <div className="h-6 bg-stone-200 dark:bg-stone-700 rounded w-1/4 mx-auto mb-4" />
            <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded w-1/2 mx-auto" />
          </div>
        </div>
      ) : (
        <AdminTable
          data={ministries}
          columns={columns}
          keyExtractor={(m) => m._id}
          onRowClick={(m) => router.push(`/dashboard/ministries/${m._id}`)}
          emptyMessage="No ministries yet. Create your first ministry to get started."
        />
      )}

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Ministry"
        message="Are you sure you want to delete this ministry? This action cannot be undone."
        confirmText="Delete"
        isLoading={isDeleting}
      />
    </div>
  );
}
