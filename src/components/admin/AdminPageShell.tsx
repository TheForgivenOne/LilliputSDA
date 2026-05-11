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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">{title}</h1>
          <p className="text-stone-600 dark:text-stone-400 mt-1">{description}</p>
        </div>
        {addButtonLabel && addButtonHref && (
          <Link href={addButtonHref}>
            <Button leftIcon={<Plus className="w-4 h-4" />}>{addButtonLabel}</Button>
          </Link>
        )}
      </div>

      {isLoading ? <AdminLoadingSkeleton /> : children}
    </div>
  );
}
