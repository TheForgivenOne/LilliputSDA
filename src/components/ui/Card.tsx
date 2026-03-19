"use client";

import { ReactNode, useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingMap = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export function Card({ children, className, hover = true, padding = "md" }: CardProps) {
  return (
    <div
      className={cn(
        "bg-white dark:bg-stone-800 rounded-xl overflow-hidden",
        "border border-stone-100 dark:border-stone-700",
        hover && [
          "shadow-sm hover:shadow-md transition-all duration-300",
          "hover:-translate-y-0.5",
          "focus-within:ring-2 focus-within:ring-amber-500 focus-within:ring-offset-2",
        ],
        paddingMap[padding],
        className
      )}
    >
      {children}
    </div>
  );
}

interface StaffCardProps {
  name: string;
  role: string;
  title?: string;
  bio?: string;
  photoUrl?: string;
  email?: string;
  phone?: string;
  className?: string;
}

export function StaffCard({
  name,
  role,
  title,
  bio,
  photoUrl,
  email,
  phone,
  className,
}: StaffCardProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const getInitials = (nameStr: string): string => {
    const cleaned = nameStr.trim();
    if (!cleaned) return "?";
    const parts = cleaned.split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return cleaned.substring(0, 2).toUpperCase();
  };

  return (
    <Card className={className} padding="md">
      <div className="flex flex-col sm:flex-row gap-6">
        <div className="flex-shrink-0">
          <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden bg-amber-50 dark:bg-amber-900/20 mx-auto sm:mx-0 shadow-inner">
            {!imageError && photoUrl ? (
              <>
                <Image
                  src={photoUrl}
                  alt={name}
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
              <div className="w-full h-full flex items-center justify-center text-amber-600 dark:text-amber-400 text-4xl font-bold" aria-label={getInitials(name)}>
                {getInitials(name)}
              </div>
            )}
          </div>
        </div>
        <div className="flex-1 min-w-0 text-center sm:text-left">
          <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100 truncate" title={name}>
            {name}
          </h3>
          <p className="text-amber-700 dark:text-amber-500 font-medium mt-1 truncate" title={role}>
            {role}
          </p>
          {title && (
            <p className="text-stone-500 dark:text-stone-400 text-sm mt-1">
              {title}
            </p>
          )}
          {bio && (
            <p className="text-stone-600 dark:text-stone-300 mt-3 text-sm leading-relaxed">
              {bio}
            </p>
          )}
          {(email || phone) && (
            <div className="mt-4 space-y-1 text-sm">
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="block text-stone-600 dark:text-stone-400 hover:text-amber-700 dark:hover:text-amber-400 transition-colors"
                >
                  {email}
                </a>
              )}
              {phone && (
                <p className="text-stone-500 dark:text-stone-400">{phone}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

interface MinistryDetailCardProps {
  name: string;
  description: string;
  leader?: string;
  meetingTime?: string;
  meetingLocation?: string;
  imageUrl?: string;
  category?: string;
  className?: string;
}

export function MinistryDetailCard({
  name,
  description,
  leader,
  meetingTime,
  meetingLocation,
  imageUrl,
  category,
  className,
}: MinistryDetailCardProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const categoryColors: Record<string, string> = {
    youth: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
    adult: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
    family: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
    music: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  };

  return (
    <Card className={className} padding="none">
      {imageUrl && !imageError && (
        <div className="relative h-48 w-full overflow-hidden">
          <Image 
            src={imageUrl} 
            alt={name} 
            fill 
            className={cn(
              "object-cover transition-transform duration-500 hover:scale-105",
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>
      )}
      <div className="p-6">
        {category && (
          <span
            className={cn(
              "inline-block px-3 py-1 rounded-full text-xs font-medium mb-3",
              categoryColors[category] ||
                "bg-stone-100 text-stone-700 dark:bg-stone-700 dark:text-stone-300"
            )}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </span>
        )}
        <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 mb-2 truncate" title={name}>
          {name}
        </h3>
        <p className="text-stone-600 dark:text-stone-300 text-sm leading-relaxed mb-4 line-clamp-3">
          {description}
        </p>
        <div className="space-y-2 text-sm border-t border-stone-100 dark:border-stone-700 pt-4">
          {leader && (
            <p className="text-stone-700 dark:text-stone-300">
              <span className="font-medium text-stone-900 dark:text-stone-200">Leader:</span> {leader}
            </p>
          )}
          {meetingTime && (
            <p className="text-stone-600 dark:text-stone-400">
              <span className="font-medium text-stone-900 dark:text-stone-200">When:</span> {meetingTime}
            </p>
          )}
          {meetingLocation && (
            <p className="text-stone-600 dark:text-stone-400">
              <span className="font-medium text-stone-900 dark:text-stone-200">Where:</span> {meetingLocation}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}

interface EventCardProps {
  title: string;
  date: string;
  time?: string;
  location: string;
  description?: string;
  category?: "service" | "special" | "youth" | "community";
  className?: string;
  featured?: boolean;
  compact?: boolean;
}

export function EventCard({
  title,
  date,
  time,
  location,
  description,
  category,
  className,
  featured = false,
  compact = false,
}: EventCardProps) {

  const categoryColors: Record<string, string> = {
    service: "bg-amber-600 text-white",
    special: "bg-amber-700 text-white",
    youth: "bg-emerald-600 text-white",
    community: "bg-green-700 text-white",
  };

  const safeFormatDate = (dateStr: string) => {
    try {
      const eventDate = new Date(dateStr);
      if (isNaN(eventDate.getTime())) {
        return { dayName: 'TBD', dayNumber: '--', monthName: '' };
      }
      const utcDate = new Date(eventDate.toISOString());
      return {
        dayName: utcDate.toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" }),
        dayNumber: utcDate.getUTCDate(),
        monthName: utcDate.toLocaleDateString("en-US", { month: "short", timeZone: "UTC" })
      };
    } catch {
      return { dayName: 'TBD', dayNumber: '--', monthName: '' };
    }
  };

  const { dayName, dayNumber, monthName } = safeFormatDate(date);

  return (
    <Card className={className} padding={compact ? "none" : "none"} hover={true}>
      <div className={cn(
        "flex",
        featured ? "flex-col lg:flex-row" : compact ? "flex-col sm:flex-row" : "flex-col sm:flex-row"
      )}>
        <div className={cn(
          "flex-shrink-0 flex items-center justify-center gap-2",
          featured ? "p-6 lg:p-8 lg:w-40 flex-row lg:flex-col" : "p-4 sm:w-28 flex-row sm:flex-col",
          category ? categoryColors[category] : "bg-gradient-to-br from-amber-600 to-amber-700 dark:from-amber-600 dark:to-amber-700 text-white"
        )}>
          <span className={cn("uppercase tracking-wider font-medium opacity-90", featured ? "text-sm" : "text-xs")}>{monthName}</span>
          <span className={cn("font-bold leading-none", featured ? "text-5xl lg:text-6xl" : "text-3xl sm:text-4xl")}>{dayNumber}</span>
          <span className={cn("uppercase tracking-wider font-medium opacity-90", featured ? "text-sm" : "text-xs")}>{dayName}</span>
        </div>

        <div className={cn("flex-1", featured ? "p-6 lg:p-8" : "p-5")}>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {category && (
              <span
                className={cn(
                  "inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold",
                  categoryColors[category]
                )}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </span>
            )}
          </div>
          <h3 className={cn("font-bold text-stone-900 dark:text-stone-100 mb-1 truncate", featured ? "text-2xl lg:text-3xl" : "text-lg")} title={title}>
            {title}
          </h3>
          <p className={cn("text-stone-500 dark:text-stone-400 mb-2 flex items-center gap-1.5", featured ? "text-base" : "text-sm")}>
            <span className="truncate">{location}</span>
            {time && <span className="text-stone-300 dark:text-stone-600">•</span>}
            {time && <span>{time}</span>}
          </p>
          {description && (
            <p className={cn("text-stone-600 dark:text-stone-300 line-clamp-2", featured ? "text-lg" : "text-sm")}>
              {description}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}

interface SermonCardProps {
  title: string;
  speaker: string;
  date: string;
  scripture?: string;
  thumbnailUrl?: string;
  duration?: string;
  className?: string;
}

export function SermonCard({
  title,
  speaker,
  date,
  scripture,
  thumbnailUrl,
  duration,
  className,
}: SermonCardProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const safeFormatDate = (dateStr: string): string => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return 'Date unavailable';
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
      });
    } catch {
      return 'Date unavailable';
    }
  };

  const formattedDate = safeFormatDate(date);
  return (
    <Card className={className} padding="none" hover={true}>
      <div className="relative aspect-video overflow-hidden rounded-t-xl">
        {thumbnailUrl && !imageError ? (
          <>
            <Image
              src={thumbnailUrl}
              alt={title}
              fill
              className={cn(
                "object-cover transition-transform duration-500 hover:scale-105",
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
          <div className="w-full h-full bg-stone-200 dark:bg-stone-700 flex items-center justify-center">
            <svg
              className="w-16 h-16 text-stone-400 dark:text-stone-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        )}
        {duration && (
          <div className="absolute bottom-3 right-3 bg-black/75 text-white text-xs px-2 py-1 rounded font-medium">
            {duration}
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors">
          <div className="w-16 h-16 rounded-full bg-white/95 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100 shadow-lg">
            <svg
              className="w-8 h-8 text-amber-600 ml-1"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-bold text-stone-900 dark:text-stone-100 mb-1.5 line-clamp-2 leading-tight" title={title}>
          {title}
        </h3>
        <p className="text-amber-700 dark:text-amber-500 text-sm font-medium truncate" title={speaker}>
          {speaker}
        </p>
        <p className="text-stone-500 dark:text-stone-400 text-xs mt-1.5">
          {formattedDate}
          {scripture && <span className="mx-1.5">•</span>}
          {scripture && <span className="text-stone-600 dark:text-stone-300">{scripture}</span>}
        </p>
      </div>
    </Card>
  );
}

interface AnnouncementCardProps {
  title: string;
  content: string;
  date: string;
  priority?: "low" | "normal" | "high";
  category?: string;
  className?: string;
}

export function AnnouncementCard({
  title,
  content,
  date,
  priority = "normal",
  category,
  className,
}: AnnouncementCardProps) {
  const priorityStyles: Record<string, string> = {
    low: "border-l-4 border-stone-300 dark:border-stone-600",
    normal: "border-l-4 border-amber-500",
    high: "border-l-4 border-rose-500",
  };

  const priorityBadge: Record<string, string> = {
    low: "bg-stone-100 text-stone-600 dark:bg-stone-700 dark:text-stone-300",
    normal: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    high: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
  };

  const safeFormatDate = (dateStr: string): string => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return '';
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        timeZone: "UTC",
      });
    } catch {
      return '';
    }
  };

  const formattedDate = safeFormatDate(date);

  return (
    <Card className={cn(priorityStyles[priority], className)} padding="md">
      <div className="flex flex-wrap items-center gap-2 mb-3">
        {priority === "high" && (
          <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold", priorityBadge[priority])}>
            <span className="w-1.5 h-1.5 bg-current rounded-full animate-pulse" />
            Featured
          </span>
        )}
        {category && (
          <span className="text-xs uppercase tracking-wider text-stone-500 dark:text-stone-400 font-medium">
            {category}
          </span>
        )}
        {formattedDate && (
          <span className="text-xs text-stone-400 dark:text-stone-500 ml-auto">
            {formattedDate}
          </span>
        )}
      </div>
      <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 mb-2 truncate" title={title}>
        {title}
      </h3>
      <p className="text-stone-600 dark:text-stone-300 text-sm leading-relaxed line-clamp-4">
        {content}
      </p>
    </Card>
  );
}
