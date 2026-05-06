"use client";

import Image from "next/image";
import type { StaticImport } from "next/dist/shared/lib/get-img-props";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  title: string;
  description: string;
  badge?: React.ReactNode;
  backgroundImage?: StaticImport | string;
  theme?: "stone" | "amber" | "gradient";
  children?: React.ReactNode;
}

export function PageHero({
  title,
  description,
  badge,
  backgroundImage,
  theme = "stone",
  children,
}: PageHeroProps) {
  const themeStyles = {
    stone: "bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900",
    amber: "bg-gradient-to-br from-amber-700 via-amber-600 to-orange-700 dark:from-amber-900 dark:via-amber-800 dark:to-orange-900",
    gradient: "bg-gradient-to-br from-amber-600 via-orange-500 to-amber-700 dark:from-amber-900 dark:via-orange-900 dark:to-amber-900",
  };

  return (
    <section className={cn("relative text-white pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden", themeStyles[theme])}>
      {backgroundImage && (
        <div className="absolute inset-0 opacity-20">
          <Image
            src={backgroundImage}
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        </div>
      )}
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
      </div>

      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%220%200%2040%2040%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.02%22%3E%3Cpath%20d%3D%22M0%200h1v1H0zM20%200h1v1h-1zM0%2020h1v1H0zM20%2020h1v1h-1z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl">
          {badge && (
            <div className="mb-6 animate-slide-up-fade">
              {badge}
            </div>
          )}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black mb-8 tracking-tight leading-[1.05] font-[family-name:var(--font-playfair)] animate-slide-up-fade delay-100">
            {title}
          </h1>
          <p className={`text-xl md:text-2xl leading-relaxed max-w-2xl font-light animate-slide-up-fade delay-200 ${
            theme === "amber" || theme === "gradient" ? "text-amber-100" : "text-stone-300"
          }`}>
            {description}
          </p>
          {children}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-stone-50 dark:from-stone-900 to-transparent" />
    </section>
  );
}
