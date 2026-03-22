"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { StaffForm } from "@/components/admin/staff/StaffForm";

export default function EditStaffPage() {
  const params = useParams();
  const router = useRouter();
  const staffId = params.id as string;
  const staff = useQuery(api.staff.queries.listAll);

  const person = staff?.find((s) => s._id === staffId);

  if (!person && staff !== undefined) {
    router.push("/dashboard/staff");
    return null;
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100 mb-2">
        Edit Staff Member
      </h1>
      <p className="text-stone-600 dark:text-stone-400 mb-8">
        Update staff member details
      </p>
      <div className="bg-white dark:bg-stone-800 rounded-xl p-6 border border-stone-200 dark:border-stone-700">
        {person ? (
          <StaffForm staff={person} />
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
