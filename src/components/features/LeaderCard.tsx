"use client";

import { useState } from "react";
import { cn, getInitials } from "@/lib/utils";
import Image from "next/image";

interface LeaderCardProps {
  name: string;
  role: string;
  title?: string;
  photoUrl?: string;
  email?: string;
  className?: string;
}

export function LeaderCard({
  name,
  role,
  title,
  photoUrl,
  email,
  className,
}: LeaderCardProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <div
      className={cn(
        "bg-white dark:bg-stone-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5",
        "border border-stone-100 dark:border-stone-700",
        "hover:border-amber-200 dark:hover:border-amber-800",
        "text-center group",
        className
      )}
    >
      <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-amber-100 dark:border-amber-900/30 group-hover:border-amber-300 dark:group-hover:border-amber-700 transition-colors shadow-inner">
        {!imageError && photoUrl ? (
          <>
            <Image
              src={photoUrl}
              alt={`${name} - ${role}`}
              fill
              className={cn(
                "object-cover transition-opacity duration-300",
                imageLoading ? "opacity-0" : "opacity-100"
              )}
              onLoad={() => setImageLoading(false)}
              onError={() => {
                setImageError(true);
                setImageLoading(false);
              }}
              unoptimized
            />
            {imageLoading && (
              <div className="absolute inset-0 bg-stone-200 dark:bg-stone-700 animate-pulse" />
            )}
          </>
        ) : (
          <div className="w-full h-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-600 dark:text-amber-400 text-2xl font-bold" aria-label={getInitials(name)}>
            {getInitials(name)}
          </div>
        )}
      </div>

      <div className="space-y-1 min-w-0">
        <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 leading-tight truncate" title={name}>
          {name || "Unnamed"}
        </h3>
        <p className="text-amber-700 dark:text-amber-500 text-sm font-medium truncate" title={role}>
          {role}
        </p>
        {title && (
          <p className="text-stone-500 dark:text-stone-400 text-xs truncate" title={title}>
            {title}
          </p>
        )}
        {email && (
          <a
            href={`mailto:${encodeURIComponent(email)}`}
            className="inline-block text-stone-400 dark:text-stone-500 text-xs hover:text-amber-700 dark:hover:text-amber-400 transition-colors mt-2 truncate max-w-full"
            title={email}
          >
            {email}
          </a>
        )}
      </div>
    </div>
  );
}

export function LeaderCardGroup({
  children,
  title,
  description,
  className,
}: {
  children: React.ReactNode;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={cn("mb-12", className)}>
      <div className="text-center mb-8">
        <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100 mb-2">
          {title}
        </h3>
        {description && (
          <p className="text-stone-500 dark:text-stone-400 text-sm max-w-lg mx-auto">
            {description}
          </p>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {children}
      </div>
    </div>
  );
}
