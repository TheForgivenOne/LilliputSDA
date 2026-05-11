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
        "bg-white dark:bg-stone-800 rounded-2xl overflow-hidden",
        "border border-stone-100 dark:border-stone-700",
        hover && [
          "shadow-sm transition-all duration-300",
          "hover:shadow-xl hover:shadow-[rgba(59,58,143,0.10)]",
          "hover:-translate-y-1 hover:border-[var(--primary)]/35 dark:hover:border-[var(--primary)]/50",
          "focus-within:ring-2 focus-within:ring-[var(--primary)] focus-within:ring-offset-2",
          "relative",
          "before:content-[''] before:absolute before:left-6 before:right-6 before:bottom-0 before:h-px",
          "before:bg-gradient-to-r before:from-transparent before:via-[var(--accent-warm)]/0 before:to-transparent",
          "before:transition-all before:duration-500 hover:before:via-[var(--accent-warm)]/60",
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
    <Card className={cn("group", className)} padding="none">
      <div className="flex flex-col sm:flex-row gap-6 p-6">
        <div className="flex-shrink-0">
          <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/30 dark:to-amber-800/20 mx-auto sm:mx-0 shadow-inner group-hover:shadow-amber-500/20 transition-shadow duration-300">
            {!imageError && photoUrl ? (
              <>
                <Image
                  src={photoUrl}
                  alt={name}
                  fill
                  className={cn(
                    "object-cover transition-all duration-500 group-hover:scale-105",
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
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-500 to-amber-600 text-white text-4xl font-bold font-[family-name:var(--font-playfair)]" aria-label={getInitials(name)}>
                {getInitials(name)}
              </div>
            )}
          </div>
        </div>
        <div className="flex-1 min-w-0 text-center sm:text-left">
          <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100 truncate font-[family-name:var(--font-playfair)]" title={name}>
            {name}
          </h3>
          <p className="text-amber-600 dark:text-amber-400 font-semibold mt-1 truncate" title={role}>
            {role}
          </p>
          {title && (
            <p className="text-stone-500 dark:text-stone-400 text-sm mt-1">
              {title}
            </p>
          )}
          {bio && (
            <p className="text-stone-600 dark:text-stone-300 mt-4 text-sm leading-relaxed line-clamp-3">
              {bio}
            </p>
          )}
          {(email || phone) && (
            <div className="mt-4 space-y-1 text-sm">
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="block text-stone-600 dark:text-stone-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors link-underline"
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
    youth: "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white",
    adult: "bg-gradient-to-r from-green-500 to-green-600 text-white",
    family: "bg-gradient-to-r from-amber-500 to-amber-600 text-white",
    music: "bg-gradient-to-r from-orange-500 to-orange-600 text-white",
  };

  return (
    <Card className={cn("group", className)} padding="none">
      {imageUrl && !imageError && (
        <div className="relative h-48 w-full overflow-hidden">
          <Image 
            src={imageUrl} 
            alt={name} 
            fill 
            className={cn(
              "object-cover transition-all duration-700 group-hover:scale-110",
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-lg font-bold text-white font-[family-name:var(--font-playfair)] line-clamp-1">
              {name}
            </h3>
          </div>
        </div>
      )}
      <div className="p-6">
        {!imageUrl && (
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 font-[family-name:var(--font-playfair)]" title={name}>
              {name}
            </h3>
            {category && (
              <span
                className={cn(
                  "inline-block px-3 py-1 rounded-full text-xs font-semibold",
                  categoryColors[category] ||
                    "bg-gradient-to-r from-stone-500 to-stone-600 text-white"
                )}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </span>
            )}
          </div>
        )}
        {imageUrl && category && (
          <span
            className={cn(
              "inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3",
              categoryColors[category] ||
                "bg-gradient-to-r from-stone-500 to-stone-600 text-white"
            )}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </span>
        )}
        <p className="text-stone-600 dark:text-stone-300 text-sm leading-relaxed mb-4 line-clamp-3">
          {description}
        </p>
        <div className="space-y-2 text-sm border-t border-stone-100 dark:border-stone-700 pt-4">
          {leader && (
            <p className="text-stone-700 dark:text-stone-300 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span className="font-medium text-stone-900 dark:text-stone-200">Leader:</span> {leader}
            </p>
          )}
          {meetingTime && (
            <p className="text-stone-600 dark:text-stone-400 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span className="font-medium text-stone-900 dark:text-stone-200">When:</span> {meetingTime}
            </p>
          )}
          {meetingLocation && (
            <p className="text-stone-600 dark:text-stone-400 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
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

  const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
    service: { bg: "bg-gradient-to-br from-amber-500 to-amber-600", text: "text-white", border: "border-amber-500" },
    special: { bg: "bg-gradient-to-br from-orange-500 to-orange-600", text: "text-white", border: "border-orange-500" },
    youth: { bg: "bg-gradient-to-br from-emerald-500 to-emerald-600", text: "text-white", border: "border-emerald-500" },
    community: { bg: "bg-gradient-to-br from-green-500 to-green-600", text: "text-white", border: "border-green-500" },
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
  const catStyle = category ? categoryColors[category] : categoryColors.service;

  return (
    <Card className={cn("group", className)} padding={compact ? "none" : "none"} hover={true}>
      <div className={cn(
        "flex",
        featured ? "flex-col lg:flex-row" : compact ? "flex-col sm:flex-row" : "flex-col sm:flex-row"
      )}>
        <div className={cn(
          "flex-shrink-0 flex items-center justify-center gap-2 relative overflow-hidden",
          featured ? "p-8 lg:p-10 lg:w-44 flex-row lg:flex-col" : "p-5 sm:w-32 flex-row sm:flex-col",
          catStyle.bg, catStyle.text
        )}>
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <span className={cn("uppercase tracking-wider font-semibold relative z-10", featured ? "text-sm" : "text-xs")}>{monthName}</span>
          <span className={cn("font-bold leading-none relative z-10", featured ? "text-6xl lg:text-7xl font-[family-name:var(--font-playfair)]" : "text-4xl sm:text-5xl font-[family-name:var(--font-playfair)]")}>{dayNumber}</span>
          <span className={cn("uppercase tracking-wider font-semibold relative z-10", featured ? "text-sm" : "text-xs")}>{dayName}</span>
        </div>

        <div className={cn("flex-1", featured ? "p-6 lg:p-8" : "p-5")}>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {category && (
              <span
                className={cn(
                  "inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold",
                  catStyle.bg, catStyle.text
                )}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </span>
            )}
          </div>
          <h3 className={cn("font-bold text-stone-900 dark:text-stone-100 mb-2 font-[family-name:var(--font-playfair)]", featured ? "text-2xl lg:text-3xl" : "text-lg")} title={title}>
            {title}
          </h3>
          <p className={cn("text-stone-500 dark:text-stone-400 mb-3 flex flex-wrap items-center gap-x-2 gap-y-1", featured ? "text-base" : "text-sm")}>
            <span className="font-medium">{location}</span>
            {time && (
              <>
                <span className="text-stone-300 dark:text-stone-600">•</span>
                <span>{time}</span>
              </>
            )}
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
    <Card className={cn("group cursor-pointer", className)} padding="none" hover={true}>
      <div className="relative aspect-video overflow-hidden">
        {thumbnailUrl && !imageError ? (
          <>
            <Image
              src={thumbnailUrl}
              alt={title}
              fill
              className={cn(
                "object-cover transition-all duration-700 group-hover:scale-110",
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
          <div className="w-full h-full bg-gradient-to-br from-stone-200 to-stone-300 dark:from-stone-700 dark:to-stone-800 flex items-center justify-center">
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
          <div className="absolute bottom-3 right-3 bg-black/80 text-white text-xs px-2 py-1 rounded font-medium">
            {duration}
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition-colors duration-300">
          <div className="w-16 h-16 rounded-full bg-white/95 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100 shadow-lg">
            <svg
              className="w-7 h-7 text-amber-600 ml-1"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-bold text-stone-900 dark:text-stone-100 mb-2 line-clamp-2 leading-tight font-[family-name:var(--font-playfair)]" title={title}>
          {title}
        </h3>
        <p className="text-amber-600 dark:text-amber-400 text-sm font-semibold truncate" title={speaker}>
          {speaker}
        </p>
        <p className="text-stone-500 dark:text-stone-400 text-xs mt-2">
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
  const priorityStyles: Record<string, { border: string; glow: string }> = {
    low: { border: "border-l-4 border-stone-300 dark:border-stone-600", glow: "" },
    normal: { border: "border-l-4 border-amber-500", glow: "" },
    high: { border: "border-l-4 border-rose-500", glow: "shadow-lg shadow-rose-500/10" },
  };

  const priorityBadge: Record<string, string> = {
    low: "bg-gradient-to-r from-stone-100 to-stone-200 text-stone-600 dark:from-stone-700 dark:to-stone-600 dark:text-stone-300",
    normal: "bg-gradient-to-r from-amber-100 to-amber-200 text-amber-700 dark:from-amber-900/40 dark:to-amber-800/40 dark:text-amber-300",
    high: "bg-gradient-to-r from-rose-100 to-rose-200 text-rose-700 dark:from-rose-900/40 dark:to-rose-800/40 dark:text-rose-300",
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
  const styles = priorityStyles[priority];

  return (
    <Card className={cn(styles.border, styles.glow, "group", className)} padding="lg">
      <div className="flex flex-wrap items-center gap-2 mb-3">
        {priority === "high" && (
          <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold", priorityBadge[priority])}>
            <span className="w-1.5 h-1.5 bg-current rounded-full animate-pulse" />
            Featured
          </span>
        )}
        {category && (
          <span className="text-xs uppercase tracking-wider text-stone-500 dark:text-stone-400 font-semibold">
            {category}
          </span>
        )}
        {formattedDate && (
          <span className="text-xs text-stone-400 dark:text-stone-500 ml-auto">
            {formattedDate}
          </span>
        )}
      </div>
      <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 mb-3 font-[family-name:var(--font-playfair)] group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors" title={title}>
        {title}
      </h3>
      <p className="text-stone-600 dark:text-stone-300 text-sm leading-relaxed line-clamp-4">
        {content}
      </p>
    </Card>
  );
}
