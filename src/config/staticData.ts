import type { ChurchEvent } from "@/types";

export const STATIC_EVENTS: ChurchEvent[] = [
  {
    _id: "static-1",
    title: "Global Youth Day",
    startDate: "2026-03-21T09:00:00",
    location: "Lilliput SDA Church",
    category: "youth",
    description: "Join youth around the world in a day of service and fellowship. A special day dedicated to youth ministry and community outreach."
  },
  {
    _id: "static-2",
    title: "Convention",
    startDate: "2026-03-28T10:00:00",
    location: "Lilliput SDA Church",
    category: "special",
    description: "Annual church convention featuring inspiring speakers, worship, and fellowship. All are welcome to attend this special gathering."
  },
  {
    _id: "static-3",
    title: "LILLIDISCA CAMP",
    startDate: "2026-04-02T08:00:00",
    endDate: "2026-04-06T18:00:00",
    location: "Camp Site",
    category: "youth",
    description: "Five-day camp experience for spiritual growth, fellowship, and fun activities. An unforgettable time of learning and bonding."
  }
];

export const FALLBACK_EVENTS: ChurchEvent[] = [
  {
    _id: "fallback-1",
    title: "Sabbath Worship Service",
    startDate: new Date(Date.now() + 86400000).toISOString(),
    time: "11:00 AM",
    location: "Lilliput SDA Church Sanctuary",
    category: "service",
    description: "Join us for uplifting worship and inspiring message.",
  },
  {
    _id: "fallback-2",
    title: "No upcoming events",
    startDate: new Date().toISOString(),
    location: "Check back soon for more events",
    category: "special",
    description: "We're planning exciting events. Stay tuned!",
  }
];

export const FALLBACK_ANNOUNCEMENTS = [
  {
    _id: "fallback-1",
    title: "Stay Connected",
    content: "No current announcements. Check back soon for updates from our church community.",
    date: new Date().toISOString(),
    priority: "normal",
    category: "General"
  },
  {
    _id: "fallback-2",
    title: "Weekly Bulletin",
    content: "Our weekly bulletin is published every Friday with updates on events and ministries.",
    date: new Date().toISOString(),
    priority: "low",
    category: "General"
  }
];
