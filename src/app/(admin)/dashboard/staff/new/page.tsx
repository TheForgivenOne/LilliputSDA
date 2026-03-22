import { StaffForm } from "@/components/admin/staff/StaffForm";

export default function NewStaffPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100 mb-2">
        Add Staff Member
      </h1>
      <p className="text-stone-600 dark:text-stone-400 mb-8">
        Add a new staff member or church leader
      </p>
      <div className="bg-white dark:bg-stone-800 rounded-xl p-6 border border-stone-200 dark:border-stone-700">
        <StaffForm />
      </div>
    </div>
  );
}
