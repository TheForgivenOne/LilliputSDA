"use client";

import { useState } from "react";
import { Calendar as CalendarIcon, Clock, MapPin, Filter, Bell } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { EventCard, AnnouncementCard } from "@/components/ui/Card";
import type { ChurchEvent, Announcement } from "@/types";

const categories = [
  { id: "all", label: "All Events" },
  { id: "service", label: "Services" },
  { id: "youth", label: "Youth" },
  { id: "community", label: "Community" },
  { id: "special", label: "Special" },
];

const announcementCategories = [
  { id: "all", label: "All News" },
  { id: "general", label: "General" },
  { id: "youth", label: "Youth" },
  { id: "ministry", label: "Ministry" },
  { id: "community", label: "Community" },
];

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState<"events" | "news">("events");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedAnnouncementCategory, setSelectedAnnouncementCategory] = useState("all");

  const events = useQuery(api.events.queries.listUpcoming);
  const announcements = useQuery(api.announcements.queries.listLatest);

  const eventsLoading = events === undefined;
  const announcementsLoading = announcements === undefined;

  // Static upcoming events
  const staticEvents: ChurchEvent[] = [
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

  const filteredEvents = events 
    ? [...staticEvents, ...events].filter((event: ChurchEvent) =>
        selectedCategory === "all" ? true : event.category === selectedCategory
      )
    : staticEvents;

  const filteredAnnouncements = announcements
    ? announcements.filter((announcement: Announcement) =>
        selectedAnnouncementCategory === "all" 
          ? true 
          : announcement.category === selectedAnnouncementCategory
      )
    : [];

  const renderEventsLoading = () => (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white dark:bg-stone-800 rounded-xl overflow-hidden shadow-md">
          <div className="flex flex-col sm:flex-row">
            <div className="p-6 sm:w-28 flex flex-row sm:flex-col items-center justify-center bg-amber-100 dark:bg-amber-900/30">
              <div className="h-12 w-12 bg-stone-200 dark:bg-stone-700 rounded animate-pulse" />
            </div>
            <div className="p-6 flex-1 space-y-3">
              <div className="h-6 bg-stone-200 dark:bg-stone-700 rounded animate-pulse w-2/3" />
              <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded animate-pulse w-1/2" />
              <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded animate-pulse w-3/4" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderAnnouncementsLoading = () => (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white dark:bg-stone-800 rounded-xl p-6 shadow-sm border-l-4 border-amber-500">
          <div className="h-6 bg-stone-200 dark:bg-stone-700 rounded animate-pulse w-2/3 mb-3" />
          <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded animate-pulse mb-2" />
          <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded animate-pulse w-4/5" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-amber-700 dark:bg-amber-800 text-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-amber-200 font-medium mb-4 block">
              Stay Connected
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Events & News
            </h1>
            <p className="text-xl text-amber-100 leading-relaxed">
              Stay informed about upcoming events, activities, and announcements 
              from Lilliput SDA Church.
            </p>
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="bg-stone-100 dark:bg-stone-800/50 border-b border-stone-200 dark:border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("events")}
              className={`px-6 py-4 font-medium transition-colors border-b-4 ${
                activeTab === "events"
                  ? "border-amber-700 text-amber-700 dark:text-amber-400"
                  : "border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
              }`}
            >
              Events
            </button>
            <button
              onClick={() => setActiveTab("news")}
              className={`px-6 py-4 font-medium transition-colors border-b-4 ${
                activeTab === "news"
                  ? "border-amber-700 text-amber-700 dark:text-amber-400"
                  : "border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
              }`}
            >
              News
            </button>
          </div>
        </div>
      </section>

      {/* Events Tab */}
      {activeTab === "events" && (
        <>
          {/* Category Filter */}
          <section className="py-6 bg-stone-100 dark:bg-stone-800/50 border-b border-stone-200 dark:border-stone-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-4 overflow-x-auto pb-2">
                <Filter className="w-5 h-5 text-stone-500 flex-shrink-0" />
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                      selectedCategory === category.id
                        ? "bg-amber-700 text-white"
                        : "bg-white dark:bg-stone-700 text-stone-700 dark:text-stone-300 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Events List */}
          <section className="py-16 lg:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Events Column */}
                <div className="lg:col-span-2">
                  <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-6">
                    {selectedCategory === "all" ? "All Events" : categories.find(c => c.id === selectedCategory)?.label}
                  </h2>
                  
                  {eventsLoading ? (
                    renderEventsLoading()
                  ) : filteredEvents.length > 0 ? (
                    <div className="space-y-6">
                      {filteredEvents.map((event: ChurchEvent) => (
                        <EventCard
                          key={event._id}
                          title={event.title}
                          date={event.startDate}
                          time={event.endDate ? `${event.startDate.split('T')[1]?.slice(0, 5)} - ${event.endDate.split('T')[1]?.slice(0, 5)}` : undefined}
                          location={event.location || "TBD"}
                          description={event.description}
                          category={event.category as "service" | "special" | "youth" | "community" | undefined}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-white dark:bg-stone-800 rounded-xl">
                      <CalendarIcon className="w-12 h-12 text-stone-300 mx-auto mb-4" />
                      <p className="text-stone-500 dark:text-stone-400">
                        No events found in this category.
                      </p>
                      <p className="text-sm text-stone-400 dark:text-stone-500 mt-2">
                        Check back soon for upcoming events.
                      </p>
                    </div>
                  )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Regular Services */}
                  <div className="bg-white dark:bg-stone-800 p-6 rounded-xl shadow-md">
                    <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 mb-4">
                      Regular Services
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-amber-700 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-stone-900 dark:text-stone-100">
                            Sabbath School
                          </p>
                          <p className="text-sm text-stone-500 dark:text-stone-400">
                            Saturdays at 9:30 AM
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-amber-700 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-stone-900 dark:text-stone-100">
                            Divine Service
                          </p>
                          <p className="text-sm text-stone-500 dark:text-stone-400">
                            Saturdays at 11:00 AM
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-amber-700 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-stone-900 dark:text-stone-100">
                            AY Society
                          </p>
                          <p className="text-sm text-stone-500 dark:text-stone-400">
                            Saturdays at 4:30 PM
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-amber-700 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-stone-900 dark:text-stone-100">
                            Prayer Meeting
                          </p>
                          <p className="text-sm text-stone-500 dark:text-stone-400">
                            Wednesdays at 7:00 PM
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="bg-white dark:bg-stone-800 p-6 rounded-xl shadow-md">
                    <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 mb-4">
                      Location
                    </h3>
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-amber-700 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-stone-900 dark:text-stone-100">
                          Lilliput SDA Church
                        </p>
                        <p className="text-sm text-stone-500 dark:text-stone-400">
                          Lot 200-202, Lilliput District
                        </p>
                        <p className="text-sm text-stone-500 dark:text-stone-400">
                          Montego Bay, St. James, Jamaica
                        </p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <a
                        href="https://maps.google.com/?q=Lilliput+SDA+Church+Montego+Bay+Jamaica"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-amber-700 dark:text-amber-400 font-medium text-sm hover:underline"
                      >
                        <MapPin className="w-4 h-4" />
                        Get Directions
                      </a>
                    </div>
                  </div>

                  {/* Subscribe CTA */}
                  <div className="bg-amber-700 dark:bg-amber-800 p-6 rounded-xl text-white">
                    <h3 className="text-lg font-bold mb-2">Stay Updated</h3>
                    <p className="text-amber-100 text-sm mb-4">
                      Follow us on social media for the latest events and announcements.
                    </p>
                    <div className="flex gap-3">
                      <a
                        href="https://facebook.com/lilliputsda"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                      </a>
                      <a
                        href="https://instagram.com/lilliputsda"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* News Tab */}
      {activeTab === "news" && (
        <>
          {/* Category Filter */}
          <section className="py-6 bg-stone-100 dark:bg-stone-800/50 border-b border-stone-200 dark:border-stone-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-4 overflow-x-auto pb-2">
                <Filter className="w-5 h-5 text-stone-500 flex-shrink-0" />
                {announcementCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedAnnouncementCategory(category.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                      selectedAnnouncementCategory === category.id
                        ? "bg-amber-700 text-white"
                        : "bg-white dark:bg-stone-700 text-stone-700 dark:text-stone-300 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Announcements List */}
          <section className="py-16 lg:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2">
                  {announcementsLoading ? (
                    renderAnnouncementsLoading()
                  ) : filteredAnnouncements.length > 0 ? (
                    <>
                      {/* Featured Announcement */}
                      {filteredAnnouncements.find((a: Announcement) => a.priority === "high") && (
                        <div className="mb-8">
                          <div className="flex items-center gap-2 mb-4">
                            <Bell className="w-5 h-5 text-rose-500" />
                            <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                              Featured Announcement
                            </h2>
                          </div>
                          {filteredAnnouncements
                            .filter((a: Announcement) => a.priority === "high")
                            .map((announcement: Announcement) => (
                              <AnnouncementCard
                                key={announcement._id}
                                title={announcement.title}
                                content={announcement.content}
                                date={announcement.date}
                                priority={announcement.priority as "low" | "normal" | "high" | undefined}
                                category={announcement.category}
                              />
                            ))}
                        </div>
                      )}

                      {/* Recent Announcements */}
                      <div>
                        <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-6">
                          Recent Announcements
                        </h2>
                        <div className="space-y-6">
                          {filteredAnnouncements
                            .filter((a: Announcement) => a.priority !== "high")
                            .map((announcement: Announcement) => (
                              <AnnouncementCard
                                key={announcement._id}
                                title={announcement.title}
                                content={announcement.content}
                                date={announcement.date}
                                priority={announcement.priority as "low" | "normal" | "high" | undefined}
                                category={announcement.category}
                              />
                            ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-12 bg-white dark:bg-stone-800 rounded-xl">
                      <Bell className="w-12 h-12 text-stone-300 mx-auto mb-4" />
                      <p className="text-stone-500 dark:text-stone-400">
                        No announcements found in this category.
                      </p>
                      <p className="text-sm text-stone-400 dark:text-stone-500 mt-2">
                        Check back soon for the latest news.
                      </p>
                    </div>
                  )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Newsletter Signup */}
                  <div className="bg-amber-700 dark:bg-amber-800 p-6 rounded-xl text-white">
                    <h3 className="text-lg font-bold mb-2">Stay Updated</h3>
                    <p className="text-amber-100 text-sm mb-4">
                      Get the latest news and announcements delivered to your inbox.
                    </p>
                    <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                      <input
                        type="email"
                        placeholder="Your email address"
                        className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-amber-200 focus:outline-none focus:ring-2 focus:ring-white/30"
                      />
                      <button
                        type="submit"
                        className="w-full px-4 py-2 bg-white text-amber-700 rounded-lg font-medium hover:bg-stone-100 transition-colors"
                      >
                        Subscribe
                      </button>
                    </form>
                  </div>

                  {/* Submit News */}
                  <div className="bg-white dark:bg-stone-800 p-6 rounded-xl shadow-md">
                    <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 mb-2">
                      Have News to Share?
                    </h3>
                    <p className="text-stone-600 dark:text-stone-300 text-sm mb-4">
                      Submit announcements for your ministry or department.
                    </p>
                    <a
                      href="mailto:lhamilton@westjamaica.org"
                      className="inline-flex items-center gap-2 text-amber-700 dark:text-amber-400 font-medium hover:underline"
                    >
                      Submit Announcement
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* First-Time Visitors Section */}
      <section className="py-16 lg:py-24 bg-stone-100 dark:bg-stone-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-amber-700 dark:text-amber-400 font-medium mb-2 block">
              Welcome
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-stone-900 dark:text-stone-100 mb-4">
              First Time Visitors
            </h2>
            <p className="text-stone-600 dark:text-stone-300 max-w-2xl mx-auto">
              We&apos;re so glad you&apos;re considering visiting us! Here&apos;s 
              what you can expect when you come to Lilliput SDA Church.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "What Should I Wear?",
                content: "Come as you are! While some members dress formally for Sabbath services, we welcome you in whatever makes you comfortable. Modest, respectful attire is appreciated.",
              },
              {
                title: "What About My Children?",
                content: "We love children! We offer Sabbath School classes for all ages, and children are welcome in our main service. Nursery care is available for infants.",
              },
              {
                title: "Do You Have Parking?",
                content: "Yes, we have parking available on the church grounds. Our parking attendants will direct you when you arrive.",
              },
              {
                title: "Is the Service in English?",
                content: "Yes, all our services are conducted in English. We welcome visitors from all backgrounds and cultures.",
              },
            ].map((info) => (
              <div
                key={info.title}
                className="p-6 rounded-2xl border border-stone-100 dark:border-stone-700 bg-white dark:bg-stone-800/50"
              >
                <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 mb-3">
                  {info.title}
                </h3>
                <p className="text-stone-600 dark:text-stone-300">
                  {info.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
