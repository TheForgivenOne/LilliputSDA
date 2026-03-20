"use client";

export function VideoCardSkeleton() {
  return (
    <div className="bg-white dark:bg-stone-800 rounded-xl overflow-hidden shadow-md">
      <div className="aspect-video bg-stone-200 dark:bg-stone-700 animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-stone-200 dark:bg-stone-700 rounded w-3/4 animate-pulse" />
        <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded w-1/2 animate-pulse" />
      </div>
    </div>
  );
}

export function FeaturedVideoSkeleton() {
  return (
    <div className="bg-white dark:bg-stone-800 rounded-2xl overflow-hidden shadow-lg">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="aspect-video lg:aspect-auto bg-stone-200 dark:bg-stone-700 animate-pulse" />
        <div className="p-8 lg:p-12 space-y-4">
          <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded w-24 animate-pulse" />
          <div className="h-8 bg-stone-200 dark:bg-stone-700 rounded w-3/4 animate-pulse" />
          <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded w-full animate-pulse" />
          <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded w-2/3 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

interface VideoGridSkeletonProps {
  count?: number;
}

export function VideoGridSkeleton({ count = 6 }: VideoGridSkeletonProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <VideoCardSkeleton key={i} />
      ))}
    </div>
  );
}
