"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Clock, MapPin, User } from "lucide-react";
import { AdminPageShell, AdminTable, ConfirmDialog, Column } from "@/components/admin";
import { useFetch, deleteItem } from "@/hooks/useData";
import type { AdminMinistry, AdminStaff } from "@/types/admin";

export default function MinistriesAdminPage() {
  const router = useRouter();
  const { data: ministries, isLoading, refetch } = useFetch<AdminMinistry[]>("/api/ministries");
  const { data: staff } = useFetch<AdminStaff[]>("/api/staff?active=true");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const getLeaderName = (leaderId?: string) => {
    if (!leaderId) return "Unassigned";
    const leader = staff?.find((s) => s.id === leaderId);
    return leader?.name || "Unknown";
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await deleteItem(`/api/ministries/${deleteId}`);
      setDeleteId(null);
      refetch();
    } catch {
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: Column<AdminMinistry>[] = [
    {
      key: "name",
      header: "Ministry",
      sortable: true,
      render: (ministry) => (
        <div className="flex items-center gap-3">
          {ministry.imageUrl ? (
            <img src={ministry.imageUrl} alt="" className="w-12 h-12 rounded-lg object-cover" />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <span className="text-lg font-semibold text-amber-700 dark:text-amber-400">{ministry.name.charAt(0)}</span>
            </div>
          )}
          <div>
            <p className="font-medium text-stone-900 dark:text-stone-100">{ministry.name}</p>
            <p className="text-sm text-stone-500 line-clamp-1">{ministry.description}</p>
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
          <Link href={`/dashboard/ministries/${ministry.id}`} className="p-2 hover:bg-stone-100 dark:hover:bg-stone-700 rounded-lg transition-colors">
            <Pencil className="w-4 h-4 text-stone-500" />
          </Link>
          <button onClick={(e) => { e.stopPropagation(); setDeleteId(ministry.id); }} className="p-2 hover:bg-rose-100 dark:hover:bg-rose-900/30 rounded-lg transition-colors">
            <Trash2 className="w-4 h-4 text-rose-500" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminPageShell
      title="Ministries"
      description="Manage church ministries and programs"
      addButtonLabel="Add Ministry"
      addButtonHref="/dashboard/ministries/new"
      isLoading={isLoading}
    >
      <AdminTable
        data={ministries}
        columns={columns}
        keyExtractor={(m) => m.id}
        onRowClick={(m) => router.push(`/dashboard/ministries/${m.id}`)}
        emptyMessage="No ministries yet. Create your first ministry to get started."
      />

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Ministry"
        message="Are you sure you want to delete this ministry? This action cannot be undone."
        confirmText="Delete"
        isLoading={isDeleting}
      />
    </AdminPageShell>
  );
}
