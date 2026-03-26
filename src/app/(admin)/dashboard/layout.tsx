"use client";

import { ReactNode } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { ToastProvider } from "@/components/ui/Toast";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-amber-600 focus:text-white focus:rounded-lg focus:font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
        >
          Skip to main content
        </a>
        <AdminSidebar />
        <main id="main-content" className="lg:pl-64">
          <div className="lg:hidden h-16" />
          <div className="p-4 lg:p-8 pt-20 lg:pt-8">{children}</div>
        </main>
      </div>
    </ToastProvider>
  );
}
