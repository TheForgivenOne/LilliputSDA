"use client";

import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface AboutSplitProps {
  label?: string;
  title: string;
  description: string;
  additionalText?: string;
  imageSrc: string;
  imageAlt: string;
  stats?: {
    value: string;
    label: string;
    position: "top-left" | "bottom-left" | "top-right" | "bottom-right";
  };
  action?: {
    label: string;
    href: string;
  };
  className?: string;
}

export function AboutSplit({
  label,
  title,
  description,
  additionalText,
  imageSrc,
  imageAlt,
  stats,
  action,
  className,
}: AboutSplitProps) {
  return (
    <section className={cn("py-20 lg:py-28 bg-white dark:bg-stone-900", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content side */}
          <div className="order-2 lg:order-1">
            {label && (
              <span className="inline-flex items-center gap-2 text-amber-600 dark:text-amber-400 font-semibold text-sm mb-4 tracking-wider uppercase">
                <span className="w-8 h-0.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full" />
                {label}
              </span>
            )}
            <h2 className="text-4xl md:text-5xl font-black text-stone-900 dark:text-stone-100 mb-8 leading-[1.15] font-[family-name:var(--font-playfair)]">
              {title}
            </h2>
            <p className="text-stone-600 dark:text-stone-300 text-lg leading-relaxed mb-6">
              {description}
            </p>
            {additionalText && (
              <p className="text-stone-600 dark:text-stone-300 text-lg leading-relaxed mb-10">
                {additionalText}
              </p>
            )}
            {action && (
              <Link href={action.href}>
                <Button size="lg" className="shadow-amber hover:shadow-xl">
                  {action.label}
                </Button>
              </Link>
            )}
          </div>
          
          {/* Image side with dramatic styling */}
          <div className="order-1 lg:order-2 relative">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl shadow-stone-900/10">
              <Image src={imageSrc} alt={imageAlt} fill className="object-cover" />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/20 to-transparent" />
            </div>
            
            {/* Decorative frame */}
            <div className="absolute -inset-4 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-3xl -z-10 blur-xl" />
            
            {stats && (
              <div
                className={cn(
                  "absolute bg-gradient-to-br from-amber-600 to-amber-700 text-white p-8 rounded-2xl shadow-2xl shadow-amber-900/20",
                  "animate-scale-in",
                  stats.position === "bottom-left" && "-bottom-8 -left-8",
                  stats.position === "top-left" && "-top-8 -left-8",
                  stats.position === "top-right" && "-top-8 -right-8",
                  stats.position === "bottom-right" && "-bottom-8 -right-8"
                )}
              >
                <p className="text-5xl font-black mb-1 font-[family-name:var(--font-playfair)]">{stats.value}</p>
                <p className="text-amber-200 font-medium text-lg">{stats.label}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
