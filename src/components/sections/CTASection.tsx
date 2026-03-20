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
  const bgColors = {
    amber: "bg-gradient-to-br from-amber-700 to-amber-800",
    terracotta: "bg-gradient-to-br from-orange-600 to-coral-600",
    stone: "bg-gradient-to-br from-stone-700 to-stone-800",
    slate: "bg-gradient-to-br from-slate-700 to-slate-800",
  };

  return (
    <section
      className={cn(
        "py-20 lg:py-28 relative overflow-hidden",
        bgColors[backgroundColor],
        className
      )}
    >
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />
      
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight font-[family-name:var(--font-playfair)]">
          {title}
        </h2>
        <p className="text-white/80 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed font-light">
          {description}
        </p>
        <div className="flex flex-col sm:flex-row gap-5 justify-center">
          {primaryAction && (
            <Link href={primaryAction.href}>
              <Button
                size="lg"
                variant={primaryAction.variant || "primary"}
                className={
                  backgroundColor === "amber" || backgroundColor === "terracotta"
                    ? "bg-white text-stone-900 hover:bg-stone-100 shadow-xl"
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
                  backgroundColor === "amber" || backgroundColor === "terracotta"
                    ? "border-white text-white hover:bg-white/10"
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
