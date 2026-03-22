"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { format } from "date-fns";
import { Eye, EyeOff, Check, Mail, MessageSquare } from "lucide-react";
import { AdminTable, Column } from "@/components/admin";
import { Modal } from "@/components/admin";
import type { Id } from "@/convex/_generated/dataModel";
import type { AdminPrayerRequest } from "@/types/admin";

export default function PrayersAdminPage() {
  const prayers = useQuery(api.prayerRequests.queries.listPublic);
  const togglePublic = useMutation(api.prayerRequests.mutations.togglePublic);
  const markAnswered = useMutation(api.prayerRequests.mutations.markAnswered);

  const [selectedPrayer, setSelectedPrayer] = useState<AdminPrayerRequest | null>(null);

  const handleTogglePublic = async (id: Id<"prayerRequests">, isPublic: boolean) => {
    try {
      await togglePublic({ id, isPublic: !isPublic });
    } catch (error) {
      console.error("Failed to toggle:", error);
    }
  };

  const handleMarkAnswered = async (id: Id<"prayerRequests">) => {
    try {
      await markAnswered({ id });
    } catch (error) {
      console.error("Failed to mark answered:", error);
    }
  };

  const columns: Column<AdminPrayerRequest>[] = [
    {
      key: "request",
      header: "Prayer Request",
      sortable: true,
      render: (prayer) => (
        <div className="flex items-start gap-3">
          <div
            className={`p-2 rounded-lg ${
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
    {
      key: "actions",
      header: "",
      className: "w-32",
      render: (prayer) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => setSelectedPrayer(prayer)}
            className="p-2 hover:bg-stone-100 dark:hover:bg-stone-700 rounded-lg transition-colors"
          >
            <Eye className="w-4 h-4 text-stone-500" />
          </button>
          {!prayer.isAnswered && (
            <button
              onClick={() => handleMarkAnswered(prayer._id)}
              className="p-2 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors"
              title="Mark as answered"
            >
              <Check className="w-4 h-4 text-green-600" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">
          Prayer Requests
        </h1>
        <p className="text-stone-600 dark:text-stone-400 mt-1">
          Manage church prayer requests
        </p>
      </div>

      {prayers === undefined ? (
        <div className="bg-white dark:bg-stone-800 rounded-xl p-12 text-center border border-stone-200 dark:border-stone-700">
          <div className="animate-pulse">
            <div className="h-6 bg-stone-200 dark:bg-stone-700 rounded w-1/4 mx-auto mb-4" />
            <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded w-1/2 mx-auto" />
          </div>
        </div>
      ) : (
        <AdminTable
          data={prayers}
          columns={columns}
          keyExtractor={(p) => p._id}
          emptyMessage="No prayer requests yet."
        />
      )}

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
