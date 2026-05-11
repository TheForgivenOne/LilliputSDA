"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Eye, EyeOff, Check, Mail, MessageSquare } from "lucide-react";
import { AdminPageShell, AdminTable, Modal, Column } from "@/components/admin";
import { useFetch, updateItem } from "@/hooks/useData";

type PrayerRequest = {
  id: string;
  name: string;
  email?: string;
  request: string;
  isPublic: boolean;
  isAnswered: boolean;
  date: string;
};

export default function PrayersAdminPage() {
  const { data: prayers, isLoading, refetch } = useFetch<PrayerRequest[]>("/api/prayers");
  const [selectedPrayer, setSelectedPrayer] = useState<PrayerRequest | null>(null);

  const handleTogglePublic = async (id: string, isPublic: boolean) => {
    try {
      await updateItem(`/api/prayers/${id}`, { isPublic: !isPublic });
      refetch();
    } catch {}
  };

  const handleMarkAnswered = async (id: string) => {
    try {
      await updateItem(`/api/prayers/${id}`, { isAnswered: true });
      refetch();
    } catch {}
  };

  const columns: Column<PrayerRequest>[] = [
    {
      key: "request",
      header: "Prayer Request",
      sortable: true,
      render: (prayer) => (
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg ${prayer.isAnswered ? "bg-emerald-100 dark:bg-emerald-900/30" : "bg-amber-100 dark:bg-amber-900/30"}`}>
            <MessageSquare className={`w-4 h-4 ${prayer.isAnswered ? "text-emerald-600" : "text-amber-600"}`} />
          </div>
          <div className="min-w-0">
            <p className="font-medium text-stone-900 dark:text-stone-100">{prayer.name}</p>
            <p className="text-sm text-stone-500 line-clamp-2 mt-1">{prayer.request}</p>
          </div>
        </div>
      ),
    },
    {
      key: "isPublic",
      header: "Visibility",
      render: (prayer) => (
        <button onClick={() => handleTogglePublic(prayer.id, !!prayer.isPublic)}
          className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            prayer.isPublic ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-stone-100 text-stone-500 dark:bg-stone-700 dark:text-stone-400"
          }`}
        >
          {prayer.isPublic ? <><Eye className="w-3 h-3" /> Public</> : <><EyeOff className="w-3 h-3" /> Private</>}
        </button>
      ),
    },
    {
      key: "isAnswered",
      header: "Status",
      render: (prayer) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${prayer.isAnswered ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"}`}>
          {prayer.isAnswered ? "Answered" : "Pending"}
        </span>
      ),
    },
    {
      key: "date",
      header: "Date",
      sortable: true,
      render: (prayer) => (
        <span className="text-sm text-stone-500 dark:text-stone-400">{format(new Date(prayer.date), "MMM d, yyyy")}</span>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "w-32",
      render: (prayer) => (
        <div className="flex items-center justify-end gap-2">
          <button onClick={() => setSelectedPrayer(prayer)} className="p-2 hover:bg-stone-100 dark:hover:bg-stone-700 rounded-lg transition-colors">
            <Eye className="w-4 h-4 text-stone-500" />
          </button>
          {!prayer.isAnswered && (
            <button onClick={() => handleMarkAnswered(prayer.id)} className="p-2 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 rounded-lg transition-colors" title="Mark as answered">
              <Check className="w-4 h-4 text-emerald-600" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <AdminPageShell title="Prayer Requests" description="Manage church prayer requests" isLoading={isLoading}>
      <AdminTable data={prayers || []} columns={columns} keyExtractor={(p) => p.id} emptyMessage="No prayer requests yet." />

      <Modal isOpen={!!selectedPrayer} onClose={() => setSelectedPrayer(null)} title="Prayer Request Details" size="md">
        {selectedPrayer && (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-stone-500 dark:text-stone-400">Name</p>
              <p className="text-stone-900 dark:text-stone-100">{selectedPrayer.name}</p>
            </div>
            {selectedPrayer.email && (
              <div>
                <p className="text-sm font-medium text-stone-500 dark:text-stone-400">Email</p>
                <a href={`mailto:${selectedPrayer.email}`} className="text-amber-600 hover:text-amber-700 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {selectedPrayer.email}
                </a>
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-stone-500 dark:text-stone-400">Request</p>
              <p className="text-stone-900 dark:text-stone-100 whitespace-pre-wrap">{selectedPrayer.request}</p>
            </div>
            <div className="flex items-center gap-4 pt-4 border-t border-[var(--border-subtle)] dark:border-stone-700">
              <button onClick={() => { handleTogglePublic(selectedPrayer.id, !!selectedPrayer.isPublic); setSelectedPrayer(null); }}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${selectedPrayer.isPublic ? "bg-stone-100 text-stone-700 hover:bg-stone-200" : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"}`}
              >
                {selectedPrayer.isPublic ? "Make Private" : "Make Public"}
              </button>
              {!selectedPrayer.isAnswered && (
                <button onClick={() => { handleMarkAnswered(selectedPrayer.id); setSelectedPrayer(null); }} className="px-4 py-2 rounded-lg text-sm font-medium bg-emerald-100 text-emerald-700 hover:bg-emerald-200">
                  Mark as Answered
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </AdminPageShell>
  );
}
