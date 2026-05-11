"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((session) => {
        if (!session?.user) {
          router.push("/sign-in?callbackUrl=/dashboard");
        } else if (session.user.role !== "admin") {
          router.push("/");
        } else {
          setAuthorized(true);
        }
      })
      .catch(() => {
        router.push("/sign-in?callbackUrl=/dashboard");
      });
  }, [router]);

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-stone-950">
        <div className="animate-pulse text-stone-400">Loading...</div>
      </div>
    );
  }

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
