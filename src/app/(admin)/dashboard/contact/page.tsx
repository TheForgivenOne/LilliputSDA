"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Eye, Check, Mail, Trash2, MessageSquare } from "lucide-react";
import { AdminTable, ConfirmDialog, Column, Modal } from "@/components/admin";
import { useFetch, updateItem, deleteItem } from "@/hooks/useData";

type Submission = {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string;
  isRead: boolean;
};

export default function ContactAdminPage() {
  const { data: submissions, isLoading, refetch } = useFetch<Submission[]>("/api/contact");

  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleMarkAsRead = async (id: string) => {
    try {
      await updateItem(`/api/contact/${id}`, { isRead: true });
      refetch();
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await deleteItem(`/api/contact/${deleteId}`);
      setDeleteId(null);
      refetch();
    } catch (error) {
      console.error("Failed to delete:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: Column<Submission>[] = [
    {
      key: "name",
      header: "Submission",
      sortable: true,
      render: (submission) => (
        <div className="flex items-start gap-3">
          <div
            className={`p-2 rounded-lg ${
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
    {
      key: "actions",
      header: "",
      className: "w-32",
      render: (submission) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => setSelectedSubmission(submission)}
            className="p-2 hover:bg-stone-100 dark:hover:bg-stone-700 rounded-lg transition-colors"
          >
            <Eye className="w-4 h-4 text-stone-500" />
          </button>
            {!submission.isRead && (
            <button
              onClick={() => handleMarkAsRead(submission.id)}
              className="p-2 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors"
              title="Mark as read"
            >
              <Check className="w-4 h-4 text-green-600" />
            </button>
          )}
          <button
            onClick={() => setDeleteId(submission.id)}
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
      <div>
        <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">
          Contact Submissions
        </h1>
        <p className="text-stone-600 dark:text-stone-400 mt-1">
          View and manage contact form submissions
        </p>
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
          data={submissions}
          columns={columns}
          keyExtractor={(s) => s.id}
          emptyMessage="No contact submissions yet."
        />
      )}

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
                    if (selectedSubmission) handleMarkAsRead(selectedSubmission.id);
                    setSelectedSubmission(null);
                  }}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-green-100 text-green-700 hover:bg-green-200"
                >
                  Mark as Read
                </button>
              )}
              <button
                onClick={() => {
                  setDeleteId(selectedSubmission.id);
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
