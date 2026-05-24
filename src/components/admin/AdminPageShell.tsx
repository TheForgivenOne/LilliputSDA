"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import Button from "@/components/ui/Button";
import { AdminLoadingSkeleton } from "./AdminLoadingSkeleton";

interface AdminPageShellProps {
  title: string;
  description: string;
  addButtonLabel?: string;
  addButtonHref?: string;
  isLoading: boolean;
  children: ReactNode;
}

export function AdminPageShell({
  title,
  description,
  addButtonLabel,
  addButtonHref,
  isLoading,
  children,
}: AdminPageShellProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="border-l-4 border-[var(--primary)] pl-4">
          <h1 className="text-2xl font-bold font-serif text-stone-900 dark:text-stone-100 leading-tight">
            {title}
          </h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-0.5">{description}</p>
        </div>
        {addButtonLabel && addButtonHref && (
          <Link href={addButtonHref} className="flex-shrink-0">
            <Button leftIcon={<Plus className="w-4 h-4" />}>{addButtonLabel}</Button>
          </Link>
        )}
      </div>

      <hr className="border-stone-200 dark:border-stone-700/60" />

      {isLoading ? <AdminLoadingSkeleton /> : children}
    </div>
  );
}
