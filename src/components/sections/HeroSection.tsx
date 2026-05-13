"use client";

import { ReactNode, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";
import { VesperLight } from "@/components/motion/VesperLight";

interface HeroSectionProps {
  title: string;
  subtitle: string;
  description: string;
  badge?: string;
  badgeHref?: string;
  backgroundImage?: string;
  primaryAction?: {
    label: string;
    href: string;
  };
  secondaryAction?: {
    label: string;
    href: string;
  };
  quickInfo?: ReactNode;
  className?: string;
}

export function HeroSection({
  title,
  subtitle,
  description,
  badge,
  badgeHref,
  backgroundImage,
  primaryAction,
  secondaryAction,
  quickInfo,
  className,
}: HeroSectionProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <section
      className={cn("relative min-h-[100dvh] flex flex-col justify-center text-white overflow-hidden", className)}
    >
      <div className="absolute inset-0">
        {!imageError && backgroundImage ? (
          <Image
            src={backgroundImage}
            alt=""
            fill
            className="object-cover scale-105"
            priority
            sizes="100vw"
            onError={() => setImageError(true)}
            aria-hidden="true"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-stone-800 to-stone-900" aria-hidden="true" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-stone-900/95 via-stone-900/80 to-stone-900/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/50 via-transparent to-transparent" />
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[var(--primary)]/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[var(--accent-warm)]/12 rounded-full blur-3xl" />
      </div>

      <VesperLight intensity="soft" />

      <div className="relative flex-1 flex flex-col justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="max-w-3xl">
          {badge && (
            badgeHref ? (
              <Link
                href={badgeHref}
                className="group inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/30 rounded-full text-amber-300 text-sm font-semibold mb-8 hover:from-amber-500/30 hover:to-orange-500/30 hover:border-amber-400/50 transition-all duration-300 backdrop-blur-sm"
              >
                <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                {badge}
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ) : (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/30 rounded-full text-amber-300 text-sm font-semibold mb-8 backdrop-blur-sm">
                <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                {badge}
              </div>
            )
          )}

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tight leading-[1.05]">
            <span className="block text-white drop-shadow-lg">{title}</span>
            <span className="block text-[var(--primary)] drop-shadow-lg font-[family-name:var(--font-playfair)]">{subtitle}</span>
          </h1>

          <p className="text-lg md:text-xl lg:text-2xl text-stone-100 mb-10 max-w-2xl leading-relaxed font-light animate-fade-in-up">
            {description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            {primaryAction && (
              <Link href={primaryAction.href}>
                <Button size="lg" className="shadow-amber-500/30 hover:shadow-amber-500/50">
                  {primaryAction.label}
                </Button>
              </Link>
            )}
            {secondaryAction && (
              <Link href={secondaryAction.href}>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="!border-white/30 !text-white hover:!bg-white/10 hover:!border-white/50 !shadow-none"
                >
                  {secondaryAction.label}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {quickInfo && (
        <div className="relative border-t border-white/10 bg-gradient-to-r from-stone-900/90 via-stone-900/95 to-stone-900/90 backdrop-blur-xl shrink-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            {quickInfo}
          </div>
        </div>
      )}
    </section>
  );
}
