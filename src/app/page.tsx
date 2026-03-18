"use client";

import { Clock, MapPin, Play, Calendar } from "lucide-react";
import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { EventCard, SermonCard, AnnouncementCard } from "@/components/ui/Card";
import { getPlaceholderImage } from "@/lib/utils";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { QuickInfo } from "@/components/features/QuickInfo";
import { HeroSection } from "@/components/features/HeroSection";
import { AboutSplit } from "@/components/features/AboutSplit";
import { QuickMinistryCard } from "@/components/features/QuickMinistryCard";
import { CTASection } from "@/components/features/CTASection";

interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnailUrl: string;
  duration: string;
  viewCount: string;
}

interface ChurchEvent {
  _id: string;
  startDate: string;
  endDate?: string;
  title: string;
  location?: string;
  category?: string;
  description?: string;
}

interface Announcement {
  _id: string;
  title: string;
  content: string;
  date: string;
  priority?: string;
  category?: string;
}

export default function Home() {
  const events = useQuery(api.eventsQueries.listUpcoming);
  const announcements = useQuery(api.announcementsQueries.listLatest);
  
  const [currentTime] = useState<number>(() => {
    if (typeof window === "undefined") return 1742236800000;
    return 1742236800000;
  });
  
  const [sermonVideos, setSermonVideos] = useState<YouTubeVideo[]>([]);
  const [videosLoading, setVideosLoading] = useState(true);

  useEffect(() => {
    async function fetchVideos() {
      try {
        const response = await fetch("/api/youtube/videos?maxResults=6");
        const data = await response.json();
        if (data.videos && data.videos.length > 0) {
          setSermonVideos(data.videos);
        }
      } catch (err) {
        console.error("Failed to fetch sermons:", err);
      } finally {
        setVideosLoading(false);
      }
    }
    fetchVideos();
  }, []);
  
  const quickInfoContent = useMemo(() => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <QuickInfo
        icon={Clock}
        label="Sabbath Service"
        value="Saturdays at 11:00 AM"
      />
      <QuickInfo icon={MapPin} label="Location" value="Lilliput, Montego Bay" />
      <QuickInfo icon={Play} label="Livestream" value="Watch Online" />
    </div>
  ), []);

  const ministries = useMemo(() => [
    { name: "Youth Ministries", imageUrl: getPlaceholderImage(400, 300, "Youth+Ministry"), bgColor: "bg-gradient-to-br from-sky-400 to-cyan-500", href: "/ministries" },
    { name: "Women's Ministry", imageUrl: getPlaceholderImage(400, 300, "Womens+Ministry"), bgColor: "bg-gradient-to-br from-rose-400 to-pink-500", href: "/ministries" },
    { name: "Men's Ministry", imageUrl: getPlaceholderImage(400, 300, "Mens+Ministry"), bgColor: "bg-gradient-to-br from-blue-500 to-indigo-600", href: "/ministries" },
    { name: "Music Ministry", imageUrl: getPlaceholderImage(400, 300, "Music+Ministry"), bgColor: "bg-gradient-to-br from-purple-500 to-violet-600", href: "/ministries" },
  ], []);

  const featuredSermon = useMemo(() => ({
    title: "Walking in Faith: Trusting God's Plan",
    speaker: "Pastor Lataniel Hamilton",
    date: new Date(currentTime - 86400000).toISOString(),
    scripture: "Hebrews 11:1-6",
    thumbnailUrl: getPlaceholderImage(640, 360, "Sermon+Thumbnail"),
    duration: "42:15",
  }), [currentTime]);

  const sermonCards = useMemo(() => {
    if (sermonVideos.length > 0) {
      return sermonVideos.slice(0, 3).map((video) => (
        <Link 
          key={video.id} 
          href={`/media?video=${video.id}`}
          className="w-[280px] sm:w-[320px] lg:w-[360px] flex-shrink-0 block"
        >
          <SermonCard
            title={video.title}
            speaker="Pastor Lataniel Hamilton"
            date={video.publishedAt}
            thumbnailUrl={video.thumbnailUrl}
            duration={video.duration}
          />
        </Link>
      ));
    }
    return [1, 2, 3].map((i) => (
      <Link 
        key={i} 
        href="/media"
        className="w-[280px] sm:w-[320px] lg:w-[360px] flex-shrink-0 block"
      >
        <SermonCard
          title={`${featuredSermon.title} ${i > 1 ? `Part ${i}` : ""}`}
          speaker={featuredSermon.speaker}
          date={new Date(currentTime - i * 7 * 86400000).toISOString()}
          scripture={featuredSermon.scripture}
          thumbnailUrl={getPlaceholderImage(640, 360, `Sermon+${i}`)}
          duration={featuredSermon.duration}
        />
      </Link>
    ));
  }, [sermonVideos, featuredSermon, currentTime]);

  const eventsLoading = events === undefined;
  const announcementsLoading = announcements === undefined;

  const renderEvents = () => {
    if (eventsLoading) {
      return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-stone-800 rounded-xl overflow-hidden shadow-md">
            <div className="h-48 bg-stone-200 dark:bg-stone-700 animate-pulse" />
            <div className="p-6 space-y-3">
              <div className="h-6 bg-stone-200 dark:bg-stone-700 rounded animate-pulse w-1/3" />
              <div className="h-8 bg-stone-200 dark:bg-stone-700 rounded animate-pulse" />
              <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded animate-pulse w-2/3" />
            </div>
          </div>
          <div className="space-y-6">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white dark:bg-stone-800 rounded-xl p-5 shadow-sm">
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

    // Static upcoming events
    const staticEvents = [
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

    // Combine static events with database events, prioritizing static events
    const displayEvents = events && events.length > 0 
      ? [...staticEvents, ...events].slice(0, 3)
      : staticEvents;

    if (displayEvents.length === 0) {
      return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EventCard
            title="Sabbath Worship Service"
            date={new Date(currentTime + 86400000).toISOString()}
            time="11:00 AM"
            location="Lilliput SDA Church Sanctuary"
            category="service"
            description="Join us for uplifting worship and inspiring message."
            featured
          />
          <div className="space-y-6">
            <EventCard
              title="No upcoming events"
              date={new Date(currentTime).toISOString()}
              time=""
              location="Check back soon for more events"
              category="special"
              description="We're planning exciting events. Stay tuned!"
              compact
            />
          </div>
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
              time={featured.endDate ? `${featured.startDate.split('T')[1]?.slice(0, 5)} - ${featured.endDate.split('T')[1]?.slice(0, 5)}` : undefined}
              location={featured.location}
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
              time={event.endDate ? `${event.startDate.split('T')[1]?.slice(0, 5)} - ${event.endDate.split('T')[1]?.slice(0, 5)}` : undefined}
              location={event.location || "TBD"}
              category={event.category as "service" | "special" | "youth" | "community" | undefined}
              description={event.description}
              compact
            />
          ))}
        </div>
      </div>
    );
  };

  const renderAnnouncements = () => {
    if (announcementsLoading) {
      return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white dark:bg-stone-800 rounded-xl p-6 shadow-sm border-l-4 border-amber-500">
              <div className="h-6 bg-stone-200 dark:bg-stone-700 rounded animate-pulse w-2/3 mb-3" />
              <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded animate-pulse mb-2" />
              <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded animate-pulse w-4/5" />
            </div>
          ))}
        </div>
      );
    }

    if (!announcements || announcements.length === 0) {
      return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnnouncementCard
            title="Stay Connected"
            content="No current announcements. Check back soon for updates from our church community."
            date={new Date().toISOString()}
            priority="normal"
            category="General"
          />
          <AnnouncementCard
            title="Weekly Bulletin"
            content="Our weekly bulletin is published every Friday with updates on events and ministries."
            date={new Date().toISOString()}
            priority="low"
            category="General"
          />
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {announcements.slice(0, 2).map((announcement: Announcement) => (
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
    );
  };

  return (
    <div className="min-h-screen">
      <HeroSection
        title="Welcome to"
        subtitle="Lilliput SDA Church"
        description="A warm, welcoming community in the heart of St. James, Jamaica. Join us as we grow together in faith, love, and service."
        badge="Growing together in faith since 1974"
        backgroundImage={getPlaceholderImage(1920, 1080, "Church+Building")}
        primaryAction={{ label: "Plan Your Visit", href: "/events" }}
        secondaryAction={{ label: "Watch Online", href: "/media" }}
        quickInfo={quickInfoContent}
      />

      <AboutSplit
        label="About Our Church"
        title="A Place to Belong, Believe, and Become"
        description="Founded in 1974, Lilliput SDA Church has been a beacon of hope and faith in the St. James community for over 50 years. With over 700 members, we are a vibrant, welcoming congregation dedicated to sharing God's love through worship, fellowship, and service."
        additionalText="Whether you're a lifelong Adventist or just beginning your spiritual journey, there's a place for you here. Come experience the warmth of our church family."
        imageSrc={getPlaceholderImage(800, 600, "Church+Congregation")}
        imageAlt="Church congregation"
        stats={{ value: "700+", label: "Active Members", position: "bottom-left" }}
        action={{ label: "Learn Our Story", href: "/about" }}
      />

      <section className="py-16 lg:py-24 bg-stone-50 dark:bg-stone-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            label="Latest Message"
            title="Recent Sermons"
            href="/media"
            linkText="View All"
          />
          {videosLoading ? (
            <div className="flex gap-6 overflow-x-auto pb-4 -mx-4 px-4">
              {[1, 2].map((i) => (
                <div key={i} className="w-[280px] sm:w-[320px] lg:w-[360px] flex-shrink-0">
                  <div className="bg-white dark:bg-stone-800 rounded-xl overflow-hidden shadow-md">
                    <div className="aspect-video bg-stone-200 dark:bg-stone-700 shimmer" />
                    <div className="p-4 space-y-3">
                      <div className="h-5 bg-stone-200 dark:bg-stone-700 rounded shimmer" />
                      <div className="h-4 w-3/4 bg-stone-200 dark:bg-stone-700 rounded shimmer" />
                      <div className="h-3 w-1/2 bg-stone-200 dark:bg-stone-700 rounded shimmer" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex gap-6 overflow-x-auto pb-4 -mx-4 px-4">
              {sermonCards.slice(0, 2)}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-amber-50 dark:bg-amber-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            label="Voices of Faith"
            title="Member Testimonies"
            href="/testimonies"
            linkText="View All"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-stone-800 rounded-xl p-6 shadow-sm border-l-4 border-amber-500">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <span className="text-amber-700 dark:text-amber-400 font-bold text-lg">S</span>
                </div>
                <div>
                  <p className="font-semibold text-stone-900 dark:text-stone-100">Sister Marie T.</p>
                  <p className="text-sm text-stone-500 dark:text-stone-400">Member since 2010</p>
                </div>
              </div>
              <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
                "When I first walked through these doors, I was searching for answers. The warmth and acceptance I found here changed my life forever. Lilliput became my family."
              </p>
            </div>

            <div className="bg-white dark:bg-stone-800 rounded-xl p-6 shadow-sm border-l-4 border-amber-500">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <span className="text-amber-700 dark:text-amber-400 font-bold text-lg">B</span>
                </div>
                <div>
                  <p className="font-semibold text-stone-900 dark:text-stone-100">Brother David J.</p>
                  <p className="text-sm text-stone-500 dark:text-stone-400">Youth Leader</p>
                </div>
              </div>
              <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
                "Growing up in this church, I experienced God's love through mentors who invested in my life. Now I have the privilege of pouring into the next generation."
              </p>
            </div>

            <div className="bg-white dark:bg-stone-800 rounded-xl p-6 shadow-sm border-l-4 border-amber-500 md:hidden lg:block">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <span className="text-amber-700 dark:text-amber-400 font-bold text-lg">A</span>
                </div>
                <div>
                  <p className="font-semibold text-stone-900 dark:text-stone-100">Sister Angela R.</p>
                  <p className="text-sm text-stone-500 dark:text-stone-400">Women's Ministry</p>
                </div>
              </div>
              <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
                "The sisterhood here is powerful. Through prayer and fellowship, I've witnessed lives transformed and bonds formed that will last for eternity."
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            label="What's Happening"
            title="Upcoming Events"
            href="/events"
            linkText="View Calendar"
            icon={Calendar}
          />
          {renderEvents()}
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-stone-50 dark:bg-stone-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            label="Church News"
            title="Latest Announcements"
            href="/events"
            linkText="View All"
          />
          {renderAnnouncements()}
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <SectionHeader
              label="Get Involved"
              title="Our Ministries"
              className="justify-center text-center"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {ministries.map((ministry) => (
              <QuickMinistryCard key={ministry.name} {...ministry} />
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Ready to Visit?"
        description="We'd love to welcome you to Lilliput SDA Church. Whether you're looking for a church home or just visiting, you're welcome here."
        primaryAction={{
          label: "Service Times",
          href: "/events",
          variant: "primary",
        }}
        secondaryAction={{
          label: "Contact Us",
          href: "/contact",
          variant: "outline",
        }}
        backgroundColor="amber"
      />
    </div>
  );
}
