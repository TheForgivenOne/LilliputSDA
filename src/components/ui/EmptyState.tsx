"use client";

import { cn } from "@/lib/utils";
import { AlertCircle, Search, Inbox, RefreshCw } from "lucide-react";
import Button from "@/components/ui/Button";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: "search" | "inbox" | "alert";
  customIcon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  retry?: () => void;
  className?: string;
}

const icons = {
  search: Search,
  inbox: Inbox,
  alert: AlertCircle,
};

export function EmptyState({
  title,
  description,
  icon = "inbox",
  customIcon,
  action,
  retry,
  className,
}: EmptyStateProps) {
  const IconComponent = !customIcon ? icons[icon] : undefined;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-12 px-6",
        "empty-state-flex empty-state-min-h",
        className
      )}
      role="status"
      aria-live="polite"
    >
      {customIcon ? (
        <div className="mb-4 text-stone-400 dark:text-stone-500">{customIcon}</div>
      ) : IconComponent ? (
        <div className="w-16 h-16 bg-stone-100 dark:bg-stone-800 rounded-full flex items-center justify-center mb-4">
          <IconComponent className="w-8 h-8 text-stone-400 dark:text-stone-500" />
        </div>
      ) : null}
      <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-stone-500 dark:text-stone-400 max-w-sm mb-6">
          {description}
        </p>
      )}
      <div className="flex flex-col sm:flex-row gap-3">
        {action && (
          <Button onClick={action.onClick} variant="primary">
            {action.label}
          </Button>
        )}
        {retry && (
          <Button onClick={retry} variant="outline" leftIcon={<RefreshCw className="w-4 h-4" />}>
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
}

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({ message = "Loading...", className }: LoadingStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 px-6",
        "empty-state-flex empty-state-min-h",
        className
      )}
      role="status"
      aria-live="polite"
    >
      <div className="w-12 h-12 border-4 border-stone-200 dark:border-stone-700 border-t-amber-600 rounded-full animate-spin mb-4" />
      <p className="text-stone-500 dark:text-stone-400">{message}</p>
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  message?: string;
  retry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again.",
  retry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-12 px-6",
        "empty-state-flex empty-state-min-h",
        className
      )}
      role="alert"
    >
      <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
      </div>
      <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-2">
        {title}
      </h3>
      <p className="text-stone-500 dark:text-stone-400 max-w-sm mb-6">{message}</p>
      {retry && (
        <Button onClick={retry} variant="outline" leftIcon={<RefreshCw className="w-4 h-4" />}>
          Try Again
        </Button>
      )}
    </div>
  );
}
