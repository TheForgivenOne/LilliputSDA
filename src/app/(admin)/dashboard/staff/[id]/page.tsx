"use client";

import { useParams } from "next/navigation";
import { useFetch } from "@/hooks/useData";
import { StaffForm } from "@/components/admin/staff/StaffForm";
import type { AdminStaff } from "@/types/admin";

export default function EditStaffPage() {
  const params = useParams();
  const staffId = params.id as string;
  const { data: staff, isLoading } = useFetch<AdminStaff[]>("/api/staff");

  const person = staff?.find((s) => s._id === staffId);

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100 mb-2">
        Edit Staff Member
      </h1>
      <p className="text-stone-600 dark:text-stone-400 mb-8">
        Update staff member details
      </p>
      <div className="bg-white dark:bg-stone-800 rounded-xl p-6 border border-stone-200 dark:border-stone-700">
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-stone-200 dark:bg-stone-700 rounded w-3/4" />
            <div className="h-24 bg-stone-200 dark:bg-stone-700 rounded" />
            <div className="h-10 bg-stone-200 dark:bg-stone-700 rounded w-1/2" />
          </div>
        ) : person ? (
          <StaffForm staff={person} />
        ) : (
          <div className="text-center py-12 text-stone-500">
            Staff member not found
          </div>
        )}
      </div>
    </div>
  );
}
