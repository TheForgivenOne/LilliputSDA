"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface FormPageLayoutProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  onCancel?: () => void;
  isSaving?: boolean;
  saveLabel?: string;
  cancelLabel?: string;
  children: ReactNode;
  className?: string;
  footerActions?: ReactNode;
}

export function FormPageLayout({
  title,
  description,
  breadcrumbs,
  onCancel,
  isSaving = false,
  saveLabel = "Save",
  cancelLabel = "Cancel",
  children,
  className,
  footerActions,
}: FormPageLayoutProps) {
  const router = useRouter();
  const handleCancel = onCancel || (() => router.back());

  return (
    <div className={cn("max-w-3xl", className)}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-2 text-sm text-stone-500 dark:text-stone-400 mb-4" aria-label="Breadcrumb">
          <Link
            href="/dashboard"
            className="flex items-center gap-1 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Dashboard
          </Link>
          {breadcrumbs.map((crumb, index) => (
            <span key={index} className="flex items-center gap-2">
              <ChevronLeft className="w-4 h-4 rotate-180" />
              {crumb.href ? (
                <Link
                  href={crumb.href}
                  className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-stone-700 dark:text-stone-300 font-medium">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}

      <div className="bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 overflow-hidden">
        <div className="px-6 py-6 border-b border-stone-200 dark:border-stone-700">
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={handleCancel}
              className="flex-shrink-0 p-2 -ml-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors"
              aria-label="Go back"
            >
              <ChevronLeft className="w-5 h-5 text-stone-500" />
            </button>
            <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">{title}</h1>
          </div>
          {description && (
            <p className="text-stone-600 dark:text-stone-400 ml-11">{description}</p>
          )}
        </div>

        <div className="p-6">{children}</div>

        <div className="px-6 py-4 border-t border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900/50">
          <div className="flex items-center justify-between gap-4">
            <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
              {cancelLabel}
            </Button>
            {footerActions || (
              <Button isLoading={isSaving} leftIcon={!isSaving ? <Save className="w-4 h-4" /> : undefined}>
                {isSaving ? "Saving..." : saveLabel}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface FormSectionProps {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function FormSection({ title, description, children, className }: FormSectionProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {(title || description) && (
        <div className="border-b border-stone-100 dark:border-stone-700 pb-3">
          {title && (
            <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100">{title}</h3>
          )}
          {description && (
            <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">{description}</p>
          )}
        </div>
      )}
      <div className="space-y-4">{children}</div>
    </div>
  );
}

interface FormActionsProps {
  children: ReactNode;
  className?: string;
}

export function FormActions({ children, className }: FormActionsProps) {
  return (
    <div className={cn("flex items-center gap-3 pt-4", className)}>
      {children}
    </div>
  );
}
