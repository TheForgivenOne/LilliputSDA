"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Eye, Mail, Phone, MessageSquare, Trash2 } from "lucide-react";
import { AdminTable, ConfirmDialog, Column, Modal } from "@/components/admin";
import { useFetch, updateItem, deleteItem } from "@/hooks/useData";

type Decision = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  decision: string;
  isAdventist: string | null;
  ageGroup: string | null;
  address: string | null;
  parish: string | null;
  country: string | null;
  prayerRequest: string | null;
  comments: string | null;
  source: string | null;
  isRead: boolean;
  createdAt: string;
};

const decisionLabels: Record<string, string> = {
  recommit: "Recommit to Christ",
  baptism: "Desire Baptism",
  "closer-walk": "Closer Walk with Jesus",
  "bible-study": "Bible Study",
  prayer: "Special Prayer",
  other: "Other",
};

export default function DecisionsAdminPage() {
  const { data: decisions, isLoading, refetch } = useFetch<Decision[]>("/api/decision");
  const [selectedDecision, setSelectedDecision] = useState<Decision | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleMarkAsRead = async (id: string) => {
    try {
      await updateItem(`/api/decision/${id}`, { isRead: true });
      refetch();
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await deleteItem(`/api/decision/${deleteId}`);
      setDeleteId(null);
      refetch();
    } catch (error) {
      console.error("Failed to delete:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: Column<Decision>[] = [
    {
      key: "name",
      header: "Person",
      sortable: true,
      render: (decision) => (
        <div className="flex items-start gap-3">
          <div
            className={`p-2 rounded-lg ${
              decision.isRead
                ? "bg-stone-100 dark:bg-stone-700"
                : "bg-amber-100 dark:bg-amber-900/30"
            }`}
          >
            <MessageSquare
              className={`w-4 h-4 ${
                decision.isRead ? "text-stone-400" : "text-amber-600"
              }`}
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-medium text-stone-900 dark:text-stone-100">
                {decision.name}
              </p>
              {!decision.isRead && (
                <span className="px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded-full">
                  New
                </span>
              )}
            </div>
            <p className="text-sm text-stone-500 line-clamp-1 mt-1">
              {decisionLabels[decision.decision] || decision.decision}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "decision",
      header: "Decision",
      render: (decision) => (
        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
          {decisionLabels[decision.decision] || decision.decision}
        </span>
      ),
    },
    {
      key: "isAdventist",
      header: "SDA Status",
      render: (decision) => (
        <span className="text-sm text-stone-500 dark:text-stone-400">
          {decision.isAdventist === "baptized"
            ? "Member"
            : decision.isAdventist === "not-member"
            ? "Non-member"
            : decision.isAdventist === "former"
            ? "Former"
            : "-"}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Date",
      sortable: true,
      render: (decision) => (
        <span className="text-sm text-stone-500 dark:text-stone-400">
          {format(new Date(decision.createdAt), "MMM d, yyyy")}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "w-32",
      render: (decision) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => setSelectedDecision(decision)}
            className="p-2 hover:bg-stone-100 dark:hover:bg-stone-700 rounded-lg transition-colors"
          >
            <Eye className="w-4 h-4 text-stone-500" />
          </button>
          <button
            onClick={() => setDeleteId(decision.id)}
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
          Decisions
        </h1>
        <p className="text-stone-600 dark:text-stone-400 mt-1">
          Manage church decision card submissions
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
          data={decisions || []}
          columns={columns}
          keyExtractor={(d) => d.id}
          emptyMessage="No decisions submitted yet."
        />
      )}

      <Modal
        isOpen={!!selectedDecision}
        onClose={() => setSelectedDecision(null)}
        title="Decision Details"
        size="lg"
      >
        {selectedDecision && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-stone-500 dark:text-stone-400">Name</p>
                <p className="text-stone-900 dark:text-stone-100">{selectedDecision.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-stone-500 dark:text-stone-400">Decision</p>
                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
                  {decisionLabels[selectedDecision.decision] || selectedDecision.decision}
                </span>
              </div>
            </div>

            {selectedDecision.email && (
              <div>
                <p className="text-sm font-medium text-stone-500 dark:text-stone-400">Email</p>
                <a
                  href={`mailto:${selectedDecision.email}`}
                  className="text-amber-600 hover:text-amber-700 flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  {selectedDecision.email}
                </a>
              </div>
            )}

            {selectedDecision.phone && (
              <div>
                <p className="text-sm font-medium text-stone-500 dark:text-stone-400">Phone</p>
                <a
                  href={`tel:${selectedDecision.phone}`}
                  className="text-amber-600 hover:text-amber-700 flex items-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  {selectedDecision.phone}
                </a>
              </div>
            )}

            <div>
              <p className="text-sm font-medium text-stone-500 dark:text-stone-400">SDA Status</p>
              <p className="text-stone-900 dark:text-stone-100">
                {selectedDecision.isAdventist === "baptized"
                  ? "Baptized member"
                  : selectedDecision.isAdventist === "not-member"
                  ? "Not a member"
                  : selectedDecision.isAdventist === "former"
                  ? "Former member"
                  : "-"}
              </p>
            </div>

            {(selectedDecision.address || selectedDecision.parish || selectedDecision.country) && (
              <div>
                <p className="text-sm font-medium text-stone-500 dark:text-stone-400">Location</p>
                <p className="text-stone-900 dark:text-stone-100">
                  {[selectedDecision.address, selectedDecision.parish, selectedDecision.country]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>
            )}

            {selectedDecision.prayerRequest && (
              <div className="pt-4 border-t border-stone-200 dark:border-stone-700">
                <p className="text-sm font-medium text-stone-500 dark:text-stone-400 mb-2">
                  Prayer Request
                </p>
                <p className="text-stone-900 dark:text-stone-100 whitespace-pre-wrap">
                  {selectedDecision.prayerRequest}
                </p>
              </div>
            )}

            {selectedDecision.comments && (
              <div>
                <p className="text-sm font-medium text-stone-500 dark:text-stone-400 mb-2">
                  Comments
                </p>
                <p className="text-stone-900 dark:text-stone-100 whitespace-pre-wrap">
                  {selectedDecision.comments}
                </p>
              </div>
            )}

            {selectedDecision.source && (
              <div>
                <p className="text-sm font-medium text-stone-500 dark:text-stone-400">How did they find us?</p>
                <p className="text-stone-900 dark:text-stone-100">{selectedDecision.source}</p>
              </div>
            )}

            <div className="flex items-center gap-3 pt-4 border-t border-stone-200 dark:border-stone-700">
              {!selectedDecision.isRead && (
                <button
                  onClick={() => {
                    if (selectedDecision) handleMarkAsRead(selectedDecision.id);
                    setSelectedDecision(null);
                  }}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-green-100 text-green-700 hover:bg-green-200"
                >
                  Mark as Read
                </button>
              )}
              <button
                onClick={() => {
                  setDeleteId(selectedDecision.id);
                  setSelectedDecision(null);
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
        title="Delete Decision"
        message="Are you sure you want to delete this decision? This action cannot be undone."
        confirmText="Delete"
        isLoading={isDeleting}
      />
    </div>
  );
}