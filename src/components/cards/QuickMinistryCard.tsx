"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface QuickMinistryCardProps {
  name: string;
  icon?: never;
  iconColor?: never;
  href: string;
  className?: string;
  description?: string;
  imageUrl: string;
  bgColor?: string;
}

export function QuickMinistryCard({
  name,
  href,
  className,
  imageUrl,
  bgColor = "bg-amber-100",
}: QuickMinistryCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative rounded-2xl overflow-hidden",
        "border border-transparent",
        "hover:border-amber-400/50 dark:hover:border-amber-500/50",
        "hover:shadow-xl hover:shadow-amber-500/20",
        "transition-all duration-300 ease-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2",
        "aspect-[4/5] sm:aspect-[3/4]",
        className
      )}
      aria-label={`${name}`}
    >
      <div className="absolute inset-0">
        <div className={cn("absolute inset-0", bgColor)} />
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-orange-500/0 group-hover:from-amber-500/20 group-hover:to-orange-500/10 transition-all duration-500" />
      </div>
      
      <div className="absolute inset-0 flex flex-col justify-end p-5">
        <h3 className="font-bold text-white text-lg sm:text-xl font-[family-name:var(--font-playfair)] drop-shadow-lg">
          {name}
        </h3>
        
        <div className="flex items-center gap-1.5 text-amber-300 mt-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <span className="text-sm font-semibold">Explore</span>
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
        </div>
      </div>
    </Link>
  );
}
