"use client";

import { DataLoadError } from "@/components/ui/DataLoadError";
import { EventCard } from "@/components/ui/Card";
import type { ChurchEvent } from "@/types";
import { STATIC_EVENTS, FALLBACK_EVENTS } from "@/config/staticData";

interface EventsListProps {
  events: ChurchEvent[];
  isLoading: boolean;
  isError: boolean;
}

export function EventsList({ events, isLoading, isError }: EventsListProps) {
  if (isError) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DataLoadError
          title="Unable to Load Events"
          message="We're having trouble loading upcoming events. Please check your connection."
          variant="card"
        />
        <div className="space-y-6">
          <EventCard
            title="Check Back Soon"
            date={new Date().toISOString()}
            time=""
            location="Lilliput SDA Church"
            category="special"
            description="We're planning exciting events. Stay tuned for updates!"
            compact
          />
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-stone-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="h-48 bg-stone-200 dark:bg-stone-700 animate-pulse" />
          <div className="p-6 space-y-3">
            <div className="h-6 bg-stone-200 dark:bg-stone-700 rounded animate-pulse w-1/3" />
            <div className="h-8 bg-stone-200 dark:bg-stone-700 rounded animate-pulse" />
            <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded animate-pulse w-2/3" />
          </div>
        </div>
        <div className="space-y-6">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white dark:bg-stone-800 rounded-2xl p-5 shadow-sm">
              <div className="flex gap-4">
                <div className="w-16 h-16 bg-stone-200 dark:bg-stone-700 rounded animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-stone-200 dark:bg-stone-700 rounded animate-pulse w-3/4" />
                  <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded animate-pulse w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const displayEvents = events && events.length > 0 
    ? [...STATIC_EVENTS, ...events].slice(0, 3)
    : STATIC_EVENTS;

  if (displayEvents.length === 0) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {FALLBACK_EVENTS.map((event) => (
          <EventCard
            key={event._id}
            title={event.title}
            date={event.startDate}
            time={event.time}
            location={event.location || "TBD"}
            category={event.category as "service" | "special" | "youth" | "community" | undefined}
            description={event.description}
            featured={event._id === "fallback-1"}
            compact={event._id !== "fallback-1"}
          />
        ))}
      </div>
    );
  }

  const featured = displayEvents[0];
  const others = displayEvents.slice(1, 3);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="lg:col-span-1">
        <div className="h-full">
          <EventCard
            title={featured.title}
            date={featured.startDate}
            time={featured.endDate ? `${featured.startDate.split('T')[1]?.slice(0, 5)} - ${featured.endDate.split('T')[1]?.slice(0, 5)}` : ""}
            location={featured.location || "TBD"}
            category={featured.category as "service" | "special" | "youth" | "community" | undefined}
            description={featured.description}
            featured
          />
        </div>
      </div>
      <div className="space-y-6">
        {others.map((event: ChurchEvent) => (
          <EventCard
            key={event._id}
            title={event.title}
            date={event.startDate}
            time={event.endDate ? `${event.startDate.split('T')[1]?.slice(0, 5)} - ${event.endDate.split('T')[1]?.slice(0, 5)}` : ""}
            location={event.location || "TBD"}
            category={event.category as "service" | "special" | "youth" | "community" | undefined}
            description={event.description}
            compact
          />
        ))}
      </div>
    </div>
  );
}
