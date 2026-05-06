"use client";

import { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Bell } from "lucide-react";
import { EventCard, AnnouncementCard } from "@/components/ui/Card";
import { PageHero } from "@/components/sections/PageHero";
import { CategoryFilter } from "@/components/ui/CategoryFilter";
import { EventsSidebar } from "@/components/sections/EventsSidebar";
import { DataLoadError } from "@/components/ui/DataLoadError";
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
  
  const [events, setEvents] = useState<ChurchEvent[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [eventsError, setEventsError] = useState(false);
  const [announcementsLoading, setAnnouncementsLoading] = useState(true);
  const [announcementsError, setAnnouncementsError] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [eventsRes, announcementsRes] = await Promise.all([
          fetch("/api/events"),
          fetch("/api/announcements"),
        ]);
        
        const eventsData = await eventsRes.json();
        const announcementsData = await announcementsRes.json();
        
        if (Array.isArray(eventsData)) setEvents(eventsData);
        if (Array.isArray(announcementsData)) setAnnouncements(announcementsData);
      } catch {
        setEventsError(true);
        setAnnouncementsError(true);
      } finally {
        setEventsLoading(false);
        setAnnouncementsLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredEvents = events.filter((event: ChurchEvent) =>
    selectedCategory === "all" ? true : event.category === selectedCategory
  );

  const filteredAnnouncements = announcements
    ? announcements.filter((announcement: Announcement) =>
        selectedAnnouncementCategory === "all" 
          ? true 
          : announcement.category === selectedAnnouncementCategory
      )
    : [];

  return (
    <div className="min-h-screen">
      <PageHero
        title="Events & News"
        description="Stay informed about upcoming events, activities, and announcements from Lilliput SDA Church."
        badge={<span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-amber-200 font-semibold text-sm backdrop-blur-sm"><span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />Stay Connected</span>}
        theme="amber"
      />

      <section className="sticky top-16 lg:top-20 z-30 bg-white/95 dark:bg-stone-900/95 backdrop-blur-xl border-b border-stone-200 dark:border-stone-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1">
            {(["events", "news"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 font-semibold transition-all relative ${
                  activeTab === tab
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-300"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {activeTab === "events" && (
        <>
          <section className="py-6 bg-stone-50 dark:bg-stone-800/50 border-b border-stone-200 dark:border-stone-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <CategoryFilter
                categories={categories}
                selected={selectedCategory}
                onSelect={setSelectedCategory}
              />
            </div>
          </section>

          <section className="py-16 lg:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-8 font-[family-name:var(--font-playfair)]">
                    {selectedCategory === "all" ? "All Events" : categories.find(c => c.id === selectedCategory)?.label}
                  </h2>
                  
                  {eventsError ? (
                    <DataLoadError
                      title="Unable to Load Events"
                      message="We're having trouble loading events. Please check your connection."
                      variant="card"
                    />
                  ) : eventsLoading ? (
                    <div className="space-y-6">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white dark:bg-stone-800 rounded-2xl overflow-hidden shadow-sm">
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
                  ) : filteredEvents.length > 0 ? (
                    <div className="space-y-6 stagger-children">
                      {filteredEvents.map((event: ChurchEvent) => (
                        <EventCard
                          key={event.id}
                          title={event.title}
                          date={event.startDate}
                          time={event.endDate ? `${event.startDate.split('T')[1]?.slice(0, 5)} - ${event.endDate.split('T')[1]?.slice(0, 5)}` : undefined}
                          location={event.location || "TBD"}
                          description={event.description}
                          category={event.category as "service" | "special" | "youth" | "community" | undefined}
                        />
                      ))}
                    </div>
                  ) : null}
                </div>

                <div className="space-y-6">
                  <EventsSidebar />
                  
                  <div className="bg-gradient-to-br from-amber-500 to-orange-500 p-6 rounded-2xl text-white shadow-lg shadow-amber-500/25">
                    <h3 className="text-lg font-bold mb-2 font-[family-name:var(--font-playfair)]">Stay Updated</h3>
                    <p className="text-amber-100 text-sm mb-4">
                      Follow us on social media for the latest events and announcements.
                    </p>
                    <div className="flex gap-3">
                      <a
                        href="https://facebook.com/lilliputsda"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                      </a>
                      <a
                        href="https://instagram.com/lilliputsda"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
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

      {activeTab === "news" && (
        <>
          <section className="py-6 bg-stone-50 dark:bg-stone-800/50 border-b border-stone-200 dark:border-stone-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <CategoryFilter
                categories={announcementCategories}
                selected={selectedAnnouncementCategory}
                onSelect={setSelectedAnnouncementCategory}
              />
            </div>
          </section>

          <section className="py-16 lg:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  {announcementsError ? (
                    <div className="space-y-6">
                      <DataLoadError
                        title="Unable to Load Announcements"
                        message="We're having trouble loading announcements. Please check your connection."
                        variant="card"
                      />
                      <div className="text-center py-8 bg-white dark:bg-stone-800 rounded-2xl">
                        <Bell className="w-12 h-12 text-stone-300 mx-auto mb-4" />
                        <p className="text-stone-500 dark:text-stone-400">
                          Check back soon for the latest news.
                        </p>
                      </div>
                    </div>
                  ) : announcementsLoading ? (
                    <div className="space-y-6">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white dark:bg-stone-800 rounded-2xl p-6 shadow-sm border-l-4 border-amber-500">
                          <div className="h-6 bg-stone-200 dark:bg-stone-700 rounded animate-pulse w-2/3 mb-3" />
                          <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded animate-pulse mb-2" />
                          <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded animate-pulse w-4/5" />
                        </div>
                      ))}
                    </div>
                  ) : filteredAnnouncements.length > 0 ? (
                    <>
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
                                key={announcement.id}
                                title={announcement.title}
                                content={announcement.content}
                                date={announcement.date}
                                priority={announcement.priority as "low" | "normal" | "high" | undefined}
                                category={announcement.category}
                              />
                            ))}
                        </div>
                      )}

                      <div>
                        <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-8 font-[family-name:var(--font-playfair)]">
                          Recent Announcements
                        </h2>
                        <div className="space-y-6">
                          {filteredAnnouncements
                            .filter((a: Announcement) => a.priority !== "high")
                            .map((announcement: Announcement) => (
                              <AnnouncementCard
                                key={announcement.id}
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
                  ) : null}
                </div>

                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-amber-500 to-orange-500 p-6 rounded-2xl text-white shadow-lg shadow-amber-500/25">
                    <h3 className="text-lg font-bold mb-2 font-[family-name:var(--font-playfair)]">Stay Updated</h3>
                    <p className="text-amber-100 text-sm mb-4">
                      Get the latest news and announcements delivered to your inbox.
                    </p>
                    <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                      <input
                        type="email"
                        placeholder="Your email address"
                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-amber-200 focus:outline-none focus:ring-2 focus:ring-white/30 backdrop-blur-sm"
                      />
                      <button
                        type="submit"
                        className="w-full px-4 py-3 bg-white text-amber-700 rounded-xl font-semibold hover:bg-stone-100 transition-colors shadow-lg"
                      >
                        Subscribe
                      </button>
                    </form>
                  </div>

                  <div className="bg-white dark:bg-stone-800 p-6 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-700">
                    <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 mb-2 font-[family-name:var(--font-playfair)]">
                      Have News to Share?
                    </h3>
                    <p className="text-stone-600 dark:text-stone-300 text-sm mb-4">
                      Submit announcements for your ministry or department.
                    </p>
                    <a
                      href="mailto:lhamilton@westjamaica.org"
                      className="inline-flex items-center gap-2 text-amber-600 dark:text-amber-400 font-semibold hover:underline"
                    >
                      Submit Announcement
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      <section className="py-16 lg:py-24 bg-stone-50 dark:bg-stone-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full text-sm font-semibold mb-4">
              Welcome
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-stone-900 dark:text-stone-100 mb-4 font-[family-name:var(--font-playfair)]">
              First Time Visitors
            </h2>
            <p className="text-stone-600 dark:text-stone-300 max-w-2xl mx-auto text-lg">
              We&apos;re so glad you&apos;re considering visiting us! Here&apos;s 
              what you can expect when you come to Lilliput SDA Church.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
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
                className="p-6 lg:p-8 rounded-2xl border border-stone-100 dark:border-stone-700 bg-white dark:bg-stone-800 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-300 hover:-translate-y-1"
              >
                <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 mb-3 font-[family-name:var(--font-playfair)]">
                  {info.title}
                </h3>
                <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
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
