"use client";

import { Clock, MapPin, Play, Calendar } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { EventCard, AnnouncementCard } from "@/components/ui/Card";
import { CHURCH_IMAGES } from "@/lib/utils";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { QuickInfo } from "@/components/sections/QuickInfo";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSplit } from "@/components/sections/AboutSplit";
import { QuickMinistryCard } from "@/components/cards/QuickMinistryCard";
import { CTASection } from "@/components/sections/CTASection";
import { SermonList, VideoModal } from "@/components/media";
import { TestimonialCard } from "@/components/cards/TestimonialCard";
import type { YouTubeVideo } from "@/types";

const staticEvents = [
  {
    _id: "static-1",
    title: "Global Youth Day",
    startDate: "2026-03-21T09:00:00",
    location: "Lilliput SDA Church",
    category: "youth" as const,
    description: "Join youth around the world in a day of service and fellowship."
  },
  {
    _id: "static-2",
    title: "Convention",
    startDate: "2026-03-28T10:00:00",
    location: "Lilliput SDA Church",
    category: "special" as const,
    description: "Annual church convention featuring inspiring speakers and worship."
  },
  {
    _id: "static-3",
    title: "LILLIDISCA CAMP",
    startDate: "2026-04-02T08:00:00",
    endDate: "2026-04-06T18:00:00",
    location: "Camp Site",
    category: "youth" as const,
    description: "Five-day camp experience for spiritual growth and fellowship."
  }
];

const staticAnnouncements = [
  {
    _id: "ann-1",
    title: "Weekly Bulletin",
    content: "Our weekly bulletin is published every Friday with updates on events and ministries.",
    date: new Date().toISOString(),
    priority: "low" as const,
    category: "general"
  },
  {
    _id: "ann-2",
    title: "Sabbath School",
    content: "Join us for Sabbath School at 9:30 AM before the main service.",
    date: new Date().toISOString(),
    priority: "normal" as const,
    category: "general"
  }
];

export default function Home() {
  const [currentTime] = useState<number>(() => {
    if (typeof window === "undefined") return 1742236800000;
    return 1742236800000;
  });
  
  const [sermonVideos, setSermonVideos] = useState<YouTubeVideo[]>([]);
  const [videosLoading, setVideosLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);

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
        href="/visit"
      />
      <QuickInfo icon={MapPin} label="Location" value="Lilliput, Montego Bay" href="/visit" />
      <QuickInfo icon={Play} label="Livestream" value="Watch Online" href="/media" />
    </div>
  ), []);

  const ministries = useMemo(() => [
    { name: "Youth Ministries", imageUrl: CHURCH_IMAGES.ministries.youth.worship, bgColor: "bg-gradient-to-br from-emerald-500 to-emerald-700", href: "/ministries" },
    { name: "Women's Ministry", imageUrl: CHURCH_IMAGES.ministries.womens.main, bgColor: "bg-gradient-to-br from-rose-300 to-rose-500", href: "/ministries" },
    { name: "Men's Ministry", imageUrl: CHURCH_IMAGES.ministries.mens.main, bgColor: "bg-gradient-to-br from-stone-500 to-stone-700", href: "/ministries" },
    { name: "Music Ministry", imageUrl: CHURCH_IMAGES.ministries.music.worship, bgColor: "bg-gradient-to-br from-amber-500 to-amber-700", href: "/ministries" },
  ], []);

  const displayEvents = staticEvents.slice(0, 3);
  const featured = displayEvents[0];
  const others = displayEvents.slice(1, 3);

  return (
    <div className="min-h-screen">
      <HeroSection
        title="Welcome to"
        subtitle="Lilliput SDA Church"
        description="A warm, welcoming community in the heart of St. James, Jamaica. Join us as we grow together in faith, love, and service."
        badge="Growing together in faith since 1974"
        badgeHref="/about"
        backgroundImage={CHURCH_IMAGES.hero.churchBuilding}
        primaryAction={{ label: "Plan Your Visit", href: "/visit" }}
        secondaryAction={{ label: "Watch Online", href: "/media" }}
        quickInfo={quickInfoContent}
      />

      <AboutSplit
        label="About Our Church"
        title="A Place to Belong, Believe, and Become"
        description="Founded in 1974, Lilliput SDA Church has been a beacon of hope and faith in the St. James community for over 50 years. With over 700 members, we are a vibrant, welcoming congregation dedicated to sharing God's love through worship, fellowship, and service."
        additionalText="Whether you're a lifelong Adventist or just beginning your spiritual journey, there's a place for you here. Come experience the warmth of our church family."
        imageSrc={CHURCH_IMAGES.congregation.main}
        imageAlt="Church congregation"
        stats={{ value: "700+", label: "Active Members", position: "bottom-left" }}
        action={{ label: "Learn Our Story", href: "/about" }}
      />

      <section className="py-20 lg:py-28 bg-white dark:bg-stone-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            label="Latest Message"
            title="Recent Sermons"
            href="/media"
            linkText="View All"
          />
          <SermonList
            videos={sermonVideos}
            onVideoClick={setSelectedVideo}
            loading={videosLoading}
            maxItems={2}
          />
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-50 dark:from-amber-900/10 dark:via-orange-900/10 dark:to-amber-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            label="Voices of Faith"
            title="Member Testimonies"
            href="/testimonies"
            linkText="View All"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <TestimonialCard
              name="Sister Marie T."
              role="Member"
              memberSince="2010"
              content="When I first walked through these doors, I was searching for answers. The warmth and acceptance I found here changed my life forever. Lilliput became my family."
            />
            <TestimonialCard
              name="Brother David J."
              role="Youth Leader"
              content="Growing up in this church, I experienced God's love through mentors who invested in my life. Now I have the privilege of pouring into the next generation."
            />
            <TestimonialCard
              name="Sister Angela R."
              role="Women's Ministry"
              content="The sisterhood here is powerful. Through prayer and fellowship, I've witnessed lives transformed and bonds formed that will last for eternity."
            />
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-stone-50 dark:bg-stone-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            label="What's Happening"
            title="Upcoming Events"
            href="/events"
            linkText="View Calendar"
            icon={Calendar}
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-1">
              <div className="h-full">
                <EventCard
                  title={featured.title}
                  date={featured.startDate}
                  time={featured.endDate ? `${featured.startDate.split('T')[1]?.slice(0, 5)} - ${featured.endDate.split('T')[1]?.slice(0, 5)}` : undefined}
                  location={featured.location}
                  category={featured.category}
                  description={featured.description}
                  featured
                />
              </div>
            </div>
            <div className="space-y-6">
              {others.map((event) => (
                <EventCard
                  key={event._id}
                  title={event.title}
                  date={event.startDate}
                  time={event.endDate ? `${event.startDate.split('T')[1]?.slice(0, 5)} - ${event.endDate.split('T')[1]?.slice(0, 5)}` : undefined}
                  location={event.location || "TBD"}
                  category={event.category}
                  description={event.description}
                  compact
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-white dark:bg-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            label="Church News"
            title="Latest Announcements"
            href="/events"
            linkText="View All"
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {staticAnnouncements.map((announcement) => (
              <AnnouncementCard
                key={announcement._id}
                title={announcement.title}
                content={announcement.content}
                date={announcement.date}
                priority={announcement.priority}
                category={announcement.category}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-stone-50 dark:bg-stone-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <SectionHeader
              label="Get Involved"
              title="Our Ministries"
              className="justify-center text-center"
              align="center"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
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

      <VideoModal
        video={selectedVideo}
        onClose={() => setSelectedVideo(null)}
      />
    </div>
  );
}