"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface CTASectionProps {
  title: string;
  description: string;
  primaryAction?: {
    label: string;
    href: string;
    variant?: "primary" | "secondary" | "outline";
  };
  secondaryAction?: {
    label: string;
    href: string;
    variant?: "primary" | "secondary" | "outline";
  };
  backgroundColor?: "amber" | "stone" | "slate" | "terracotta";
  className?: string;
}

export function CTASection({
  title,
  description,
  primaryAction,
  secondaryAction,
  backgroundColor = "amber",
  className,
}: CTASectionProps) {
  const bgStyles = {
    amber: "bg-gradient-to-br from-amber-600 via-amber-700 to-orange-700",
    terracotta: "bg-gradient-to-br from-orange-600 via-orange-700 to-red-700",
    stone: "bg-gradient-to-br from-stone-700 via-stone-800 to-stone-900",
    slate: "bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900",
  };

  return (
    <section
      className={cn(
        "py-20 lg:py-28 relative overflow-hidden",
        bgStyles[backgroundColor],
        className
      )}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
      </div>
      
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-8 leading-[1.1] font-[family-name:var(--font-playfair)] tracking-tight">
          {title}
        </h2>
        <p className="text-xl text-white/85 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
          {description}
        </p>
        <div className="flex flex-col sm:flex-row gap-5 justify-center">
          {primaryAction && (
            <Link href={primaryAction.href}>
              <Button
                size="lg"
                variant={primaryAction.variant || "primary"}
                className={
                  (backgroundColor === "amber" || backgroundColor === "terracotta")
                    ? "!bg-white !text-amber-700 hover:!bg-stone-100 shadow-xl shadow-black/10"
                    : ""
                }
              >
                {primaryAction.label}
              </Button>
            </Link>
          )}
          {secondaryAction && (
            <Link href={secondaryAction.href}>
              <Button
                size="lg"
                variant={secondaryAction.variant || "outline"}
                className={
                  (backgroundColor === "amber" || backgroundColor === "terracotta")
                    ? "!border-white/40 !text-white hover:!bg-white/10 hover:!border-white/60"
                    : ""
                }
              >
                {secondaryAction.label}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
