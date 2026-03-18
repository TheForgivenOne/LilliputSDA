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
  description,
  imageUrl,
  bgColor = "bg-amber-100",
}: QuickMinistryCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative bg-white dark:bg-stone-800 rounded-2xl overflow-hidden text-center",
        "border border-stone-200 dark:border-stone-700",
        "hover:border-amber-400 dark:hover:border-amber-500",
        "hover:shadow-lg hover:shadow-amber-900/10",
        "transition-all duration-300 ease-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2",
        className
      )}
      aria-label={`${name}${description ? `: ${description}` : ''}`}
    >
      <div className="relative h-36 overflow-hidden">
        <div className={cn("absolute inset-0", bgColor)} />
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      </div>
      
      <div className="p-5">
        <h3 className="font-semibold text-stone-900 dark:text-stone-100 text-base truncate" title={name}>
          {name}
        </h3>
        
        <div className="flex items-center justify-center text-amber-600 dark:text-amber-400 mt-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0">
          <span className="text-sm font-medium mr-1">Learn more</span>
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
        </div>
      </div>
    </Link>
  );
}
