"use client";

import { useParams, useRouter } from "next/navigation";
import { MinistryForm } from "@/components/admin/ministries/MinistryForm";

export default function EditMinistryPage() {
  const params = useParams();
  const router = useRouter();
  const ministryId = params.id as string;
  const ministries = useQuery(api.ministries.queries.listAll);

  const ministry = ministries?.find((m) => m._id === ministryId);

  if (!ministry && ministries !== undefined) {
    router.push("/dashboard/ministries");
    return null;
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100 mb-2">
        Edit Ministry
      </h1>
      <p className="text-stone-600 dark:text-stone-400 mb-8">
        Update ministry details
      </p>
      <div className="bg-white dark:bg-stone-800 rounded-xl p-6 border border-stone-200 dark:border-stone-700">
        {ministry ? (
          <MinistryForm ministry={ministry} />
        ) : (
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-stone-200 dark:bg-stone-700 rounded w-3/4" />
            <div className="h-24 bg-stone-200 dark:bg-stone-700 rounded" />
            <div className="h-10 bg-stone-200 dark:bg-stone-700 rounded w-1/2" />
          </div>
        )}
      </div>
    </div>
  );
}
