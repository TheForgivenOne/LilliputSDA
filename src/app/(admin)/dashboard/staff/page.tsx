"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Plus, Pencil, Trash2, Mail as MailIcon } from "lucide-react";
import { AdminTable, PageHeader, ConfirmDialog, Column, ActionMenuItem } from "@/components/admin";
import { useToast } from "@/components/ui/Toast";
import Button from "@/components/ui/Button";
import type { Id } from "@/convex/_generated/dataModel";
import type { AdminStaff } from "@/types/admin";

export default function StaffAdminPage() {
  const router = useRouter();
  const { success, error: showError } = useToast();
  const staff = useQuery(api.staff.queries.listAll);
  const deleteStaff = useMutation(api.staff.mutations.deleteStaff);

  const [deleteId, setDeleteId] = useState<Id<"staff"> | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await deleteStaff({ id: deleteId });
      setDeleteId(null);
      success("Staff member deleted successfully");
    } catch (err) {
      showError("Failed to delete staff member");
      console.error("Failed to delete:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: Column<AdminStaff>[] = [
    {
      key: "name",
      header: "Staff Member",
      sortable: true,
      searchable: true,
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
              <MailIcon className="w-4 h-4 text-stone-400" />
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
  ];

  const actions: ActionMenuItem<AdminStaff>[] = [
    {
      label: "Edit",
      icon: <Pencil className="w-4 h-4" />,
      onClick: (person) => router.push(`/dashboard/staff/${person._id}`),
    },
    {
      label: "Delete",
      icon: <Trash2 className="w-4 h-4" />,
      onClick: (person) => setDeleteId(person._id as Id<"staff">),
      variant: "danger",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Staff"
        description="Manage church staff and leadership"
        count={staff?.length}
        actions={
          <Link href="/dashboard/staff/new">
            <Button leftIcon={<Plus className="w-4 h-4" />}>Add Staff Member</Button>
          </Link>
        }
      />

      <AdminTable
        data={staff}
        columns={columns}
        keyExtractor={(s) => s._id}
        onRowClick={(s) => router.push(`/dashboard/staff/${s._id}`)}
        emptyMessage="No staff members yet. Add your first staff member to get started."
        emptyIcon="inbox"
        selectable
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Search staff..."
        actions={actions}
      />

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
