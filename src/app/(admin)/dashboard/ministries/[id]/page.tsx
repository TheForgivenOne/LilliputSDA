"use client";

import { useParams } from "next/navigation";
import { useFetch } from "@/hooks/useData";
import { MinistryForm } from "@/components/admin/ministries/MinistryForm";
import type { AdminMinistry } from "@/types/admin";

export default function EditMinistryPage() {
  const params = useParams();
  const ministryId = params.id as string;
  const { data: ministries, isLoading } = useFetch<AdminMinistry[]>("/api/ministries");

  const ministry = ministries?.find((m) => m.id === ministryId);

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100 mb-2">
        Edit Ministry
      </h1>
      <p className="text-stone-600 dark:text-stone-400 mb-8">
        Update ministry details
      </p>
      <div className="bg-white dark:bg-stone-800 rounded-xl p-6 border border-stone-200 dark:border-stone-700">
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-stone-200 dark:bg-stone-700 rounded w-3/4" />
            <div className="h-24 bg-stone-200 dark:bg-stone-700 rounded" />
            <div className="h-10 bg-stone-200 dark:bg-stone-700 rounded w-1/2" />
          </div>
        ) : ministry ? (
          <MinistryForm ministry={ministry} />
        ) : (
          <div className="text-center py-12 text-stone-500">
            Ministry not found
          </div>
        )}
      </div>
    </div>
  );
}
