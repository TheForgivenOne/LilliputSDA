"use client";

import { ReactNode } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <AdminSidebar />
      <main className="lg:pl-64">
        {/* Mobile header spacer */}
        <div className="lg:hidden h-16" />
        <div className="p-4 lg:p-8 pt-20 lg:pt-8">{children}</div>
      </main>
    </div>
  );
}
