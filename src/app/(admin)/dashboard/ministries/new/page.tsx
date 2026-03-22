import { MinistryForm } from "@/components/admin/ministries/MinistryForm";

export default function NewMinistryPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100 mb-2">
        Create Ministry
      </h1>
      <p className="text-stone-600 dark:text-stone-400 mb-8">
        Add a new ministry or program
      </p>
      <div className="bg-white dark:bg-stone-800 rounded-xl p-6 border border-stone-200 dark:border-stone-700">
        <MinistryForm />
      </div>
    </div>
  );
}
