"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Plus, Pencil, Trash2, Mail, Phone } from "lucide-react";
import { AdminTable, ConfirmDialog, Column } from "@/components/admin";
import Button from "@/components/ui/Button";
import type { Id } from "@/convex/_generated/dataModel";
import type { AdminStaff } from "@/types/admin";

type StaffMember = AdminStaff;

export default function StaffAdminPage() {
  const router = useRouter();
  const staff = useQuery(api.staff.queries.listAll);
  const deleteStaff = useMutation(api.staff.mutations.deleteStaff);

  const [deleteId, setDeleteId] = useState<Id<"staff"> | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await deleteStaff({ id: deleteId });
      setDeleteId(null);
    } catch (error) {
      console.error("Failed to delete:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: Column<StaffMember>[] = [
    {
      key: "name",
      header: "Staff Member",
      sortable: true,
      render: (person) => (
        <div className="flex items-center gap-3">
          {person.photoUrl ? (
            <img
              src={person.photoUrl}
              alt=""
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <span className="text-lg font-semibold text-amber-700 dark:text-amber-400">
                {person.name.charAt(0)}
              </span>
            </div>
          )}
          <div>
            <p className="font-medium text-stone-900 dark:text-stone-100">
              {person.name}
            </p>
            <p className="text-sm text-stone-500 dark:text-stone-400">
              {person.title}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      render: (person) => (
        <span className="text-sm text-stone-600 dark:text-stone-400">
          {person.role}
        </span>
      ),
    },
    {
      key: "department",
      header: "Department",
      render: (person) => (
        <span className="px-2 py-1 text-xs font-medium bg-stone-100 text-stone-700 dark:bg-stone-700 dark:text-stone-300 rounded-full">
          {person.department || "N/A"}
        </span>
      ),
    },
    {
      key: "contact",
      header: "Contact",
      render: (person) => (
        <div className="flex items-center gap-3">
          {person.email && (
            <a
              href={`mailto:${person.email}`}
              className="p-2 hover:bg-stone-100 dark:hover:bg-stone-700 rounded-lg transition-colors"
            >
              <Mail className="w-4 h-4 text-stone-400" />
            </a>
          )}
          {person.phone && (
            <a
              href={`tel:${person.phone}`}
              className="p-2 hover:bg-stone-100 dark:hover:bg-stone-700 rounded-lg transition-colors"
            >
              <Phone className="w-4 h-4 text-stone-400" />
            </a>
          )}
        </div>
      ),
    },
    {
      key: "isActive",
      header: "Status",
      render: (person) => (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            person.isActive
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              : "bg-stone-100 text-stone-500 dark:bg-stone-700 dark:text-stone-400"
          }`}
        >
          {person.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "w-24",
      render: (person) => (
        <div className="flex items-center justify-end gap-2">
          <Link
            href={`/dashboard/staff/${person._id}`}
            className="p-2 hover:bg-stone-100 dark:hover:bg-stone-700 rounded-lg transition-colors"
          >
            <Pencil className="w-4 h-4 text-stone-500" />
          </Link>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDeleteId(person._id);
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
            Staff
          </h1>
          <p className="text-stone-600 dark:text-stone-400 mt-1">
            Manage church staff and leadership
          </p>
        </div>
        <Link href="/dashboard/staff/new">
          <Button leftIcon={<Plus className="w-4 h-4" />}>Add Staff Member</Button>
        </Link>
      </div>

      {staff === undefined ? (
        <div className="bg-white dark:bg-stone-800 rounded-xl p-12 text-center border border-stone-200 dark:border-stone-700">
          <div className="animate-pulse">
            <div className="h-6 bg-stone-200 dark:bg-stone-700 rounded w-1/4 mx-auto mb-4" />
            <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded w-1/2 mx-auto" />
          </div>
        </div>
      ) : (
        <AdminTable
          data={staff}
          columns={columns}
          keyExtractor={(person) => person._id}
          onRowClick={(person) => router.push(`/dashboard/staff/${person._id}`)}
          emptyMessage="No staff members yet. Add your first staff member to get started."
        />
      )}

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Staff Member"
        message="Are you sure you want to delete this staff member? This action cannot be undone."
        confirmText="Delete"
        isLoading={isDeleting}
      />
    </div>
  );
}
