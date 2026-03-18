"use client";

import { ReactNode, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";

interface HeroSectionProps {
  title: string;
  subtitle: string;
  description: string;
  badge?: string;
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
  backgroundImage = "",
  primaryAction,
  secondaryAction,
  quickInfo,
  className,
}: HeroSectionProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <section
      className={cn("relative bg-stone-900 text-white overflow-hidden", className)}
    >
      <div className="absolute inset-0">
        {!imageError && backgroundImage ? (
          <Image
            src={backgroundImage}
            alt=""
            fill
            className="object-cover"
            priority
            sizes="100vw"
            onError={() => setImageError(true)}
            aria-hidden="true"
          />
        ) : (
          <div className="w-full h-full bg-stone-800" aria-hidden="true" />
        )}
        <div className="absolute inset-0 bg-stone-900/70" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="max-w-3xl">
          {badge && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-sm font-medium mb-6">
              {badge}
            </div>
          )}

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
            {title}{" "}
            <span className="text-amber-500">{subtitle}</span>
          </h1>

          <p className="text-lg md:text-xl text-stone-300 mb-8 max-w-xl">
            {description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            {primaryAction && (
              <Link href={primaryAction.href}>
                <Button size="lg">
                  {primaryAction.label}
                </Button>
              </Link>
            )}
            {secondaryAction && (
              <Link href={secondaryAction.href}>
                <Button variant="outline" size="lg" className="border-stone-400 text-white hover:bg-white/10 hover:border-white">
                  {secondaryAction.label}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {quickInfo && (
        <div className="relative border-t border-white/10 bg-stone-900/80 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {quickInfo}
          </div>
        </div>
      )}
    </section>
  );
}
