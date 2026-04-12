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
  imageSrc?: string;
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
    <section className={cn("py-24 lg:py-32 bg-stone-50 dark:bg-stone-900 relative overflow-hidden", className)}>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23d97706%22%20fill-opacity%3D%220.02%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="order-2 lg:order-1">
            {label && (
              <span className="inline-flex items-center gap-3 text-amber-600 dark:text-amber-400 font-bold text-sm mb-6 tracking-widest uppercase">
                <span className="w-10 h-0.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full" />
                {label}
              </span>
            )}
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-stone-900 dark:text-stone-100 mb-8 leading-[1.1] font-[family-name:var(--font-playfair)] tracking-tight">
              {title}
            </h2>
            <p className="text-lg text-stone-600 dark:text-stone-300 leading-relaxed mb-6">
              {description}
            </p>
            {additionalText && (
              <p className="text-lg text-stone-600 dark:text-stone-300 leading-relaxed mb-10">
                {additionalText}
              </p>
            )}
            {action && (
              <Link href={action.href}>
                <Button size="lg">
                  {action.label}
                </Button>
              </Link>
            )}
          </div>
          
          <div className="order-1 lg:order-2 relative">
            {imageSrc ? (
              <>
                <div className="absolute -inset-8 bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-transparent rounded-3xl blur-2xl" />
                
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl shadow-amber-500/10 group">
                  <Image 
                    src={imageSrc} 
                    alt={imageAlt} 
                    fill 
                    sizes="(max-width: 1024px) 100vw, 50vw" 
                    className="object-cover transition-transform duration-700 group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/30 via-transparent to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-orange-500/0 group-hover:from-amber-500/10 group-hover:to-orange-500/5 transition-all duration-500" />
                </div>
              </>
            ) : (
              <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-12 h-12 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <p className="text-stone-500 dark:text-stone-400">Church photo coming soon</p>
                </div>
              </div>
            )}
            
            {stats && (
              <div
                className={cn(
                  "absolute bg-gradient-to-br from-amber-500 to-orange-500 text-white p-8 rounded-2xl shadow-xl shadow-amber-500/30",
                  "backdrop-blur-sm border border-white/10",
                  stats.position === "bottom-left" && "-bottom-6 -left-6",
                  stats.position === "top-left" && "-top-6 -left-6",
                  stats.position === "top-right" && "-top-6 -right-6",
                  stats.position === "bottom-right" && "-bottom-6 -right-6"
                )}
              >
                <p className="text-5xl lg:text-6xl font-black mb-1 font-[family-name:var(--font-playfair)]">{stats.value}</p>
                <p className="text-amber-100 font-semibold text-base">{stats.label}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
