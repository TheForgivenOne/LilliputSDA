export function AdminLoadingSkeleton() {
  return (
    <div className="bg-[var(--surface)] dark:bg-stone-800 rounded-xl p-12 text-center border border-[var(--border-subtle)] dark:border-stone-700">
      <div className="animate-pulse">
        <div className="h-6 bg-stone-200 dark:bg-stone-700 rounded w-1/4 mx-auto mb-4" />
        <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded w-1/2 mx-auto" />
      </div>
    </div>
  );
}
