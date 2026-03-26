"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { format } from "date-fns";
import { Eye, EyeOff, Mail, MessageSquare } from "lucide-react";
import { AdminTable, PageHeader, Column, Modal } from "@/components/admin";
import { useToast } from "@/components/ui/Toast";
import type { Id } from "@/convex/_generated/dataModel";
import type { AdminPrayerRequest } from "@/types/admin";

export default function PrayersAdminPage() {
  const { success, error: showError } = useToast();
  const prayers = useQuery(api.prayerRequests.queries.listPublic);
  const togglePublic = useMutation(api.prayerRequests.mutations.togglePublic);
  const markAnswered = useMutation(api.prayerRequests.mutations.markAnswered);

  const [selectedPrayer, setSelectedPrayer] = useState<AdminPrayerRequest | null>(null);
  const [searchValue, setSearchValue] = useState("");

  const handleTogglePublic = async (id: Id<"prayerRequests">, isPublic: boolean) => {
    try {
      await togglePublic({ id, isPublic: !isPublic });
      success("Visibility updated successfully");
    } catch (err) {
      showError("Failed to update visibility");
      console.error("Failed to toggle:", err);
    }
  };

  const handleMarkAnswered = async (id: Id<"prayerRequests">) => {
    try {
      await markAnswered({ id });
      success("Prayer request marked as answered");
    } catch (err) {
      showError("Failed to mark as answered");
      console.error("Failed to mark answered:", err);
    }
  };

  const columns: Column<AdminPrayerRequest>[] = [
    {
      key: "request",
      header: "Prayer Request",
      sortable: true,
      searchable: true,
      render: (prayer) => (
        <div className="flex items-start gap-3">
          <div
            className={`mt-1 p-2 rounded-lg ${
              prayer.isAnswered
                ? "bg-green-100 dark:bg-green-900/30"
                : "bg-amber-100 dark:bg-amber-900/30"
            }`}
          >
            <MessageSquare
              className={`w-4 h-4 ${
                prayer.isAnswered ? "text-green-600" : "text-amber-600"
              }`}
            />
          </div>
          <div className="min-w-0">
            <p className="font-medium text-stone-900 dark:text-stone-100">
              {prayer.name}
            </p>
            <p className="text-sm text-stone-500 line-clamp-2 mt-1">
              {prayer.request}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "isPublic",
      header: "Visibility",
      render: (prayer) => (
        <button
          onClick={() => handleTogglePublic(prayer._id, !!prayer.isPublic)}
          className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            prayer.isPublic
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              : "bg-stone-100 text-stone-500 dark:bg-stone-700 dark:text-stone-400"
          }`}
        >
          {prayer.isPublic ? (
            <>
              <Eye className="w-3 h-3" />
              Public
            </>
          ) : (
            <>
              <EyeOff className="w-3 h-3" />
              Private
            </>
          )}
        </button>
      ),
    },
    {
      key: "isAnswered",
      header: "Status",
      render: (prayer) => (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            prayer.isAnswered
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
          }`}
        >
          {prayer.isAnswered ? "Answered" : "Pending"}
        </span>
      ),
    },
    {
      key: "date",
      header: "Date",
      sortable: true,
      render: (prayer) => (
        <span className="text-sm text-stone-500 dark:text-stone-400">
          {format(new Date(prayer.date), "MMM d, yyyy")}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Prayer Requests"
        description="Manage church prayer requests"
        count={prayers?.length}
      />

      <AdminTable
        data={prayers}
        columns={columns}
        keyExtractor={(p) => p._id}
        onRowClick={setSelectedPrayer}
        emptyMessage="No prayer requests yet."
        emptyIcon="inbox"
        selectable
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Search prayers..."
      />

      <Modal
        isOpen={!!selectedPrayer}
        onClose={() => setSelectedPrayer(null)}
        title="Prayer Request Details"
        size="md"
      >
        {selectedPrayer && (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-stone-500 dark:text-stone-400">Name</p>
              <p className="text-stone-900 dark:text-stone-100">{selectedPrayer.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-stone-500 dark:text-stone-400">Email</p>
              <a
                href={`mailto:${selectedPrayer.email}`}
                className="text-amber-600 hover:text-amber-700 flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                {selectedPrayer.email}
              </a>
            </div>
            <div>
              <p className="text-sm font-medium text-stone-500 dark:text-stone-400">Request</p>
              <p className="text-stone-900 dark:text-stone-100 whitespace-pre-wrap">
                {selectedPrayer.request}
              </p>
            </div>
            <div className="flex items-center gap-4 pt-4 border-t border-stone-200 dark:border-stone-700">
              <button
                onClick={() => {
                  if (selectedPrayer) handleTogglePublic(selectedPrayer._id, !!selectedPrayer.isPublic);
                  setSelectedPrayer(null);
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  selectedPrayer.isPublic
                    ? "bg-stone-100 text-stone-700 hover:bg-stone-200"
                    : "bg-green-100 text-green-700 hover:bg-green-200"
                }`}
              >
                {selectedPrayer.isPublic ? "Make Private" : "Make Public"}
              </button>
              {!selectedPrayer.isAnswered && (
                <button
                  onClick={() => {
                    if (selectedPrayer) handleMarkAnswered(selectedPrayer._id);
                    setSelectedPrayer(null);
                  }}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-green-100 text-green-700 hover:bg-green-200"
                >
                  Mark as Answered
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
