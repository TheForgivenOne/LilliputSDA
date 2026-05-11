"use client";

import { AlertTriangle, RefreshCw, Wifi } from "lucide-react";
import Button from "./Button";

interface DataLoadErrorProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showRetry?: boolean;
  variant?: "card" | "inline" | "full";
}

export function DataLoadError({
  title = "Couldn't load content",
  message = "Something went wrong while loading this content. Check your connection and try again.",
  onRetry,
  showRetry = true,
  variant = "card",
}: DataLoadErrorProps) {
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  if (variant === "full") {
    return (
      <div className="min-h-[400px] flex items-center justify-center p-8">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <Wifi className="w-8 h-8 text-amber-600 dark:text-amber-400" />
          </div>
          <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 mb-2">
            {title}
          </h2>
          <p className="text-stone-600 dark:text-stone-400 mb-6">{message}</p>
          {showRetry && (
            <Button
              variant="outline"
              onClick={handleRetry}
              leftIcon={<RefreshCw className="w-4 h-4" />}
            >
              Try Again
            </Button>
          )}
        </div>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
        <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="font-medium text-amber-800 dark:text-amber-200">{title}</p>
          <p className="text-sm text-amber-700 dark:text-amber-300 truncate">{message}</p>
        </div>
        {showRetry && (
          <Button variant="ghost" size="sm" onClick={handleRetry}>
            Retry
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-stone-800 rounded-xl p-6 shadow-sm border border-stone-200 dark:border-stone-700">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center flex-shrink-0">
          <Wifi className="w-5 h-5 text-amber-600 dark:text-amber-400" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-stone-900 dark:text-stone-100 mb-1">
            {title}
          </h3>
          <p className="text-sm text-stone-600 dark:text-stone-400 mb-4">{message}</p>
          {showRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRetry}
              leftIcon={<RefreshCw className="w-4 h-4" />}
            >
              Try Again
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export function DataLoadErrorSkeleton({
  count = 2,
  variant = "card",
}: {
  count?: number;
  variant?: "card" | "grid";
}) {
  if (variant === "grid") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-stone-800 rounded-xl p-6 shadow-sm border border-stone-200 dark:border-stone-700 animate-pulse"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-stone-200 dark:bg-stone-700 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded w-3/4" />
                <div className="h-3 bg-stone-200 dark:bg-stone-700 rounded w-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-stone-800 rounded-xl p-6 shadow-sm animate-pulse"
        >
          <div className="flex gap-4">
            <div className="w-16 h-16 bg-stone-200 dark:bg-stone-700 rounded-lg" />
            <div className="flex-1 space-y-3">
              <div className="h-5 bg-stone-200 dark:bg-stone-700 rounded w-2/3" />
              <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded w-full" />
              <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded w-4/5" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
