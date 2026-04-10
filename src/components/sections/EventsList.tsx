"use client";

import { DataLoadError } from "@/components/ui/DataLoadError";
import { EventCard } from "@/components/ui/Card";
import type { ChurchEvent } from "@/types";

interface EventsListProps {
  events: ChurchEvent[];
  isLoading: boolean;
  isError: boolean;
}

export function EventsList({ events, isLoading, isError }: EventsListProps) {
  if (isError) {
    return (
      <DataLoadError
        title="Unable to Load Events"
        message="We're having trouble loading upcoming events. Please check your connection."
        variant="card"
      />
    );
  }

  if (isLoading) {
    return (
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
    );
  }

  if (!events || events.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-stone-500 dark:text-stone-400">No upcoming events. Check back soon!</p>
      </div>
    );
  }

  const featured = events[0];
  const others = events.slice(1, 3);

  return (
    <div className="space-y-6">
      {featured && (
        <EventCard
          title={featured.title}
          date={featured.startDate}
          time={featured.endDate ? `${featured.startDate.split('T')[1]?.slice(0, 5)} - ${featured.endDate.split('T')[1]?.slice(0, 5)}` : ""}
          location={featured.location || "TBD"}
          category={featured.category as "service" | "special" | "youth" | "community" | undefined}
          description={featured.description}
          featured
        />
      )}
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
  );
}
