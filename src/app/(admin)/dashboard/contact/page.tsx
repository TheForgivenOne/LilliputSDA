"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { format } from "date-fns";
import { Eye, Check, Mail, Trash2, MessageSquare } from "lucide-react";
import { AdminTable, PageHeader, ConfirmDialog, Modal, Column, ActionMenuItem } from "@/components/admin";
import { useToast } from "@/components/ui/Toast";
import type { Id } from "@/convex/_generated/dataModel";

type Submission = {
  _id: Id<"contactSubmissions">;
  _creationTime: number;
  name: string;
  email: string;
  message: string;
  date: string;
  isRead: boolean;
};

export default function ContactAdminPage() {
  const { success, error: showError } = useToast();
  const submissions = useQuery(api.contact.queries.listAll);
  const markAsRead = useMutation(api.contact.mutations.markAsRead);
  const deleteSubmission = useMutation(api.contact.mutations.deleteSubmission);

  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [deleteId, setDeleteId] = useState<Id<"contactSubmissions"> | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const handleMarkAsRead = async (id: Id<"contactSubmissions">) => {
    try {
      await markAsRead({ id });
      success("Marked as read");
    } catch (err) {
      showError("Failed to mark as read");
      console.error("Failed to mark as read:", err);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await deleteSubmission({ id: deleteId });
      setDeleteId(null);
      success("Submission deleted successfully");
    } catch (err) {
      showError("Failed to delete submission");
      console.error("Failed to delete:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: Column<Submission>[] = [
    {
      key: "name",
      header: "Submission",
      sortable: true,
      searchable: true,
      render: (submission) => (
        <div className="flex items-start gap-3">
          <div
            className={`mt-1 p-2 rounded-lg ${
              submission.isRead
                ? "bg-stone-100 dark:bg-stone-700"
                : "bg-amber-100 dark:bg-amber-900/30"
            }`}
          >
            <MessageSquare
              className={`w-4 h-4 ${
                submission.isRead ? "text-stone-400" : "text-amber-600"
              }`}
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-medium text-stone-900 dark:text-stone-100">
                {submission.name}
              </p>
              {!submission.isRead && (
                <span className="px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded-full">
                  New
                </span>
              )}
            </div>
            <p className="text-sm text-stone-500 line-clamp-1 mt-1">
              {submission.message}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "email",
      header: "Email",
      render: (submission) => (
        <a
          href={`mailto:${submission.email}`}
          className="text-sm text-amber-600 hover:text-amber-700 flex items-center gap-2"
        >
          <Mail className="w-4 h-4" />
          {submission.email}
        </a>
      ),
    },
    {
      key: "date",
      header: "Date",
      sortable: true,
      render: (submission) => (
        <span className="text-sm text-stone-500 dark:text-stone-400">
          {format(new Date(submission.date), "MMM d, yyyy")}
        </span>
      ),
    },
    {
      key: "isRead",
      header: "Status",
      render: (submission) => (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            submission.isRead
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
          }`}
        >
          {submission.isRead ? "Read" : "Unread"}
        </span>
      ),
    },
  ];

  const actions: ActionMenuItem<Submission>[] = [
    {
      label: "View",
      icon: <Eye className="w-4 h-4" />,
      onClick: setSelectedSubmission,
    },
    {
      label: (s) => s.isRead ? "" : "Mark as Read",
      icon: <Check className="w-4 h-4" />,
      onClick: (s) => {
        if (!s.isRead) handleMarkAsRead(s._id);
      },
    },
    {
      label: "Delete",
      icon: <Trash2 className="w-4 h-4" />,
      onClick: (s) => setDeleteId(s._id as Id<"contactSubmissions">),
      variant: "danger",
    },
  ];

  const unreadCount = submissions?.filter((s) => !s.isRead).length ?? 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Contact Submissions"
        description="View and manage contact form submissions"
        count={submissions?.length}
        badge={unreadCount > 0 ? { label: `${unreadCount} unread`, variant: "warning" } : undefined}
      />

      <AdminTable
        data={submissions}
        columns={columns}
        keyExtractor={(s) => s._id}
        onRowClick={setSelectedSubmission}
        emptyMessage="No contact submissions yet."
        emptyIcon="inbox"
        selectable
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Search submissions..."
        actions={actions}
      />

      <Modal
        isOpen={!!selectedSubmission}
        onClose={() => setSelectedSubmission(null)}
        title="Submission Details"
        size="md"
      >
        {selectedSubmission && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                  {selectedSubmission.name}
                </p>
                <a
                  href={`mailto:${selectedSubmission.email}`}
                  className="text-sm text-amber-600 hover:text-amber-700 flex items-center gap-2 mt-1"
                >
                  <Mail className="w-4 h-4" />
                  {selectedSubmission.email}
                </a>
              </div>
              <span className="text-sm text-stone-500 dark:text-stone-400">
                {format(new Date(selectedSubmission.date), "MMM d, yyyy h:mm a")}
              </span>
            </div>
            <div className="pt-4 border-t border-stone-200 dark:border-stone-700">
              <p className="text-sm font-medium text-stone-500 dark:text-stone-400 mb-2">
                Message
              </p>
              <p className="text-stone-900 dark:text-stone-100 whitespace-pre-wrap">
                {selectedSubmission.message}
              </p>
            </div>
            <div className="flex items-center gap-3 pt-4 border-t border-stone-200 dark:border-stone-700">
              {!selectedSubmission.isRead && (
                <button
                  onClick={() => {
                    if (selectedSubmission) handleMarkAsRead(selectedSubmission._id);
                    setSelectedSubmission(null);
                  }}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-green-100 text-green-700 hover:bg-green-200"
                >
                  Mark as Read
                </button>
              )}
              <button
                onClick={() => {
                  setDeleteId(selectedSubmission._id as Id<"contactSubmissions">);
                  setSelectedSubmission(null);
                }}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-rose-100 text-rose-700 hover:bg-rose-200"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Submission"
        message="Are you sure you want to delete this submission? This action cannot be undone."
        confirmText="Delete"
        isLoading={isDeleting}
      />
    </div>
  );
}
