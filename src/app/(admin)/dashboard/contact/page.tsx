"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Eye, Check, Mail, Trash2, MessageSquare } from "lucide-react";
import { AdminPageShell, AdminTable, ConfirmDialog, Column, Modal } from "@/components/admin";
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
    } catch {}
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await deleteItem(`/api/contact/${deleteId}`);
      setDeleteId(null);
      refetch();
    } catch {
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
          <div className={`p-2 rounded-lg ${submission.isRead ? "bg-stone-100 dark:bg-stone-700" : "bg-amber-100 dark:bg-amber-900/30"}`}>
            <MessageSquare className={`w-4 h-4 ${submission.isRead ? "text-stone-400" : "text-amber-600"}`} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-medium text-stone-900 dark:text-stone-100">{submission.name}</p>
              {!submission.isRead && (
                <span className="px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded-full">New</span>
              )}
            </div>
            <p className="text-sm text-stone-500 line-clamp-1 mt-1">{submission.message}</p>
          </div>
        </div>
      ),
    },
    {
      key: "email",
      header: "Email",
      render: (submission) => (
        <a href={`mailto:${submission.email}`} className="text-sm text-amber-600 hover:text-amber-700 flex items-center gap-2">
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
        <span className="text-sm text-stone-500 dark:text-stone-400">{format(new Date(submission.date), "MMM d, yyyy")}</span>
      ),
    },
    {
      key: "isRead",
      header: "Status",
      render: (submission) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${submission.isRead ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"}`}>
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
          <button onClick={() => setSelectedSubmission(submission)} className="p-2 hover:bg-stone-100 dark:hover:bg-stone-700 rounded-lg transition-colors">
            <Eye className="w-4 h-4 text-stone-500" />
          </button>
          {!submission.isRead && (
            <button onClick={() => handleMarkAsRead(submission.id)} className="p-2 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 rounded-lg transition-colors" title="Mark as read">
              <Check className="w-4 h-4 text-emerald-600" />
            </button>
          )}
          <button onClick={() => setDeleteId(submission.id)} className="p-2 hover:bg-rose-100 dark:hover:bg-rose-900/30 rounded-lg transition-colors">
            <Trash2 className="w-4 h-4 text-rose-500" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminPageShell title="Contact Submissions" description="View and manage contact form submissions" isLoading={isLoading}>
      <AdminTable data={submissions} columns={columns} keyExtractor={(s) => s.id} emptyMessage="No contact submissions yet." />

      <Modal isOpen={!!selectedSubmission} onClose={() => setSelectedSubmission(null)} title="Submission Details" size="md">
        {selectedSubmission && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold text-stone-900 dark:text-stone-100">{selectedSubmission.name}</p>
                <a href={`mailto:${selectedSubmission.email}`} className="text-sm text-amber-600 hover:text-amber-700 flex items-center gap-2 mt-1">
                  <Mail className="w-4 h-4" />
                  {selectedSubmission.email}
                </a>
              </div>
              <span className="text-sm text-stone-500 dark:text-stone-400">{format(new Date(selectedSubmission.date), "MMM d, yyyy h:mm a")}</span>
            </div>
            <div className="pt-4 border-t border-[var(--border-subtle)] dark:border-stone-700">
              <p className="text-sm font-medium text-stone-500 dark:text-stone-400 mb-2">Message</p>
              <p className="text-stone-900 dark:text-stone-100 whitespace-pre-wrap">{selectedSubmission.message}</p>
            </div>
            <div className="flex items-center gap-3 pt-4 border-t border-[var(--border-subtle)] dark:border-stone-700">
              {!selectedSubmission.isRead && (
                <button onClick={() => { handleMarkAsRead(selectedSubmission.id); setSelectedSubmission(null); }} className="px-4 py-2 rounded-lg text-sm font-medium bg-emerald-100 text-emerald-700 hover:bg-emerald-200">
                  Mark as Read
                </button>
              )}
              <button onClick={() => { setDeleteId(selectedSubmission.id); setSelectedSubmission(null); }} className="px-4 py-2 rounded-lg text-sm font-medium bg-rose-100 text-rose-700 hover:bg-rose-200">
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
    </AdminPageShell>
  );
}
